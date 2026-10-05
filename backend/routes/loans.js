import express from 'express';
import Loan from '../models/Loan.js';
import auth from '../middleware/auth.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import {
  calculateEMI,
  getFullEmiChart,
  EMI_CHART_AMOUNTS,
  EMI_CHART_TENURES,
  ALLOWED_TENURES_MAP,
  MONTHLY_INTEREST_RATE
} from '../utils/emiCalculator.js';

const router = express.Router();

// Helper to automatically check and transition withdrawal status to 'Failed' if 30 minutes elapsed
export const checkAndUpdateWithdrawalStatus = async (loan) => {
  if (!loan || !loan.withdrawalTriggered || !loan.withdrawalStartedAt) {
    return loan;
  }
  const startedTime = new Date(loan.withdrawalStartedAt).getTime();
  const elapsedMinutes = (Date.now() - startedTime) / (1000 * 60);

  if (elapsedMinutes >= 30) {
    if (loan.withdrawalStatus !== 'Failed') {
      loan.withdrawalStatus = 'Failed';
      loan.withdrawalFailedAt = loan.withdrawalFailedAt || new Date();
      if (!loan.withdrawalFailureReason) {
        loan.withdrawalFailureReason = 'Disbursal Clearance Gateway Timeout (30 minutes elapsed). Automated settlement interrupted.';
      }
      await loan.save();
    }
  } else {
    if (loan.withdrawalStatus !== 'Processing') {
      loan.withdrawalStatus = 'Processing';
      await loan.save();
    }
  }
  return loan;
};


