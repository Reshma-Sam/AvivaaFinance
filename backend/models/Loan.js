import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  dob: {
    type: String,
    required: true
  },
  panNumber: {
    type: String,
    required: true
  },
  aadhaarNumber: {
    type: String,
    required: true
  },
  employmentType: {
    type: String,
    required: true
  },
  companyName: String,
  monthlyIncome: {
    type: Number,
    required: true
  },
  nomineeName: {
    type: String,
    required: true
  },
  nomineeRelation: {
    type: String,
    required: true
  },
  loanAmount: {
    type: Number,
    required: true
  },
  loanDuration: {
    type: Number,
    required: true
  },
  emi: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    required: true
  },
  kycFiles: {
    panCard: {
      name: String,
      data: String // Base64 data url
    },
    aadhaarFront: {
      name: String,
      data: String
    },
    aadhaarBack: {
      name: String,
      data: String
    },
    nomineeDoc: {
      name: String,
      data: String
    },
    selfieImage: String // Base64 selfie
  },
  bankDetails: {
    accountHolder: {
      type: String,
      required: true
    },
    bankName: {
      type: String,
      required: true
    },
    accountNumber: {
      type: String,
      required: true
    },
    ifscCode: {
      type: String,
      required: true
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  adminPdf: {
    name: String,
    data: String // Base64 PDF file
  },
  withdrawalTriggered: {
    type: Boolean,
    default: false
  },
  withdrawalStartedAt: {
    type: Date
  },
  password: {
    type: String
  },
  email: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Loan', loanSchema);
