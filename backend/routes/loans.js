import express from 'express';
import Loan from '../models/Loan.js';
import auth from '../middleware/auth.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

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
router.put('/:id/upload-pdf', auth, async (req, res) => {
  try {
    const { name, data } = req.body;
    
    if (!name || !data) {
      return res.status(400).json({ message: 'Please provide both PDF filename and base64 data' });
    }

    // Upload PDF to Cloudinary
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

export default router;
