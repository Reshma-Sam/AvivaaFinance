import express from 'express';
import Loan from '../models/Loan.js';
import auth from '../middleware/auth.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';

const router = express.Router();

// Apply for a loan (Public)
router.post('/apply', async (req, res) => {
  try {
    const loanData = req.body;
    
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
      // Merge new data
      Object.assign(existingLoan, loanData);
      savedLoan = await existingLoan.save();
    } else {
      const newLoan = new Loan(loanData);
      savedLoan = await newLoan.save();
    }
    
    res.status(201).json({
      success: true,
      message: 'Loan application submitted successfully!',
      loanId: savedLoan._id
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all loan applications (Protected)
router.get('/', auth, async (req, res) => {
  try {
    const loans = await Loan.find().sort({ createdAt: -1 });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update loan application status (Protected)
router.put('/:id/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
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

// Get status of loan application by mobile number (Public)
router.get('/status/:mobileNumber', async (req, res) => {
  try {
    const loan = await Loan.findOne({ mobileNumber: req.params.mobileNumber }).sort({ createdAt: -1 });
    if (!loan) {
      return res.status(404).json({ message: 'No loan application found for this mobile number' });
    }
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
    await loan.save();

    res.json(loan);
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

