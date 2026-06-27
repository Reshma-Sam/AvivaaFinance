import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema({
  loanId: {
    type: String,
    unique: true,
    sparse: true // sparse allows existing null/undefined values without duplicate key errors
  },
  mobileNumber: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  dob: {
    type: String
  },
  panNumber: {
    type: String
  },
  aadhaarNumber: {
    type: String
  },
  employmentType: {
    type: String
  },
  companyName: String,
  monthlyIncome: {
    type: Number
  },
  nomineeName: {
    type: String
  },
  nomineeRelation: {
    type: String
  },
  loanAmount: {
    type: Number
  },
  loanDuration: {
    type: Number
  },
  emi: {
    type: Number
  },
  interestRate: {
    type: Number
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
      type: String
    },
    bankName: {
      type: String
    },
    accountNumber: {
      type: String
    },
    ifscCode: {
      type: String
    }
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected', 'Hold'],
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
  walletAmount: {
    type: Number,
    default: 0
  },
  currentStep: {
    type: Number,
    default: 2
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

loanSchema.pre('save', function (next) {
  if (!this.loanId) {
    this.loanId = `AV-${Math.floor(100000 + Math.random() * 900000)}`;
  }
  next();
});

export default mongoose.model('Loan', loanSchema);