// Get official EMI Chart schedule and calculation matrix (Public)
router.get('/emi-chart', (req, res) => {
  try {
    const chart = getFullEmiChart();
    res.json({
      success: true,
      interestRate: MONTHLY_INTEREST_RATE,
      unit: 'INR',
      rounding: 'nearest_rupee',
      amounts: EMI_CHART_AMOUNTS,
      tenures: EMI_CHART_TENURES,
      allowedTenuresMap: ALLOWED_TENURES_MAP,
      chart
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Apply for a loan (Public)
router.post('/apply', async (req, res) => {
  try {
    const loanData = req.body;

    // Ensure default interest rate and proper EMI if loanAmount and loanDuration exist
    if (loanData.loanAmount && loanData.loanDuration) {
      loanData.interestRate = loanData.interestRate || MONTHLY_INTEREST_RATE;
      if (!loanData.emi) {
        loanData.emi = calculateEMI(loanData.loanAmount, loanData.loanDuration, loanData.interestRate);
      }
    }
    
    // Upload KYC files and selfies to Cloudinary
    if (loanData.kycFiles) {
      const kyc = loanData.kycFiles;
      if (kyc.panCard && kyc.panCard.data) {
        kyc.panCard.data = await uploadToCloudinary(kyc.panCard.data, 'avivaa/kyc');
      }
      if (kyc.aadhaarFront && kyc.aadhaarFront.data) {
        kyc.aadhaarFront.data = await uploadToCloudinary(kyc.aadhaarFront.data, 'avivaa/kyc');
      }
      if (kyc.aadhaarBack && kyc.aadhaarBack.data) {
        kyc.aadhaarBack.data = await uploadToCloudinary(kyc.aadhaarBack.data, 'avivaa/kyc');
      }
      if (kyc.nomineeDoc && kyc.nomineeDoc.data) {
        kyc.nomineeDoc.data = await uploadToCloudinary(kyc.nomineeDoc.data, 'avivaa/kyc');
      }
      if (kyc.selfieImage) {
        kyc.selfieImage = await uploadToCloudinary(kyc.selfieImage, 'avivaa/selfies');
      }
    }
    
    // Find existing loan by mobileNumber and update, or create a new one
    let savedLoan;
    const existingLoan = await Loan.findOne({ mobileNumber: loanData.mobileNumber });
    
    if (existingLoan) {
      // Intelligently merge fields to avoid overwriting existing files and details with empty drafts
      for (const key of Object.keys(loanData)) {
        if (key === 'kycFiles' && loanData.kycFiles) {
          existingLoan.kycFiles = existingLoan.kycFiles || {};
          for (const docKey of ['panCard', 'aadhaarFront', 'aadhaarBack', 'nomineeDoc']) {
            if (loanData.kycFiles[docKey] && loanData.kycFiles[docKey].data) {
              existingLoan.kycFiles[docKey] = loanData.kycFiles[docKey];
            }
          }
          if (loanData.kycFiles.selfieImage) {
            existingLoan.kycFiles.selfieImage = loanData.kycFiles.selfieImage;
          }
          existingLoan.markModified('kycFiles');
        } else if (key === 'bankDetails' && loanData.bankDetails) {
          existingLoan.bankDetails = existingLoan.bankDetails || {};
          for (const bankKey of ['accountHolder', 'bankName', 'accountNumber', 'ifscCode']) {
            const val = loanData.bankDetails[bankKey];
            if (val !== undefined && val !== null && String(val).trim() !== '') {
              existingLoan.bankDetails[bankKey] = val;
            }
          }
          existingLoan.markModified('bankDetails');
        } else if (loanData[key] !== undefined && loanData[key] !== null) {
          if (typeof loanData[key] === 'string') {
            if (loanData[key].trim() !== '') {
              existingLoan[key] = loanData[key];
            }
          } else {
            existingLoan[key] = loanData[key];
          }
        }
      }
      savedLoan = await existingLoan.save();
    } else {
      const newLoan = new Loan(loanData);
      savedLoan = await newLoan.save();
    }
    
    res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully!',
      loanId: savedLoan._id,
      loan: savedLoan
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all loan applications (Protected)
router.get('/', auth, async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });
    for (const loan of loans) {
      if (loan.withdrawalTriggered && loan.withdrawalStartedAt && loan.withdrawalStatus !== 'Failed') {
        await checkAndUpdateWithdrawalStatus(loan);
      }
    }
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update loan application status (Protected)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Pending', 'Approved', 'Rejected', 'Hold'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const updatedLoan = await Loan.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!updatedLoan) {
      return res.status(444).json({ message: 'Loan application not found' });
    }
    
    res.json(updatedLoan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update bank account number (Protected)
router.put('/:id/account-number', auth, async (req, res) => {
  try {
    const { accountNumber } = req.body;
    
    if (!accountNumber) {
      return res.status(400).json({ message: 'Account number is required' });
    }
    
    const updatedLoan = await Loan.findByIdAndUpdate(
      req.params.id,
      { 'bankDetails.accountNumber': accountNumber },
      { new: true }
    );
    
    if (!updatedLoan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }
    
    res.json(updatedLoan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update entire loan application details (Protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const loanId = req.params.id;
    const updateData = req.body;
    
    const updateFields = {};
    const directFields = [
      'fullName', 'mobileNumber', 'email', 'dob', 'panNumber', 'aadhaarNumber',
      'employmentType', 'companyName', 'monthlyIncome', 'nomineeName', 'nomineeRelation',
      'password', 'loanAmount', 'loanDuration', 'emi', 'interestRate', 'status', 'walletAmount',
      'currentStep', 'withdrawalTriggered', 'withdrawalStartedAt', 'withdrawalStatus',
      'withdrawalFailureReason', 'withdrawalFailedAt'
    ];
    
    directFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updateFields[field] = updateData[field];
      }
    });
    
    // Handle nested bankDetails
    if (updateData.bankDetails) {
      updateFields.bankDetails = {
        bankName: updateData.bankDetails.bankName,
        ifscCode: updateData.bankDetails.ifscCode,
        accountHolder: updateData.bankDetails.accountHolder,
        accountNumber: updateData.bankDetails.accountNumber
      };
    } else {
      const bankFields = ['bankName', 'ifscCode', 'accountHolder', 'accountNumber'];
      const hasBankFields = bankFields.some(f => updateData[f] !== undefined);
      if (hasBankFields) {
        const currentLoan = await Loan.findById(loanId);
        const currentBankDetails = currentLoan ? currentLoan.bankDetails : {};
        
        updateFields.bankDetails = {
          bankName: updateData.bankName !== undefined ? updateData.bankName : currentBankDetails.bankName,
          ifscCode: updateData.ifscCode !== undefined ? updateData.ifscCode : currentBankDetails.ifscCode,
          accountHolder: updateData.accountHolder !== undefined ? updateData.accountHolder : currentBankDetails.accountHolder,
          accountNumber: updateData.accountNumber !== undefined ? updateData.accountNumber : currentBankDetails.accountNumber
        };
      }
    }
    
    // If loanAmount or loanDuration is updated without explicit emi, recalculate emi
    if (updateFields.loanAmount && updateFields.loanDuration && !updateFields.emi) {
      const rate = updateFields.interestRate || MONTHLY_INTEREST_RATE;
      updateFields.emi = calculateEMI(updateFields.loanAmount, updateFields.loanDuration, rate);
    }

    const updatedLoan = await Loan.findByIdAndUpdate(
      loanId,
      { $set: updateFields },
      { new: true }
    );
    
    if (!updatedLoan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }
    
    res.json(updatedLoan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Promote/convert lead to full application (Protected)
router.put('/:id/promote-lead', auth, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    loan.currentStep = 8;
    if (!loan.status || loan.status === 'Hold') {
      loan.status = 'Pending';
    }
    await loan.save();

    res.json({
      success: true,
      message: 'Lead converted to full application successfully',
      loan
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a loan application (Protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    // Delete associated files from Cloudinary
    if (loan.kycFiles) {
      const kyc = loan.kycFiles;
      if (kyc.panCard && kyc.panCard.data) await deleteFromCloudinary(kyc.panCard.data);
      if (kyc.aadhaarFront && kyc.aadhaarFront.data) await deleteFromCloudinary(kyc.aadhaarFront.data);
      if (kyc.aadhaarBack && kyc.aadhaarBack.data) await deleteFromCloudinary(kyc.aadhaarBack.data);
      if (kyc.nomineeDoc && kyc.nomineeDoc.data) await deleteFromCloudinary(kyc.nomineeDoc.data);
      if (kyc.selfieImage) await deleteFromCloudinary(kyc.selfieImage);
    }
    if (loan.adminPdf && loan.adminPdf.data) {
      await deleteFromCloudinary(loan.adminPdf.data);
    }

    // Now delete from MongoDB
    await Loan.findByIdAndDelete(req.params.id);
    
    res.json({ success: true, message: 'Loan application and all associated media deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Batch delete multiple loan applications (Protected)
router.post('/batch-delete', auth, async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Array of loan IDs is required' });
    }

    const loans = await Loan.find({ _id: { $in: ids } });

    // Clean up associated media from Cloudinary
    for (const loan of loans) {
      try {
        if (loan.kycFiles) {
          const kyc = loan.kycFiles;
          if (kyc.panCard && kyc.panCard.data) await deleteFromCloudinary(kyc.panCard.data);
          if (kyc.aadhaarFront && kyc.aadhaarFront.data) await deleteFromCloudinary(kyc.aadhaarFront.data);
          if (kyc.aadhaarBack && kyc.aadhaarBack.data) await deleteFromCloudinary(kyc.aadhaarBack.data);
          if (kyc.nomineeDoc && kyc.nomineeDoc.data) await deleteFromCloudinary(kyc.nomineeDoc.data);
          if (kyc.selfieImage) await deleteFromCloudinary(kyc.selfieImage);
        }
        if (loan.adminPdf && loan.adminPdf.data) {
          await deleteFromCloudinary(loan.adminPdf.data);
        }
      } catch (mediaErr) {
        console.warn(`Error deleting media for loan ${loan._id}:`, mediaErr.message);
      }
    }

    // Delete matching documents from MongoDB
    const result = await Loan.deleteMany({ _id: { $in: ids } });

    res.json({
      success: true,
      message: `${result.deletedCount} application records deleted successfully`,
      deletedCount: result.deletedCount
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get status of loan application by mobile number (Public)
router.get('/status/:mobileNumber', async (req, res) => {
  try {
    let loan = await Loan.findOne({ mobileNumber: req.params.mobileNumber }).sort({ createdAt: -1 });
    if (!loan) {
      return res.status(404).json({ message: 'No loan application found for this mobile number' });
    }
    loan = await checkAndUpdateWithdrawalStatus(loan);
    res.json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Trigger withdrawal (Public)
router.post('/:id/withdraw', async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    if (loan.status !== 'Approved') {
      return res.status(400).json({ message: 'Loan must be approved before triggering withdrawal' });
    }

    loan.withdrawalTriggered = true;
    loan.withdrawalStartedAt = new Date();
    loan.withdrawalStatus = 'Processing';
    loan.withdrawalFailureReason = '';
    loan.withdrawalFailedAt = null;
    await loan.save();

    res.json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Retry / Reset withdrawal (Protected or Public for ease of re-triggering disbursal queue)
router.post('/:id/retry-withdrawal', async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    loan.withdrawalTriggered = true;
    loan.withdrawalStartedAt = new Date();
    loan.withdrawalStatus = 'Processing';
    loan.withdrawalFailureReason = '';
    loan.withdrawalFailedAt = null;
    await loan.save();

    res.json(loan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Correct bank details by applicant on failure screen (Public)
router.put('/:id/correct-bank-details', async (req, res) => {
  try {
    const { accountNumber, ifscCode, bankName, accountHolder, mobileNumber } = req.body;

    if (!accountNumber) {
      return res.status(400).json({ message: 'Account number is required' });
    }

    const loan = await Loan.findById(req.params.id);
    if (!loan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    if (mobileNumber && loan.mobileNumber !== mobileNumber) {
      return res.status(403).json({ message: 'Unauthorized: Mobile number mismatch' });
    }

    loan.bankDetails = loan.bankDetails || {};
    loan.bankDetails.accountNumber = accountNumber;
    if (ifscCode) loan.bankDetails.ifscCode = ifscCode;
    if (bankName) loan.bankDetails.bankName = bankName;
    if (accountHolder) loan.bankDetails.accountHolder = accountHolder;

    loan.withdrawalFailureReason = 'Account number updated by applicant. Verification pending.';
    await loan.save();

    res.json({
      success: true,
      message: 'Bank account details updated successfully',
      loan
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload agreement PDF for a specific loan (Protected)
// Flow: Admin uploads PDF → Cloudinary stores file → URL saved in MongoDB
// User downloads via /pdf-proxy which fetches from Cloudinary server-side
router.put('/:id/upload-pdf', auth, async (req, res) => {
  try {
    const { name, data } = req.body;

    if (!name || !data) {
      return res.status(400).json({ message: 'Please provide both PDF filename and base64 data' });
    }

    // Upload PDF to Cloudinary (proper file storage)
    const cloudinaryUrl = await uploadToCloudinary(data, 'avivaa/agreements');

    const updatedLoan = await Loan.findByIdAndUpdate(
      req.params.id,
      { adminPdf: { name, data: cloudinaryUrl } },
      { new: true }
    );

    if (!updatedLoan) {
      return res.status(404).json({ message: 'Loan application not found' });
    }

    res.json(updatedLoan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------------------------
// PDF Proxy Endpoint (Public) — Fetches PDF from Cloudinary server-side
// and streams it to the client, bypassing Cloudinary's untrusted-customer
// browser block. The browser never touches Cloudinary directly.
// -----------------------------------------------------------------------
router.get('/:id/pdf-proxy', async (req, res) => {
  try {
    const loan = await Loan.findById(req.params.id);

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    if (!loan.adminPdf || !loan.adminPdf.data) {
      return res.status(404).json({ message: 'No PDF available for this loan' });
    }

    const pdfUrl = loan.adminPdf.data;
    const pdfName = loan.adminPdf.name || 'loan-agreement.pdf';

    // If the stored data is a base64 string (not a URL), send it directly
    if (!pdfUrl.startsWith('http')) {
      const base64Data = pdfUrl.replace(/^data:application\/pdf;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${pdfName}"`);
      res.setHeader('Content-Length', buffer.length);
      return res.send(buffer);
    }

    // Fetch the PDF from Cloudinary on the server side (no browser restriction)
    const response = await fetch(pdfUrl);

    if (!response.ok) {
      return res.status(502).json({ message: `Failed to fetch PDF from storage: ${response.status}` });
    }

    // Stream it back to the client as a download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${pdfName}"`);

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.setHeader('Content-Length', buffer.length);
    return res.send(buffer);

  } catch (err) {
    console.error('PDF proxy error:', err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;

