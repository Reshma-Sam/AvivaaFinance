import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowLeft, ArrowRight, Lock, ShieldCheck, Check, Camera, 
  Upload, User, CreditCard, Building2, Landmark, CheckCircle, 
  AlertCircle, MessageCircle, Phone, Info, Eye, EyeOff, Loader2,
  TrendingDown, Clock, Download, X
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.jpeg";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Stylized top Indian banks with simulated SVG logos for premium Awwwards look
const INDIAN_BANKS = [
  { 
    id: "sbi", 
    name: "State Bank of India", 
    code: "SBIN", 
    logo: (className) => (
      <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#00a5ec" />
        <circle cx="12" cy="12" r="4" fill="#ffffff" />
        <rect x="11.2" y="12" width="1.6" height="8" fill="#ffffff" />
      </svg>
    )
  },
  { 
    id: "hdfc", 
    name: "HDFC Bank", 
    code: "HDFC", 
    logo: (className) => (
      <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#1c3f94" />
        <path d="M5 8h14v2H5V8zm0 4h14v2H5v-2zm0 4h14v2H5v-2z" fill="#ffffff" />
        <rect x="10" y="5" width="4" height="14" fill="#e41a1a" />
      </svg>
    )
  },
  { 
    id: "icici", 
    name: "ICICI Bank", 
    code: "ICIC", 
    logo: (className) => (
      <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#ff7f00" />
        <circle cx="12" cy="12" r="8" stroke="#ffffff" strokeWidth="2" fill="none" />
        <path d="M12 7v10M9 9h6M9 15h6" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    )
  },
  { 
    id: "axis", 
    name: "Axis Bank", 
    code: "UTIB", 
    logo: (className) => (
      <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#860d3d" />
        <path d="M6 18L12 6l6 12h-3l-3-6-3 6H6z" fill="#ffffff" />
        <path d="M10 14h4" stroke="#860d3d" strokeWidth="2" />
      </svg>
    )
  },
  { 
    id: "kotak", 
    name: "Kotak Mahindra Bank", 
    code: "KKBK", 
    logo: (className) => (
      <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#ed1c24" />
        <circle cx="12" cy="12" r="7" stroke="#ffffff" strokeWidth="1.5" fill="none" />
        <text x="12" y="15.5" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">K</text>
      </svg>
    )
  },
  { 
    id: "pnb", 
    name: "Punjab National Bank", 
    code: "PUNB", 
    logo: (className) => (
      <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#9c0c14" />
        <circle cx="12" cy="12" r="7" stroke="#fdb813" strokeWidth="2" fill="none" />
      </svg>
    )
  },
  { 
    id: "bob", 
    name: "Bank of Baroda", 
    code: "BARB", 
    logo: (className) => (
      <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#f05a28" />
        <circle cx="12" cy="12" r="6" fill="#ffffff" />
        <path d="M12 6v12M6 12h12M7.75 7.75l8.5 8.5M7.75 16.25l8.5-8.5" stroke="#f05a28" strokeWidth="1" />
      </svg>
    )
  },
  { 
    id: "other", 
    name: "Other Indian Bank", 
    code: "", 
    logo: (className) => (
      <svg viewBox="0 0 24 24" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="6" fill="#475569" />
        <path d="M12 7v10M7 12h10" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
];

export default function Apply() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Login, 2: Personal Details, 3: Loan Eligibility, 4: Loan Config, 5: Document Upload, 6: Selfie Verification, 7: Bank Details, 8: Success
  
  // --- STATE FOR STEPS ---
  
  // Step 1: Login
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  // Step 2: Personal Details
  const [fullName, setFullName] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [dob, setDob] = useState("");
  const [employmentType, setEmploymentType] = useState("Salaried");
  const [companyName, setCompanyName] = useState(""); // SALARIED ONLY
  const [nomineeName, setNomineeName] = useState(""); // NOMINEE
  const [nomineeRelation, setNomineeRelation] = useState("Spouse"); // NOMINEE RELATION
  const [monthlyIncome, setMonthlyIncome] = useState("");
  const [formErrors, setFormErrors] = useState({});

  // Step 3: Loan Eligibility Check / Processing Simulation (controlled by a timer)
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatusText, setProcessingStatusText] = useState("Establishing secure channel...");

  // Step 4: Loan Config
  const [loanAmount, setLoanAmount] = useState(150000);
  const [tenure, setTenure] = useState(12); // months
  const interestRate = 0.5; // 0.5% monthly flat
  const [showMobileSummary, setShowMobileSummary] = useState(false);
  
  const emi = Math.round((loanAmount * (interestRate / 100) * Math.pow(1 + (interestRate / 100), tenure)) / (Math.pow(1 + (interestRate / 100), tenure) - 1));
  const totalInterest = emi * tenure - loanAmount;
  const processingFeeRate = 2.0; // 2% processing fee
  const processingFee = Math.round(loanAmount * (processingFeeRate / 100));
  const gstOnFee = Math.round(processingFee * 0.18); // 18% GST on fee
  const totalDeductions = processingFee + gstOnFee;
  const inHandAmount = loanAmount - totalDeductions;
  const totalRepay = emi * tenure;

  // Step 5: Uploads & Selfie
  const [panFile, setPanFile] = useState(null);
  const [aadhaarFrontFile, setAadhaarFrontFile] = useState(null);
  const [aadhaarBackFile, setAadhaarBackFile] = useState(null);
  const [nomineeDocFile, setNomineeDocFile] = useState(null); // NOMINEE ID PROOF
  const [previewImage, setPreviewImage] = useState(null);
  
  const [cameraActive, setCameraActive] = useState(false);
  const [selfieImage, setSelfieImage] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraError, setCameraError] = useState(null);

  // Step 6: Bank Account Details
  const [bankName, setBankName] = useState("");
  const [verifiedBankName, setVerifiedBankName] = useState(""); // VERIFIED BANK NAME (from IFSC lookup or selection)
  const [selectedBankId, setSelectedBankId] = useState(""); // CUSTOM DROPDOWN SELECT
  const [otherBankName, setOtherBankName] = useState(""); // FALLBACK FOR OTHER BANK
  const [showBankDropdown, setShowBankDropdown] = useState(false); // DROPDOWN OPEN/CLOSE
  const [accountNumber, setAccountNumber] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [bankErrors, setBankErrors] = useState({});

  // Step 6.5: Modern Awwwards processing loading simulation on submit
  const [isSubmittingApplication, setIsSubmittingApplication] = useState(false);
  const [submitProgress, setSubmitProgress] = useState(0);
  const [submitStatusText, setSubmitStatusText] = useState("Registering Secure Disbursal Channel...");
  const [submitError, setSubmitError] = useState(null);
  
  const [showSubmittedDetails, setShowSubmittedDetails] = useState(false);
  const [activeDbLoan, setActiveDbLoan] = useState(null);
  const [withdrawalTimeRemaining, setWithdrawalTimeRemaining] = useState(0);
  const [pollingLoading, setPollingLoading] = useState(false);

  // Poll status on Step 8 every 6 seconds to see if Admin updates it
  useEffect(() => {
    if (step !== 8 || !mobile) return;

    const fetchStatus = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/loans/status/${mobile}`);
        if (response.ok) {
          const loan = await response.json();
          setActiveDbLoan(loan);
        }
      } catch (err) {
        console.error("Failed to poll loan status:", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 6000);
    return () => clearInterval(interval);
  }, [step, mobile]);

  // Handle countdown timer for 30 minutes withdrawal
  useEffect(() => {
    if (!activeDbLoan || !activeDbLoan.withdrawalTriggered) {
      setWithdrawalTimeRemaining(0);
      return;
    }

    const calculateRemaining = () => {
      const startedTime = new Date(activeDbLoan.withdrawalStartedAt).getTime();
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - startedTime) / 1000);
      const totalSeconds = 30 * 60; // 30 minutes
      const remaining = Math.max(0, totalSeconds - elapsedSeconds);
      return remaining;
    };

    setWithdrawalTimeRemaining(calculateRemaining());

    const timer = setInterval(() => {
      const remaining = calculateRemaining();
      setWithdrawalTimeRemaining(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [activeDbLoan]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleInitiateWithdrawal = async () => {
    if (!activeDbLoan) return;
    try {
      const response = await fetch(`${API_BASE_URL}/loans/${activeDbLoan._id}/withdraw`, {
        method: 'POST'
      });
      if (!response.ok) {
        throw new Error('Failed to start withdrawal');
      }
      const updatedLoan = await response.json();
      setActiveDbLoan(updatedLoan);
    } catch (error) {
      console.error('Error starting withdrawal:', error);
      alert('Could not start withdrawal process. Please try again.');
    }
  };

  // Save application draft to backend
  const saveDraft = async (nextStep) => {
    try {
      const payload = {
        mobileNumber: mobile,
        fullName: fullName,
        email: email,
        password: password,
        currentStep: nextStep,
        dob,
        panNumber,
        aadhaarNumber,
        employmentType,
        companyName,
        monthlyIncome: monthlyIncome ? Number(monthlyIncome) : undefined,
        nomineeName,
        nomineeRelation,
        loanAmount: Number(loanAmount),
        loanDuration: Number(tenure),
        emi: Number(emi),
        interestRate: Number(interestRate),
        kycFiles: {
          panCard: panFile,
          aadhaarFront: aadhaarFrontFile,
          aadhaarBack: aadhaarBackFile,
          nomineeDoc: nomineeDocFile,
          selfieImage: selfieImage
        },
        bankDetails: {
          accountHolder,
          bankName: verifiedBankName || bankName,
          accountNumber,
          ifscCode
        }
      };

      const response = await fetch(`${API_BASE_URL}/loans/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Draft saved successfully:", data);
        // Refresh activeDbLoan state
        const statusRes = await fetch(`${API_BASE_URL}/loans/status/${mobile}`);
        if (statusRes.ok) {
          const fullLoan = await statusRes.json();
          setActiveDbLoan(fullLoan);
        }
      }
    } catch (err) {
      console.warn("Failed to save draft:", err);
    }
  };

  // Save application draft to backend with a newly uploaded file override
  const saveDraftWithFile = async (fieldName, fileObj) => {
    try {
      const payload = {
        mobileNumber: mobile,
        fullName: fullName,
        email: email,
        password: password,
        currentStep: step,
        dob,
        panNumber,
        aadhaarNumber,
        employmentType,
        companyName,
        monthlyIncome: monthlyIncome ? Number(monthlyIncome) : undefined,
        nomineeName,
        nomineeRelation,
        loanAmount: Number(loanAmount),
        loanDuration: Number(tenure),
        emi: Number(emi),
        interestRate: Number(interestRate),
        kycFiles: {
          panCard: fieldName === 'panCard' ? fileObj : panFile,
          aadhaarFront: fieldName === 'aadhaarFront' ? fileObj : aadhaarFrontFile,
          aadhaarBack: fieldName === 'aadhaarBack' ? fileObj : aadhaarBackFile,
          nomineeDoc: fieldName === 'nomineeDoc' ? fileObj : nomineeDocFile,
          selfieImage: selfieImage
        },
        bankDetails: {
          accountHolder,
          bankName: verifiedBankName || bankName,
          accountNumber,
          ifscCode
        }
      };

      const response = await fetch(`${API_BASE_URL}/loans/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        console.log(`KYC file ${fieldName} saved successfully`);
        // Refresh activeDbLoan state
        const statusRes = await fetch(`${API_BASE_URL}/loans/status/${mobile}`);
        if (statusRes.ok) {
          const fullLoan = await statusRes.json();
          setActiveDbLoan(fullLoan);
        }
      }
    } catch (err) {
      console.warn("Failed to save draft with file:", err);
    }
  };

  const handleFileChange = (file, setter, fieldName) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (e) => {
      const fileObj = {
        name: file.name,
        data: e.target.result
      };
      setter(fileObj);
      
      // Instantly upload this single file draft to backend
      saveDraftWithFile(fieldName, fileObj);
    };
    reader.readAsDataURL(file);
  };

  // --- HANDLERS ---

  // Handle Login Form Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (isSignUp) {
      if (!fullName.trim()) {
        setLoginError("Please enter your Full Name.");
        return;
      }
      if (mobile.length < 10) {
        setLoginError("Please enter a valid 10-digit mobile number.");
        return;
      }
      if (!email.trim() || !email.includes("@")) {
        setLoginError("Please enter a valid Email ID.");
        return;
      }
      if (password.length < 4) {
        setLoginError("Password must be at least 4 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setLoginError("Passwords do not match.");
        return;
      }
    } else {
      if (mobile.length < 10) {
        setLoginError("Please enter a valid 10-digit mobile number.");
        return;
      }
      if (password.length < 4) {
        setLoginError("Password must be at least 4 characters.");
        return;
      }
    }
    
    setPollingLoading(true);
    
    if (isSignUp) {
      setLoginError("Registering secure profile...");
      try {
        const response = await fetch(`${API_BASE_URL}/loans/status/${mobile}`);
        if (response.ok) {
          setLoginError("An account already exists for this mobile number. Please sign in instead.");
          setPollingLoading(false);
          return;
        }
        
        // Save initial user registration draft to MongoDB
        const registerPayload = {
          mobileNumber: mobile,
          fullName: fullName,
          email: email,
          password: password,
          currentStep: 2
        };
        const applyRes = await fetch(`${API_BASE_URL}/loans/apply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registerPayload)
        });
        
        if (applyRes.ok) {
          const statusRes = await fetch(`${API_BASE_URL}/loans/status/${mobile}`);
          if (statusRes.ok) {
            const fullLoan = await statusRes.json();
            setActiveDbLoan(fullLoan);
          }
          setLoginError("");
          setStep(2);
        } else {
          const errData = await applyRes.json();
          setLoginError(errData.error || "Failed to register account. Please try again.");
        }
      } catch (err) {
        console.warn("Could not reach backend, proceeding directly to Step 2", err);
        setLoginError("");
        setStep(2);
      } finally {
        setPollingLoading(false);
      }
    } else {
      setLoginError("Checking secure session coordinates...");
      try {
        const response = await fetch(`${API_BASE_URL}/loans/status/${mobile}`);
        if (response.ok) {
          const loan = await response.json();
          
          if (!loan.password || loan.password === password) {
            setFullName(loan.fullName || "");
            setEmail(loan.email || "");
            setDob(loan.dob || "");
            setPanNumber(loan.panNumber || "");
            setAadhaarNumber(loan.aadhaarNumber || "");
            setEmploymentType(loan.employmentType || "Salaried");
            setCompanyName(loan.companyName || "");
            setMonthlyIncome(loan.monthlyIncome || "");
            setNomineeName(loan.nomineeName || "");
            setNomineeRelation(loan.nomineeRelation || "Spouse");
            setLoanAmount(loan.loanAmount || 150000);
            setTenure(loan.loanDuration || 24);
            setAccountHolder(loan.bankDetails?.accountHolder || "");
            setBankName(loan.bankDetails?.bankName || "");
            setVerifiedBankName(loan.bankDetails?.bankName || "");
            setAccountNumber(loan.bankDetails?.accountNumber || "");
            setIfscCode(loan.bankDetails?.ifscCode || "");
            setPanFile(loan.kycFiles?.panCard || null);
            setAadhaarFrontFile(loan.kycFiles?.aadhaarFront || null);
            setAadhaarBackFile(loan.kycFiles?.aadhaarBack || null);
            setNomineeDocFile(loan.kycFiles?.nomineeDoc || null);
            setSelfieImage(loan.kycFiles?.selfieImage || null);
            setActiveDbLoan(loan);
            setLoginError("");
            
            // Restore step
            if (
              loan.currentStep === 8 ||
              (loan.status && loan.status !== "Pending") ||
              loan.withdrawalTriggered
            ) {
              setStep(8);
            } else if (loan.currentStep && loan.currentStep >= 2 && loan.currentStep < 8) {
              setStep(loan.currentStep);
            } else {
              setStep(2);
            }
          } else {
            setLoginError("Incorrect password. Please try again.");
          }
        } else if (response.status === 404) {
          setLoginError("No application found with this mobile number. Please check the number or sign up.");
        } else {
          setLoginError("Secure server connection issue. Please check back shortly.");
        }
      } catch (err) {
        console.warn("Could not check active loan status:", err);
        setLoginError("Unable to connect to the secure server. Please verify your internet connection and try again.");
      } finally {
        setPollingLoading(false);
      }
    }
  };

  // Skip Login logic trigger
  const handleSkipLogin = () => {
    setMobile("9999999999");
    setPassword("password");
    setLoginError("");
    setStep(2);
  };

  // Handle Personal Details Submit
  const handlePersonalSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!fullName.trim()) errors.fullName = "Full name is required";
    
    // PAN regex: 5 letters, 4 digits, 1 letter
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i;
    if (!panRegex.test(panNumber)) {
      errors.panNumber = "Please enter a valid PAN Card number (e.g. ABCDE1234F)";
    }
    
    // Aadhaar regex: 12 digits
    const cleanAadhaar = aadhaarNumber.replace(/\s/g, "");
    if (cleanAadhaar.length !== 12 || isNaN(cleanAadhaar)) {
      errors.aadhaarNumber = "Aadhaar Card number must be 12 digits";
    }

    if (!dob) errors.dob = "Date of birth is required";
    if (!monthlyIncome || isNaN(monthlyIncome) || Number(monthlyIncome) <= 0) {
      errors.monthlyIncome = "Please enter a valid monthly income";
    }

    // Dynamic validation for company name (Salaried only)
    if (employmentType === "Salaried" && !companyName.trim()) {
      errors.companyName = "Company name is required for salaried professionals";
    }

    // Validation for nominee name
    if (!nomineeName.trim()) {
      errors.nomineeName = "Nominee name is required";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setStep(3); // Proceed to Loan Eligibility Check
    saveDraft(3);
  };

  // Handle Loan Eligibility Check Proceed
  const handleLoanEligibilityProceed = () => {
    setStep(4); // Go to Loan Config/Selection
    saveDraft(4);
  };

  // Simulating the loan eligibility check step
  useEffect(() => {
    if (step === 3) {
      setProcessingProgress(0);
      setProcessingStatusText("Connecting to credit bureaus...");
      
      const interval = setInterval(() => {
        setProcessingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setStep(4); // Advance to Loan Config/Selection
              saveDraft(4);
            }, 1500);
            return 100;
          }
          
          const next = prev + Math.floor(Math.random() * 12) + 4;
          const capped = Math.min(next, 100);
          
          // Update message based on progress
          if (capped > 20 && capped <= 45) {
            setProcessingStatusText("Verifying Identity & KYC Registry...");
          } else if (capped > 45 && capped <= 75) {
            setProcessingStatusText("Analyzing Credit Profile & Scores...");
          } else if (capped > 75 && capped < 100) {
            setProcessingStatusText("Calculating Pre-Approved Credit Limit...");
          } else if (capped === 100) {
            setProcessingStatusText("Loan Pre-Approval Successful!");
          }
          
          return capped;
        });
      }, 600);

      return () => clearInterval(interval);
    }
  }, [step]);

  // Simulating the final application submission & disbursal registering step (Awwwards fintech-style loader)
  useEffect(() => {
    if (isSubmittingApplication) {
      setSubmitProgress(0);
      setSubmitStatusText("Initiating secure bank mapping corridor...");
      
      const interval = setInterval(() => {
        setSubmitProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setIsSubmittingApplication(false);
              setStep(8); // Proceed to Success Screen!
            }, 2000);
            return 100;
          }
          
          const next = prev + Math.floor(Math.random() * 14) + 5;
          const capped = Math.min(next, 100);
          
          // High-fidelity fintech micro-steps
          if (capped > 20 && capped <= 45) {
            setSubmitStatusText("Verifying Disbursal Account Holder alignment with PAN...");
          } else if (capped > 45 && capped <= 65) {
            setSubmitStatusText("Setting up e-Mandate & NACH auto-debit corridor...");
          } else if (capped > 65 && capped <= 85) {
            setSubmitStatusText("Generating and e-signing secure Loan Agreement Contract...");
          } else if (capped > 85 && capped < 100) {
            setSubmitStatusText("Securing funds allocation queue with RBI gateway...");
          } else if (capped === 100) {
            setSubmitStatusText("Cleared for instant disbursal credit!");
          }
          
          return capped;
        });
      }, 450);

      return () => clearInterval(interval);
    }
  }, [isSubmittingApplication]);

  // Handle Loan Config Proceed
  const handleLoanConfigProceed = () => {
    setStep(5); // Go to Document Upload & Selfie
    saveDraft(5);
  };

  // Auto-format PAN to Uppercase
  const handlePanChange = (e) => {
    setPanNumber(e.target.value.toUpperCase().slice(0, 10));
  };

  // Auto-format Aadhaar with spaces (XXXX XXXX XXXX)
  const handleAadhaarChange = (e) => {
    const rawVal = e.target.value.replace(/\s/g, "").replace(/\D/g, "");
    const limitedVal = rawVal.slice(0, 12);
    let formatted = "";
    for (let i = 0; i < limitedVal.length; i++) {
      if (i > 0 && i % 4 === 0) formatted += " ";
      formatted += limitedVal[i];
    }
    setAadhaarNumber(formatted);
  };

  // Camera handling for Selfie
  const startCamera = async () => {
    setCameraError(null);
    setCameraActive(true);
    setSelfieImage(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 480 }, height: { ideal: 480 } }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      setCameraError("Unable to access camera. Please upload a selfie manually instead.");
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      
      // Calculate circle coordinates to crop as square
      const size = Math.min(video.videoWidth, video.videoHeight);
      canvas.width = 400;
      canvas.height = 400;
      
      const startX = (video.videoWidth - size) / 2;
      const startY = (video.videoHeight - size) / 2;
      
      context.drawImage(video, startX, startY, size, size, 0, 0, 400, 400);
      
      const dataUrl = canvas.toDataURL("image/jpeg");
      setSelfieImage(dataUrl);
      stopCamera();
    }
  };

  const handleSelfieFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelfieImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Proceed from KYC uploads to Selfie Verification
  const handleKycProceed = () => {
    if (!panFile || !aadhaarFrontFile || !aadhaarBackFile) {
      alert("Please upload PAN card, Aadhaar card front, and Aadhaar card back to proceed.");
      return;
    }
    setStep(6);
    saveDraft(6);
  };

  // Proceed from Selfie Verification to Bank Details
  const handleUploadsProceed = () => {
    if (!selfieImage) {
      alert("A verified selfie is a mandatory requirement to proceed with your application.");
      return;
    }
    setStep(7);
    saveDraft(7);
  };

  const submitApplicationToBackend = async (verifiedBankName) => {
    setSubmitError(null);
    try {
      setSubmitStatusText("Encoding document payloads...");
      
      const fileToBase64 = (file) => {
        if (!file) return null;
        if (file.data) return file;
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve({ name: file.name, data: reader.result });
          reader.onerror = (error) => reject(error);
        });
      };

      const panBase64 = await fileToBase64(panFile);
      const aadhaarFrontBase64 = await fileToBase64(aadhaarFrontFile);
      const aadhaarBackBase64 = await fileToBase64(aadhaarBackFile);
      const nomineeDocBase64 = await fileToBase64(nomineeDocFile);

      setSubmitStatusText("Connecting to secure disbursal nodes...");

      const payload = {
        mobileNumber: mobile || "9876543210",
        password,
        email,
        fullName,
        dob,
        panNumber,
        aadhaarNumber,
        employmentType,
        companyName: employmentType === 'Salaried' ? companyName : '',
        monthlyIncome: parseFloat(monthlyIncome) || 0,
        nomineeName,
        nomineeRelation,
        loanAmount: Number(loanAmount),
        loanDuration: Number(tenure),
        emi: Number(emi),
        interestRate: Number(interestRate),
        kycFiles: {
          panCard: panBase64,
          aadhaarFront: aadhaarFrontBase64,
          aadhaarBack: aadhaarBackBase64,
          nomineeDoc: nomineeDocBase64,
          selfieImage: selfieImage
        },
        bankDetails: {
          accountHolder,
          bankName: verifiedBankName,
          accountNumber,
          ifscCode
        },
        currentStep: 8
      };

      const response = await fetch(`${API_BASE_URL}/loans/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit application to backend');
      }

      console.log('Loan application submitted to database:', data);
      
      const statusRes = await fetch(`${API_BASE_URL}/loans/status/${mobile || "9876543210"}`);
      if (statusRes.ok) {
        const loanObj = await statusRes.json();
        setActiveDbLoan(loanObj);
      }
    } catch (error) {
      console.error('Backend submission error:', error);
      setSubmitError(error.message || "Network timeout or connection error. Please try again.");
    }
  };

  // Handle Bank Details submit
  const handleBankSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    
    let verifiedBankName = bankName;
    if (!selectedBankId) {
      errors.bankName = "Please select your bank from the list";
    } else if (selectedBankId === "other") {
      if (!otherBankName.trim()) {
        errors.bankName = "Please enter your bank name";
      } else {
        verifiedBankName = otherBankName.trim();
      }
    } else {
      const selectedBankObj = INDIAN_BANKS.find(b => b.id === selectedBankId);
      verifiedBankName = selectedBankObj ? selectedBankObj.name : "";
    }

    if (!accountNumber) errors.accountNumber = "Account number is required";
    
    // Simple IFSC regex: 4 letters, 0, 6 letters/digits
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
    if (!ifscRegex.test(ifscCode)) {
      errors.ifscCode = "Please enter a valid 11-digit IFSC code (e.g. SBIN0012345)";
    }
    if (!accountHolder.trim()) errors.accountHolder = "Account holder name is required";

    if (Object.keys(errors).length > 0) {
      setBankErrors(errors);
      return;
    }

    setBankName(verifiedBankName);
    setBankErrors({});
    setIsSubmittingApplication(true); // Trigger the award winning disbursal processing screen!
    
    // Send to Node.js backend
    await submitApplicationToBackend(verifiedBankName);
  };

  // --- SUB-COMPONENTS FOR EACH STEP ---

  // Header progress bar
  const renderProgressHeader = () => {
    if (step === 1 || step === 8) return null;
    const progressPercent = ((step - 2) / 5) * 100; // Step 2 to 7 maps to 0% to 100%
    
    return (
      <div className="w-full bg-slate-100 py-2.5 px-4 md:py-4 md:px-6 border-b border-slate-200 shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <button 
            onClick={() => {
              if (step === 3) return; // Prevent backing out during loader
              if (cameraActive) stopCamera();
              
              if (step === 4) {
                setStep(2); // Skip Step 3 loader when going back to keep state
              } else {
                setStep(step - 1);
              }
            }}
            className="flex items-center gap-1.5 text-sm font-semibold text-brand-navy hover:text-brand-green transition-colors"
          >
            <ArrowLeft size={16} /> Back
          </button>
          
          <div className="flex-1 max-w-md bg-slate-200 h-2.5 rounded-full overflow-hidden relative">
            <div 
              className="bg-brand-green h-full rounded-full transition-all duration-500 ease-out" 
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <span className="text-xs font-bold text-slate-500 whitespace-nowrap">
            Step {step - 1} of 6
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen md:h-auto h-[100dvh] bg-slate-50 flex flex-col font-sans selection:bg-brand-green selection:text-white overflow-hidden md:overflow-y-auto">
      {/* Brand Header */}
      <header className="bg-white border-b border-slate-100 py-2.5 px-4 md:py-4 md:px-6 sticky top-0 z-40 shadow-sm flex items-center justify-between shrink-0">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center">
              <img src={logo} alt="AVIVAA" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-bold font-display text-brand-navy tracking-tight group-hover:text-brand-green transition-colors">
              Avivaa <span className="text-brand-green">Finance</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            {activeDbLoan && activeDbLoan.loanId && (
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-brand-navy bg-brand-green/15 border border-brand-green/20 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
                ID: {activeDbLoan.loanId}
              </div>
            )}
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
              <ShieldCheck size={14} className="text-brand-green" /> 256-Bit SSL Encrypted
            </div>
          </div>
        </div>
      </header>

      {renderProgressHeader()}

      <main className="flex-1 min-h-0 flex items-center justify-center p-2.5 md:p-8 relative overflow-hidden md:overflow-visible">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <AnimatePresence mode="wait">
          {/* STEP 1: LOGIN & REGISTRATION PAGE */}
          {step === 1 && (
            <motion.div
              key="step-login"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-5 md:p-6 max-h-full md:max-h-none overflow-y-auto md:overflow-visible flex flex-col scrollbar-thin"
              data-lenis-prevent
            >
              <div className="text-center mb-4">
                <div className="w-12 h-12 bg-brand-navy/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Lock className="text-brand-navy" size={22} />
                </div>
                <h2 className="text-2xl font-display font-bold text-brand-navy mb-1">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h2>
                <p className="text-slate-500 text-xs">
                  {isSignUp 
                    ? "Register your mobile number to begin applying." 
                    : "Sign in to access your active application status."}
                </p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                {isSignUp && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Full Name *</label>
                      <input 
                        type="text"
                        required
                        placeholder="Enter your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="input-field !py-2.5 !px-4 text-sm"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Email ID *</label>
                      <input 
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-field !py-2.5 !px-4 text-sm"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mobile Number *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">+91</span>
                    <input 
                      type="tel"
                      required
                      placeholder="Enter 10-digit number"
                      maxLength={10}
                      value={mobile}
                      onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="input-field !pl-14 !py-2.5 !px-4 text-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Password *</label>
                  </div>
                  <div className="relative">
                    <input 
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input-field !py-2.5 !px-4 text-sm"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy cursor-pointer"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {isSignUp && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Confirm Password *</label>
                    </div>
                    <div className="relative">
                      <input 
                        type={showConfirmPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-field !py-2.5 !px-4 text-sm"
                      />
                      <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-navy cursor-pointer"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                )}

                {loginError && (
                  <div className="flex items-center gap-2 text-red-500 text-xs font-semibold p-2.5 bg-red-50 rounded-xl">
                    <AlertCircle size={14} />
                    <span>{loginError}</span>
                  </div>
                )}

                <button 
                  type="submit" 
                  disabled={pollingLoading}
                  className="w-full btn-primary !rounded-2xl py-3 flex items-center justify-center gap-2 font-bold mt-1 cursor-pointer disabled:opacity-50 text-sm"
                >
                  {pollingLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Verifying...
                    </>
                  ) : isSignUp ? (
                    <>
                      Verify & Register Account <ShieldCheck size={18} />
                    </>
                  ) : (
                    <>
                      Sign In Secured <ShieldCheck size={18} />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => { setIsSignUp(!isSignUp); setLoginError(""); }}
                  className="text-[11px] font-extrabold text-brand-green hover:underline cursor-pointer"
                >
                  {isSignUp 
                    ? "Already have an account? Sign In" 
                    : "Don't have an account? Create Account"}
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: PERSONAL INFORMATION & DETAILS */}
          {step === 2 && (
            <motion.div
              key="step-personal-details"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 p-5 md:p-8 max-h-full md:max-h-none overflow-y-auto md:overflow-visible scrollbar-thin flex flex-col"
              data-lenis-prevent
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-navy/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <User className="text-brand-navy" size={28} />
                </div>
                <h2 className="text-3xl font-display font-bold text-brand-navy mb-2">Personal Information</h2>
                <p className="text-slate-500 text-sm">Please provide credentials exactly as written on your official PAN & Aadhaar cards.</p>
              </div>

              <form onSubmit={handlePersonalSubmit} className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Full Name (As on Documents) *</label>
                  <input 
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={`input-field ${formErrors.fullName ? "border-red-400 bg-red-50/10" : ""}`}
                  />
                  {formErrors.fullName && <p className="text-xs text-red-500 font-semibold">{formErrors.fullName}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">PAN Card Number *</label>
                  <input 
                    type="text"
                    required
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    value={panNumber}
                    onChange={handlePanChange}
                    className={`input-field ${formErrors.panNumber ? "border-red-400 bg-red-50/10" : ""}`}
                  />
                  {formErrors.panNumber && <p className="text-xs text-red-500 font-semibold">{formErrors.panNumber}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Aadhaar Card Number *</label>
                  <input 
                    type="text"
                    required
                    placeholder="XXXX XXXX XXXX"
                    maxLength={14}
                    value={aadhaarNumber}
                    onChange={handleAadhaarChange}
                    className={`input-field ${formErrors.aadhaarNumber ? "border-red-400 bg-red-50/10" : ""}`}
                  />
                  {formErrors.aadhaarNumber && <p className="text-xs text-red-500 font-semibold">{formErrors.aadhaarNumber}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Date of Birth *</label>
                  <input 
                    type="date"
                    required
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                    className={`input-field ${formErrors.dob ? "border-red-400 bg-red-50/10" : ""}`}
                  />
                  {formErrors.dob && <p className="text-xs text-red-500 font-semibold">{formErrors.dob}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Employment Type *</label>
                  <select 
                    value={employmentType}
                    onChange={(e) => setEmploymentType(e.target.value)}
                    className="input-field appearance-none cursor-pointer"
                  >
                    <option value="Salaried">Salaried Employee</option>
                    <option value="SelfEmployed">Self-Employed / Business</option>
                    <option value="Freelancer">Freelancer / Contractor</option>
                  </select>
                </div>

                {/* Company Name if user is salaried */}
                {employmentType === "Salaried" && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2 md:col-span-2"
                  >
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Company Name *</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                        <Building2 size={16} />
                      </span>
                      <input 
                        type="text"
                        required
                        placeholder="Enter your employer's company name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className={`input-field !pl-11 ${formErrors.companyName ? "border-red-400 bg-red-50/10" : ""}`}
                      />
                    </div>
                    {formErrors.companyName && <p className="text-xs text-red-500 font-semibold">{formErrors.companyName}</p>}
                  </motion.div>
                )}

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Net Monthly Income (INR) *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold">₹</span>
                    <input 
                      type="number"
                      required
                      placeholder="e.g. 45000"
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(e.target.value)}
                      className={`input-field !pl-9 ${formErrors.monthlyIncome ? "border-red-400 bg-red-50/10" : ""}`}
                    />
                  </div>
                  {formErrors.monthlyIncome && <p className="text-xs text-red-500 font-semibold">{formErrors.monthlyIncome}</p>}
                </div>

                {/* Nominee Details Section */}
                <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-2 space-y-4">
                  <h3 className="text-sm font-extrabold text-brand-navy uppercase tracking-wider flex items-center gap-2">
                    <User size={16} className="text-brand-green" /> Nominee Details (For Insurance & Security)
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Nominee Full Name *</label>
                      <input 
                        type="text"
                        required
                        placeholder="Enter nominee's full name"
                        value={nomineeName}
                        onChange={(e) => setNomineeName(e.target.value)}
                        className={`input-field ${formErrors.nomineeName ? "border-red-400 bg-red-50/10" : ""}`}
                      />
                      {formErrors.nomineeName && <p className="text-xs text-red-500 font-semibold">{formErrors.nomineeName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Relationship *</label>
                      <select 
                        value={nomineeRelation}
                        onChange={(e) => setNomineeRelation(e.target.value)}
                        className="input-field appearance-none cursor-pointer"
                      >
                        <option value="Spouse">Spouse</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Son">Son</option>
                        <option value="Daughter">Daughter</option>
                        <option value="Sibling">Sibling</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full btn-primary !rounded-2xl py-4 flex items-center justify-center gap-2 font-bold md:col-span-2 mt-4 cursor-pointer"
                >
                  Verify Documents & Proceed <ArrowRight size={20} />
                </button>
              </form>
            </motion.div>
          )}

          {/* STEP 3: LOAN ELIGIBILITY CHECK / "FETCHING & PROCESSING DETAILS" LOADING INTERFACE */}
          {step === 3 && (
            <motion.div
              key="step-processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-5 md:p-8 text-center max-h-full md:max-h-none overflow-y-auto md:overflow-visible scrollbar-thin flex flex-col"
              data-lenis-prevent
            >
              <div className="relative w-32 h-32 mx-auto mb-8">
                {/* Outer spin rings */}
                <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 128 128">
                  <circle
                    cx="64"
                    cy="64"
                    r="60"
                    fill="transparent"
                    stroke="#26892C"
                    strokeWidth="5"
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={2 * Math.PI * 60 * (1 - processingProgress / 100)}
                    className="transition-all duration-300 ease-out"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-display font-extrabold text-brand-navy">{processingProgress}%</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Speed</span>
                </div>
              </div>

              <h2 className="text-2xl font-display font-bold text-brand-navy mb-3">Checking Eligibility</h2>
              <p className="text-slate-500 text-sm max-w-xs mx-auto mb-6">
                Please wait while we establish connections and analyze your documents on safe nodes...
              </p>

              {/* Step indicator animations */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100/50 space-y-3.5 text-left max-w-sm mx-auto">
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${processingProgress >= 20 ? "bg-brand-green/20 text-brand-green" : "bg-slate-200 text-slate-400"}`}>
                    {processingProgress >= 20 ? <Check size={12} className="stroke-[3]" /> : <Loader2 size={12} className="animate-spin" />}
                  </div>
                  <span className={`text-xs font-semibold ${processingProgress >= 20 ? "text-brand-navy" : "text-slate-400"}`}>KYC Registry check</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${processingProgress >= 50 ? "bg-brand-green/20 text-brand-green" : "bg-slate-200 text-slate-400"}`}>
                    {processingProgress >= 50 ? <Check size={12} className="stroke-[3]" /> : (processingProgress >= 20 ? <Loader2 size={12} className="animate-spin" /> : <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />)}
                  </div>
                  <span className={`text-xs font-semibold ${processingProgress >= 50 ? "text-brand-navy" : "text-slate-400"}`}>Bureau score evaluation</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center ${processingProgress >= 80 ? "bg-brand-green/20 text-brand-green" : "bg-slate-200 text-slate-400"}`}>
                    {processingProgress >= 80 ? <Check size={12} className="stroke-[3]" /> : (processingProgress >= 50 ? <Loader2 size={12} className="animate-spin" /> : <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />)}
                  </div>
                  <span className={`text-xs font-semibold ${processingProgress >= 80 ? "text-brand-navy" : "text-slate-400"}`}>Income parameters verified</span>
                </div>
              </div>

              <div className="mt-8 text-xs font-bold text-brand-green animate-pulse">
                {processingStatusText}
              </div>
            </motion.div>
          )}

          {/* STEP 4: LOAN CONFIGURATION & SELECTION */}
          {step === 4 && (
            <motion.div
              key="step-loan-config"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-white rounded-3xl shadow-xl border border-slate-100 max-h-full md:max-h-none overflow-y-auto md:overflow-visible scrollbar-thin flex flex-col"
              data-lenis-prevent
            >
              {/* ── DESKTOP: Side-by-side ── MOBILE: Single column ── */}
              <div className="overflow-hidden grid md:grid-cols-5 flex-1">

                {/* ── Left / Top Panel: Sliders ── */}
                <div className="md:col-span-3 p-6 md:p-8 md:border-r border-slate-100 flex flex-col">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green px-3 py-1.5 rounded-full mb-3">
                      <TrendingDown size={14} />
                      <span className="text-xs font-extrabold uppercase tracking-wider">Interest Rate: {interestRate}%/Month</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-display font-extrabold text-brand-navy mb-1">Configure Your Loan</h2>
                    <p className="text-slate-500 text-sm mb-6">Choose an amount and tenure that fits your monthly budget perfectly.</p>

                    <div className="space-y-6">
                      {/* Amount Slider */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Loan Amount Required</span>
                          <span className="text-2xl md:text-3xl font-display font-black text-brand-navy">₹ {loanAmount.toLocaleString("en-IN")}</span>
                        </div>
                        <input
                          type="range"
                          min="50000"
                          max="500000"
                          step="10000"
                          value={loanAmount}
                          onChange={(e) => setLoanAmount(Number(e.target.value))}
                          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-green"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                          <span>₹ 50,000</span>
                          <span>₹ 5,00,000</span>
                        </div>
                      </div>

                      {/* Tenure Options */}
                      <div className="space-y-3">
                        <div className="flex justify-between items-end">
                          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Repayment Period</span>
                          <span className="text-lg md:text-xl font-bold text-brand-navy">{tenure} Months</span>
                        </div>
                        <div className="grid grid-cols-4 md:flex md:flex-wrap gap-2">
                          {[12, 18, 24, 30, 36, 42, 48].map((m) => (
                            <button
                              key={m}
                              type="button"
                              onClick={() => setTenure(m)}
                              className={`py-2.5 px-2 md:flex-grow md:min-w-[70px] rounded-xl font-bold border transition-all text-xs text-center ${
                                tenure === m
                                  ? "bg-brand-navy border-brand-navy text-white shadow-md shadow-brand-navy/20"
                                  : "bg-slate-50 border-slate-200 text-slate-600 hover:border-brand-navy/30"
                              }`}
                            >
                              {m} Mo
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CIBIL disclaimer */}
                  <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green shrink-0">
                      <ShieldCheck size={18} />
                    </div>
                    <p className="text-xs text-slate-500 leading-normal">
                      This request does not impact your CIBIL score. Verification and approval will proceed instantly in subsequent screens.
                    </p>
                  </div>

                  {/* ── MOBILE ONLY: Floating CTA to open summary sheet ── */}
                  <div className="md:hidden mt-5">
                    <button
                      onClick={() => setShowMobileSummary(true)}
                      className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-green/30 text-base active:scale-95 transition-transform cursor-pointer"
                    >
                      View Loan Summary <ArrowRight size={20} />
                    </button>
                  </div>
                </div>

                {/* ── Right Panel: Summary — DESKTOP only (hidden on mobile, shown in bottom sheet) ── */}
                <div className="hidden md:flex md:col-span-2 bg-slate-50/70 p-8 flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Estimated Cost Summary</h3>
                    <div className="text-center bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-6">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Installment (EMI)</p>
                      <p className="text-4xl font-display font-black text-brand-navy">₹ {emi.toLocaleString("en-IN")}</p>
                      <p className="text-[10px] text-brand-green font-bold mt-1 uppercase tracking-wider">Interest Included</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Interest Rate</span>
                        <span className="font-bold text-brand-navy">{interestRate}% Flat Monthly</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">Processing Fee (2%)</span>
                        <span className="font-bold text-brand-navy">₹ {processingFee.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-medium">GST on Fee (18%)</span>
                        <span className="font-bold text-brand-navy">₹ {gstOnFee.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="border-t border-slate-200/60 my-2" />
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-semibold">Net Disbursed (In Hand)</span>
                        <span className="font-bold text-brand-green">₹ {inHandAmount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500 font-semibold">Total Repayable Amount</span>
                        <span className="font-bold text-brand-navy">₹ {totalRepay.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 space-y-3">
                    <button
                      onClick={handleLoanConfigProceed}
                      className="w-full btn-primary !rounded-2xl py-4 flex items-center justify-center gap-2 text-base font-bold cursor-pointer"
                    >
                      Apply Now <ArrowRight size={20} />
                    </button>
                    <p className="text-[9px] text-center text-slate-400">
                      Terms &amp; conditions apply. Indicative metrics, charges processed securely.
                    </p>
                  </div>
                </div>
              </div>

              {/* ── MOBILE BOTTOM SHEET: Loan Summary ── */}
              <AnimatePresence>
                {showMobileSummary && (
                  <>
                    {/* Backdrop */}
                    <motion.div
                      key="backdrop"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setShowMobileSummary(false)}
                      className="fixed inset-0 bg-brand-navy/40 backdrop-blur-sm z-40 md:hidden"
                    />
                    {/* Sheet */}
                    <motion.div
                      key="summary-sheet"
                      initial={{ y: "100%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "100%" }}
                      transition={{ type: "spring", damping: 28, stiffness: 320 }}
                      className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-2xl z-50 md:hidden p-6 pb-8"
                    >
                      {/* Drag handle */}
                      <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto mb-5" />

                      <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Estimated Cost Summary</h3>

                      {/* EMI Highlight */}
                      <div className="text-center bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Monthly Installment (EMI)</p>
                        <p className="text-4xl font-display font-black text-brand-navy">₹ {emi.toLocaleString("en-IN")}</p>
                        <p className="text-[10px] text-brand-green font-bold mt-1 uppercase tracking-wider">Interest Included</p>
                      </div>

                      {/* Breakdown */}
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-medium">Interest Rate</span>
                          <span className="font-bold text-brand-navy">{interestRate}% Flat Monthly</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-medium">Processing Fee (2%)</span>
                          <span className="font-bold text-brand-navy">₹ {processingFee.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500 font-medium">GST on Fee (18%)</span>
                          <span className="font-bold text-brand-navy">₹ {gstOnFee.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="border-t border-slate-200 my-1" />
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 font-semibold">Net Disbursed (In Hand)</span>
                          <span className="font-bold text-brand-green">₹ {inHandAmount.toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 font-semibold">Total Repayable Amount</span>
                          <span className="font-bold text-brand-navy">₹ {totalRepay.toLocaleString("en-IN")}</span>
                        </div>
                      </div>

                      {/* Apply CTA */}
                      <button
                        onClick={() => { setShowMobileSummary(false); handleLoanConfigProceed(); }}
                        className="w-full bg-brand-green text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-green/30 text-base active:scale-95 transition-transform cursor-pointer"
                      >
                        Apply Now <ArrowRight size={20} />
                      </button>
                      <p className="text-[9px] text-center text-slate-400 mt-3">
                        Terms &amp; conditions apply. Indicative metrics, charges processed securely.
                      </p>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* STEP 5: DOCUMENT UPLOAD */}
          {step === 5 && (
            <motion.div
              key="step-documents"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 p-5 md:p-8 flex flex-col max-h-full md:max-h-none overflow-y-auto md:overflow-visible scrollbar-thin"
              data-lenis-prevent
            >
              <div>
                <h2 className="text-2xl font-display font-extrabold text-brand-navy mb-2">Upload KYC Files</h2>
                <p className="text-slate-500 text-sm mb-6">Attach pictures or PDFs of your official credentials for high-speed automated approval.</p>

                <div className="space-y-4">
                  {/* PAN Upload */}
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">PAN Card Front Upload *</span>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-3 p-4 border border-dashed border-slate-200 hover:border-brand-green hover:bg-brand-green/5 rounded-2xl cursor-pointer transition-all">
                        <Upload size={18} className="text-slate-400" />
                        <span className="text-xs font-semibold text-slate-500 truncate flex-1">
                          {panFile ? panFile.name : "Select or drag file (PDF, JPG, PNG)"}
                        </span>
                        <input 
                          type="file" 
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e.target.files?.[0], setPanFile, 'panCard')}
                          className="hidden" 
                        />
                      </label>
                      {panFile && panFile.data && (
                        <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            {panFile.data.startsWith("data:image/") || panFile.data.startsWith("http") ? (
                              <img 
                                src={panFile.data} 
                                alt="PAN Preview" 
                                className="w-10 h-10 rounded-lg object-cover border border-slate-100 cursor-pointer hover:opacity-85 transition-opacity"
                                onClick={() => setPreviewImage({ title: "PAN Card Front", url: panFile.data })}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-[10px] uppercase">
                                PDF
                              </div>
                            )}
                            <span className="text-xs font-bold text-slate-600 truncate flex-1">{panFile.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPreviewImage({ title: "PAN Card Front", url: panFile.data })}
                            className="ml-2 text-[10px] font-extrabold uppercase tracking-wider text-brand-navy hover:text-brand-green transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            Preview
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Aadhaar Front */}
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Aadhaar Card Front *</span>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-3 p-4 border border-dashed border-slate-200 hover:border-brand-green hover:bg-brand-green/5 rounded-2xl cursor-pointer transition-all">
                        <Upload size={18} className="text-slate-400" />
                        <span className="text-xs font-semibold text-slate-500 truncate flex-1">
                          {aadhaarFrontFile ? aadhaarFrontFile.name : "Select Aadhaar Card Front Side"}
                        </span>
                        <input 
                          type="file" 
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e.target.files?.[0], setAadhaarFrontFile, 'aadhaarFront')}
                          className="hidden" 
                        />
                      </label>
                      {aadhaarFrontFile && aadhaarFrontFile.data && (
                        <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            {aadhaarFrontFile.data.startsWith("data:image/") || aadhaarFrontFile.data.startsWith("http") ? (
                              <img 
                                src={aadhaarFrontFile.data} 
                                alt="Aadhaar Front Preview" 
                                className="w-10 h-10 rounded-lg object-cover border border-slate-100 cursor-pointer hover:opacity-85 transition-opacity"
                                onClick={() => setPreviewImage({ title: "Aadhaar Card Front", url: aadhaarFrontFile.data })}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-[10px] uppercase">
                                PDF
                              </div>
                            )}
                            <span className="text-xs font-bold text-slate-600 truncate flex-1">{aadhaarFrontFile.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPreviewImage({ title: "Aadhaar Card Front", url: aadhaarFrontFile.data })}
                            className="ml-2 text-[10px] font-extrabold uppercase tracking-wider text-brand-navy hover:text-brand-green transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            Preview
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Aadhaar Back */}
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Aadhaar Card Back *</span>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-3 p-4 border border-dashed border-slate-200 hover:border-brand-green hover:bg-brand-green/5 rounded-2xl cursor-pointer transition-all">
                        <Upload size={18} className="text-slate-400" />
                        <span className="text-xs font-semibold text-slate-500 truncate flex-1">
                          {aadhaarBackFile ? aadhaarBackFile.name : "Select Aadhaar Card Back Side"}
                        </span>
                        <input 
                          type="file" 
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e.target.files?.[0], setAadhaarBackFile, 'aadhaarBack')}
                          className="hidden" 
                        />
                      </label>
                      {aadhaarBackFile && aadhaarBackFile.data && (
                        <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            {aadhaarBackFile.data.startsWith("data:image/") || aadhaarBackFile.data.startsWith("http") ? (
                              <img 
                                src={aadhaarBackFile.data} 
                                alt="Aadhaar Back Preview" 
                                className="w-10 h-10 rounded-lg object-cover border border-slate-100 cursor-pointer hover:opacity-85 transition-opacity"
                                onClick={() => setPreviewImage({ title: "Aadhaar Card Back", url: aadhaarBackFile.data })}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-[10px] uppercase">
                                PDF
                              </div>
                            )}
                            <span className="text-xs font-bold text-slate-600 truncate flex-1">{aadhaarBackFile.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPreviewImage({ title: "Aadhaar Card Back", url: aadhaarBackFile.data })}
                            className="ml-2 text-[10px] font-extrabold uppercase tracking-wider text-brand-navy hover:text-brand-green transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            Preview
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Nominee Document Upload */}
                  <div className="space-y-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Nominee ID Document (Aadhaar / PAN / Voter ID) *</span>
                    <div className="flex flex-col gap-2">
                      <label className="flex items-center gap-3 p-4 border border-dashed border-slate-200 hover:border-brand-green hover:bg-brand-green/5 rounded-2xl cursor-pointer transition-all">
                        <Upload size={18} className="text-slate-400" />
                        <span className="text-xs font-semibold text-slate-500 truncate flex-1">
                          {nomineeDocFile ? nomineeDocFile.name : "Select Nominee ID Proof"}
                        </span>
                        <input 
                          type="file" 
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileChange(e.target.files?.[0], setNomineeDocFile, 'nomineeDoc')}
                          className="hidden" 
                        />
                      </label>
                      {nomineeDocFile && nomineeDocFile.data && (
                        <div className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                          <div className="flex items-center gap-2.5 min-w-0 flex-1">
                            {nomineeDocFile.data.startsWith("data:image/") || nomineeDocFile.data.startsWith("http") ? (
                              <img 
                                src={nomineeDocFile.data} 
                                alt="Nominee Doc Preview" 
                                className="w-10 h-10 rounded-lg object-cover border border-slate-100 cursor-pointer hover:opacity-85 transition-opacity"
                                onClick={() => setPreviewImage({ title: "Nominee ID Document", url: nomineeDocFile.data })}
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-[10px] uppercase">
                                PDF
                              </div>
                            )}
                            <span className="text-xs font-bold text-slate-600 truncate flex-1">{nomineeDocFile.name}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setPreviewImage({ title: "Nominee ID Document", url: nomineeDocFile.data })}
                            className="ml-2 text-[10px] font-extrabold uppercase tracking-wider text-brand-navy hover:text-brand-green transition-colors bg-white border border-slate-200 px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            Preview
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-brand-green/5 rounded-2xl border border-brand-green/10 flex items-start gap-2.5">
                <ShieldCheck className="text-brand-green shrink-0 mt-0.5" size={16} />
                <p className="text-[10px] text-slate-600 leading-relaxed">
                  Documents are automatically encrypted using end-to-end AES-256 standard and parsed securely using artificial intelligence models.
                </p>
              </div>

              {/* Back & Forward buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 py-4 border border-slate-200 hover:bg-slate-50 text-brand-navy font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <ArrowLeft size={16} /> Back to Config
                </button>
                <button
                  type="button"
                  onClick={handleKycProceed}
                  className="flex-[2] py-4 bg-brand-navy hover:bg-brand-navy/95 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  Proceed to Selfie <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 6: MANDATORY SELFIE CAPTURE */}
          {step === 6 && (
            <motion.div
              key="step-selfie"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-100 p-5 md:p-8 flex flex-col items-center text-center max-h-full md:max-h-none overflow-y-auto md:overflow-visible scrollbar-thin"
              data-lenis-prevent
            >
              <div className="w-full">
                <div className="inline-flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1 rounded-full mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[10px] font-black uppercase tracking-wider">Mandatory Verification Step</span>
                </div>
                <h3 className="text-xl font-display font-extrabold text-brand-navy mb-2">Biometric Selfie Verification</h3>
                <p className="text-slate-500 text-xs mb-6 max-w-sm mx-auto">
                  We require a live selfie validation to ensure high security and match details with the credit bureau database.
                </p>

                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-white shadow-xl mx-auto flex items-center justify-center bg-slate-200 mb-6 group">
                  <canvas ref={canvasRef} className="hidden" />
                  
                  {selfieImage ? (
                    <img src={selfieImage} alt="Captured Selfie" className="w-full h-full object-cover" />
                  ) : cameraActive ? (
                    <video 
                      ref={videoRef}
                      autoPlay 
                      playsInline
                      className="w-full h-full object-cover scale-x-[-1]" 
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6">
                      <Camera size={44} className="text-slate-400 mb-2 group-hover:scale-110 transition-transform duration-300" />
                      <span className="text-xs font-bold text-slate-500">Camera Viewfinder</span>
                    </div>
                  )}

                  {cameraActive && (
                    <div className="absolute inset-0 border-4 border-dashed border-brand-green/60 rounded-full animate-[spin_30s_linear_infinite] pointer-events-none" />
                  )}
                </div>

                <div className="flex flex-col gap-3 max-w-xs mx-auto">
                  {cameraActive ? (
                    <button 
                      onClick={capturePhoto}
                      className="bg-brand-green text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:bg-brand-green/90 transition-all flex items-center justify-center gap-2"
                    >
                      <Camera size={18} /> Take Instant Photo
                    </button>
                  ) : (
                    <button 
                      onClick={startCamera}
                      className="bg-brand-navy hover:bg-brand-navy/95 text-white font-bold py-3 px-6 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Camera size={18} /> {selfieImage ? "Retake Live Selfie" : "Start Live Webcam / Camera"}
                    </button>
                  )}

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-bold uppercase tracking-wider">Or upload manual selfie</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  <label className="bg-white border border-slate-200 text-slate-600 font-semibold py-2.5 px-4 rounded-xl cursor-pointer hover:bg-slate-100 text-xs transition-all">
                    Browse Selfie Photo File
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={handleSelfieFileUpload}
                      className="hidden" 
                    />
                  </label>

                  {cameraError && <p className="text-[10px] text-red-500 font-bold mt-1 leading-normal">{cameraError}</p>}
                </div>
              </div>

              {/* Back & Forward buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full">
                <button
                  type="button"
                  onClick={() => {
                    if (cameraActive) stopCamera();
                    setStep(5);
                  }}
                  className="flex-1 py-4 border border-slate-200 bg-white hover:bg-slate-50 text-brand-navy font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                >
                  <ArrowLeft size={16} /> Back to KYC
                </button>
                <button
                  type="button"
                  onClick={handleUploadsProceed}
                  disabled={!selfieImage}
                  className={`flex-[2] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 text-sm ${
                    selfieImage 
                      ? "bg-brand-green text-white hover:bg-brand-green/90 shadow-lg hover:shadow-xl active:scale-98 cursor-pointer" 
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Proceed to Bank <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 7: BANK DETAILS FORM */}
          {step === 7 && !isSubmittingApplication && (
            <motion.div
              key="step-bank-details"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-100 p-5 md:p-8 max-h-full md:max-h-none overflow-y-auto md:overflow-visible scrollbar-thin flex flex-col"
              data-lenis-prevent
            >
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-brand-navy/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Landmark className="text-brand-navy" size={28} />
                </div>
                <h2 className="text-3xl font-display font-bold text-brand-navy mb-2">Disbursal Account</h2>
                <p className="text-slate-500 text-sm">Enter bank coordinates where you want your approved loan amount credited securely.</p>
              </div>

              <form onSubmit={handleBankSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Account Holder Name *</label>
                  <input 
                    type="text"
                    required
                    placeholder="Enter name exactly as on bank records"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    className={`input-field ${bankErrors.accountHolder ? "border-red-400 bg-red-50/10" : ""}`}
                  />
                  {bankErrors.accountHolder && <p className="text-xs text-red-500 font-semibold">{bankErrors.accountHolder}</p>}
                </div>

                <div className="space-y-2 relative">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Select Disbursal Bank *</label>
                  
                  {/* Custom selection box */}
                  <div 
                    onClick={() => setShowBankDropdown(!showBankDropdown)}
                    className={`input-field flex items-center justify-between cursor-pointer ${showBankDropdown ? "border-brand-green bg-white shadow-md shadow-slate-100" : ""} ${bankErrors.bankName ? "border-red-400 bg-red-50/10" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      {selectedBankId ? (
                        <>
                          {INDIAN_BANKS.find(b => b.id === selectedBankId)?.logo("w-7 h-7")}
                          <span className="font-bold text-brand-navy text-sm">
                            {selectedBankId === "other" ? (otherBankName || "Other Indian Bank") : INDIAN_BANKS.find(b => b.id === selectedBankId)?.name}
                          </span>
                        </>
                      ) : (
                        <span className="text-slate-400 font-medium text-sm">Select your bank from the list</span>
                      )}
                    </div>
                    <svg 
                      className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${showBankDropdown ? "rotate-180" : ""}`}
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {bankErrors.bankName && <p className="text-xs text-red-500 font-semibold">{bankErrors.bankName}</p>}

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showBankDropdown && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 right-0 top-full mt-2 bg-white border border-slate-200/60 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto p-2 space-y-1"
                      >
                        {INDIAN_BANKS.map((bank) => (
                          <div 
                            key={bank.id}
                            onClick={() => {
                              setSelectedBankId(bank.id);
                              setShowBankDropdown(false);
                              if (bank.id !== "other") {
                                setBankName(bank.name);
                                setIfscCode(bank.code); // Pre-fill IFSC prefix!
                              } else {
                                setBankName("");
                              }
                            }}
                            className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all hover:bg-slate-50 ${selectedBankId === bank.id ? "bg-brand-green/5 border-l-4 border-brand-green" : ""}`}
                          >
                            {bank.logo("w-8 h-8")}
                            <div className="text-left">
                              <p className="text-xs font-bold text-brand-navy">{bank.name}</p>
                              {bank.code && <p className="text-[10px] text-slate-400 font-semibold">IFSC starts with: {bank.code}</p>}
                            </div>
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Conditional Text Field for Manual Bank Name Entry (if 'other' is selected) */}
                {selectedBankId === "other" && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-2 overflow-hidden"
                  >
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Specify Bank Name *</label>
                    <input 
                      type="text"
                      required
                      placeholder="Enter your bank's name"
                      value={otherBankName}
                      onChange={(e) => setOtherBankName(e.target.value)}
                      className="input-field"
                    />
                  </motion.div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Account Number *</label>
                  <input 
                    type="text"
                    required
                    placeholder="Enter account number"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ""))}
                    className={`input-field ${bankErrors.accountNumber ? "border-red-400 bg-red-50/10" : ""}`}
                  />
                  {bankErrors.accountNumber && <p className="text-xs text-red-500 font-semibold">{bankErrors.accountNumber}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Bank IFSC Code *</label>
                  <input 
                    type="text"
                    required
                    placeholder="SBIN0012345"
                    maxLength={11}
                    value={ifscCode}
                    onChange={(e) => setIfscCode(e.target.value.toUpperCase().slice(0, 11))}
                    className={`input-field ${bankErrors.ifscCode ? "border-red-400 bg-red-50/10" : ""}`}
                  />
                  {bankErrors.ifscCode && <p className="text-xs text-red-500 font-semibold">{bankErrors.ifscCode}</p>}
                </div>

                {/* Back & Submit buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setStep(6)}
                    className="flex-1 py-4 border border-slate-200 bg-white hover:bg-slate-50 text-brand-navy font-bold rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer text-sm"
                  >
                    <ArrowLeft size={16} /> Back to Selfie
                  </button>
                  <button 
                    type="submit" 
                    className="flex-[2] btn-primary !rounded-2xl py-4 flex items-center justify-center gap-2 font-bold cursor-pointer text-sm"
                  >
                    Submit Application <CheckCircle size={16} />
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* STEP 6.5: GORGEOUS SUBMISSION PROGRESS LOADER */}
          {isSubmittingApplication && (
            <motion.div
              key="step-submitting"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-5 md:p-8 text-center relative overflow-hidden max-h-full md:max-h-none overflow-y-auto md:overflow-visible scrollbar-thin"
              data-lenis-prevent
            >
              {/* Outer pulsing glow circle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-brand-green/10 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" />
              
              <div className="relative w-36 h-36 mx-auto mb-8 flex items-center justify-center">
                {/* SVG circular track with gradient animation */}
                <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 144 144">
                  <defs>
                    <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#26892C" />
                      <stop offset="50%" stopColor="#0056b3" />
                      <stop offset="100%" stopColor="#00c8ff" />
                    </linearGradient>
                  </defs>
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    fill="transparent"
                    stroke="#f1f5f9"
                    strokeWidth="8"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="64"
                    fill="transparent"
                    stroke="url(#glowGradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 64}
                    strokeDashoffset={2 * Math.PI * 64 * (1 - submitProgress / 100)}
                    className="transition-all duration-300 ease-out"
                  />
                </svg>
                
                {/* Rotating shield lock inside */}
                <div className="flex flex-col items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 shadow-md"
                  >
                    <ShieldCheck size={28} className="text-brand-green" />
                  </motion.div>
                  <span className="text-2xl font-display font-black text-brand-navy mt-1.5">{submitProgress}%</span>
                </div>
              </div>

              <h2 className="text-2xl font-display font-bold text-brand-navy mb-2">Securing Disbursal</h2>
              <p className="text-slate-500 text-xs max-w-xs mx-auto mb-6">
                Establishing automated disbursal channels and signing agreements over secure bank terminals...
              </p>

              {/* Progress list representing fintech verification */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 text-left max-w-sm mx-auto space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center transition-all ${submitProgress >= 20 ? "bg-brand-green/20 text-brand-green" : "bg-slate-200 text-slate-400"}`}>
                    {submitProgress >= 20 ? <Check size={12} className="stroke-[3.5]" /> : <Loader2 size={12} className="animate-spin" />}
                  </div>
                  <span className={`text-xs font-bold transition-colors duration-300 ${submitProgress >= 20 ? "text-brand-navy" : "text-slate-400"}`}>
                    PAN & Bank alignment matching
                  </span>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center transition-all ${submitProgress >= 50 ? "bg-brand-green/20 text-brand-green" : "bg-slate-200 text-slate-400"}`}>
                    {submitProgress >= 50 ? <Check size={12} className="stroke-[3.5]" /> : (submitProgress >= 20 ? <Loader2 size={12} className="animate-spin" /> : <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />)}
                  </div>
                  <span className={`text-xs font-bold transition-colors duration-300 ${submitProgress >= 50 ? "text-brand-navy" : "text-slate-400"}`}>
                    e-Mandate & NACH registered
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center transition-all ${submitProgress >= 80 ? "bg-brand-green/20 text-brand-green" : "bg-slate-200 text-slate-400"}`}>
                    {submitProgress >= 80 ? <Check size={12} className="stroke-[3.5]" /> : (submitProgress >= 50 ? <Loader2 size={12} className="animate-spin" /> : <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />)}
                  </div>
                  <span className={`text-xs font-bold transition-colors duration-300 ${submitProgress >= 80 ? "text-brand-navy" : "text-slate-400"}`}>
                    Loan Smart Agreement signed
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center transition-all ${submitProgress >= 100 ? "bg-brand-green/20 text-brand-green" : "bg-slate-200 text-slate-400"}`}>
                    {submitProgress >= 100 ? <Check size={12} className="stroke-[3.5]" /> : (submitProgress >= 80 ? <Loader2 size={12} className="animate-spin" /> : <div className="w-1.5 h-1.5 bg-slate-400 rounded-full" />)}
                  </div>
                  <span className={`text-xs font-bold transition-colors duration-300 ${submitProgress >= 100 ? "text-brand-navy" : "text-slate-400"}`}>
                    RBI clearing clearance secured
                  </span>
                </div>
              </div>

              <div className="mt-8 text-xs font-extrabold text-brand-green animate-pulse leading-normal max-w-xs mx-auto">
                {submitStatusText}
              </div>
            </motion.div>
          )}

          {/* STEP 8: DYNAMIC LOAN STATUS & DISBURSAL CORRIDOR DASHBOARD */}
          {step === 8 && (
            <motion.div
              key="step-success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-xl bg-white rounded-3xl shadow-xl border border-slate-100 p-5 md:p-10 text-center relative overflow-hidden max-h-full md:max-h-none overflow-y-auto md:overflow-visible scrollbar-thin flex flex-col"
              data-lenis-prevent
            >
              <div className="absolute top-0 left-0 right-0 h-2.5 bg-brand-green" />

              {activeDbLoan && activeDbLoan.loanId && (
                <div className="mt-2 mb-4 flex justify-center shrink-0">
                  <div className="bg-brand-green/10 border border-brand-green/20 text-brand-navy px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
                    LOAN ID: {activeDbLoan.loanId}
                  </div>
                </div>
              )}

              {!activeDbLoan ? (
                <div className="py-12 flex flex-col items-center justify-center gap-4">
                  {submitError ? (
                    <>
                      <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center text-red-500 mb-2">
                        <AlertCircle size={36} />
                      </div>
                      <h3 className="text-lg font-bold text-brand-navy">Submission Delayed</h3>
                      <p className="text-slate-500 text-xs max-w-sm leading-relaxed">{submitError}</p>
                      <button
                        onClick={() => {
                          setSubmitError(null);
                          setStep(7);
                          setIsSubmittingApplication(false);
                        }}
                        className="mt-4 px-6 py-2.5 bg-brand-navy hover:bg-brand-navy/90 text-white rounded-xl font-bold text-xs transition-all active:scale-95 cursor-pointer"
                      >
                        Go Back & Resubmit
                      </button>
                    </>
                  ) : (
                    <>
                      <Loader2 size={40} className="text-brand-green animate-spin" />
                      <p className="text-slate-500 font-bold text-xs uppercase tracking-wider">Synchronizing secure application ledger...</p>
                    </>
                  )}
                </div>
              ) : showSubmittedDetails ? (
                // --- SUBMITTED DETAILS VIEW ---
                <div className="text-left space-y-6">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                    {activeDbLoan.kycFiles?.selfieImage && (
                      <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-brand-green/20 shadow-md shrink-0">
                        <img 
                          src={activeDbLoan.kycFiles.selfieImage} 
                          alt="Applicant Selfie" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] text-brand-green uppercase font-black tracking-widest block mb-1">
                        Applicant: {activeDbLoan.fullName}
                      </span>
                      <h2 className="text-2xl md:text-3xl font-display font-black text-brand-navy leading-none">
                        Submitted Details
                      </h2>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-1.5">
                        Verify your application credentials
                      </p>
                    </div>
                  </div>

                  {/* 1. Loan Parameters */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-brand-green flex items-center gap-1.5 border-b border-slate-200/60 pb-2 font-bold">
                      <CreditCard size={14} /> Loan Selection
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Requested Principal</span>
                        <span className="text-sm font-bold text-brand-navy">₹{activeDbLoan.loanAmount.toLocaleString("en-IN")}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Repayment Term</span>
                        <span className="text-sm font-bold text-brand-navy">{activeDbLoan.tenure} Months</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Monthly Interest</span>
                        <span className="text-sm font-bold text-brand-navy">0.5% (Flat)</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">In-Hand Disbursal</span>
                        <span className="text-sm font-bold text-emerald-600">₹{(activeDbLoan.loanAmount - Math.round(activeDbLoan.loanAmount * 0.02) - Math.round(Math.round(activeDbLoan.loanAmount * 0.02) * 0.18)).toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>

                  {/* 2. Personal Profile */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-brand-green flex items-center gap-1.5 border-b border-slate-200/60 pb-2 font-bold">
                      <User size={14} /> Profile Verification
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Full Legal Name</span>
                        <span className="text-sm font-bold text-brand-navy">{activeDbLoan.fullName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Date of Birth</span>
                        <span className="text-sm font-semibold text-slate-700">{activeDbLoan.dob}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">PAN Number</span>
                        <span className="text-sm font-mono font-bold text-slate-700">{activeDbLoan.panNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Aadhaar Card</span>
                        <span className="text-sm font-mono font-bold text-slate-700">{activeDbLoan.aadhaarNumber}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Monthly Income</span>
                        <span className="text-sm font-bold text-brand-navy">₹{activeDbLoan.monthlyIncome.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  </div>

                  {/* 3. Nominee details */}
                  {activeDbLoan.nomineeName && (
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
                      <h3 className="text-xs font-black uppercase tracking-wider text-brand-green flex items-center gap-1.5 border-b border-slate-200/60 pb-2 font-bold">
                        <User size={14} /> Nominee Coordinates
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Nominee Name</span>
                          <span className="text-sm font-bold text-brand-navy">{activeDbLoan.nomineeName}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-semibold block">Relationship</span>
                          <span className="text-sm font-semibold text-slate-700">{activeDbLoan.nomineeRelation}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. Disbursal Coordinates */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-brand-green flex items-center gap-1.5 border-b border-slate-200/60 pb-2 font-bold">
                      <Landmark size={14} /> Target Bank Account
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Bank Provider</span>
                        <span className="text-sm font-bold text-brand-navy">{activeDbLoan.bankDetails.bankName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">IFSC Code</span>
                        <span className="text-sm font-mono font-bold text-slate-700">{activeDbLoan.bankDetails.ifscCode}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Account Holder Name</span>
                        <span className="text-sm font-bold text-brand-navy">{activeDbLoan.bankDetails.accountHolder}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Disbursal Account Number</span>
                        <span className="text-sm font-mono font-bold text-brand-navy tracking-widest">{activeDbLoan.bankDetails.accountNumber}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSubmittedDetails(false)}
                    className="w-full py-4 bg-brand-navy hover:bg-brand-navy/90 text-white font-extrabold rounded-2xl shadow-xl hover:shadow-2xl active:scale-98 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer mt-6"
                  >
                    <ArrowLeft size={16} /> Back to Status Page
                  </button>
                </div>
              ) : activeDbLoan.status === "Pending" ? (
                // --- CASE A: PENDING STATUS ---
                <div>
                  <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner relative">
                    <Clock size={56} className="text-amber-500 animate-pulse" />
                  </div>
                  
                  <h2 className="text-3xl font-display font-black text-brand-navy mb-4">Underwriting Assessment</h2>
                  <p className="text-amber-500 font-extrabold text-sm uppercase tracking-wider mb-6">
                    Current Status: Pending Approval
                  </p>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 text-left space-y-4">
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      Your loan application for <strong className="text-brand-navy">₹{activeDbLoan.loanAmount.toLocaleString("en-IN")}</strong> is currently undergoing credit underwriting review.
                    </p>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      This process typically takes between <strong>1 to 24 hours</strong>. Our live auditors are matching bank coordinates and verifying biometric selfie records.
                    </p>
                    <div className="flex items-center gap-2 pt-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Live Monitoring Active - Auto Refreshing...
                    </div>
                  </div>
                </div>
              ) : activeDbLoan.status === "Rejected" ? (
                // --- CASE B: REJECTED STATUS ---
                <div>
                  <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner relative">
                    <AlertCircle size={56} className="text-red-500" />
                  </div>

                  <h2 className="text-3xl font-display font-black text-brand-navy mb-4">Application Declined</h2>
                  <p className="text-red-500 font-extrabold text-sm uppercase tracking-wider mb-6">
                    Review Concluded
                  </p>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 text-left space-y-3">
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      We regret to inform you that your application did not meet our risk assessment criteria at this time.
                    </p>
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      For any disputes or to upload alternative credit information, please get in touch with our underwriters below.
                    </p>
                  </div>
                </div>
              ) : activeDbLoan.status === "Approved" && !activeDbLoan.withdrawalTriggered ? (
                // --- CASE C: APPROVED BUT NOT WITHDRAWN YET ---
                <div>
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner relative">
                    <CheckCircle size={56} className="text-brand-green animate-[bounce_1.5s_infinite]" />
                    <div className="absolute inset-0 rounded-full bg-brand-green/20 -z-10 animate-ping" />
                  </div>

                  <h2 className="text-3xl font-display font-black text-brand-navy mb-2">Loan Approved!</h2>
                  <p className="text-brand-green font-black text-xl uppercase tracking-wider mb-6">
                    Available: ₹ {activeDbLoan.loanAmount.toLocaleString("en-IN")}
                  </p>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 text-left space-y-4">
                    <div className="border-b border-slate-200/60 pb-3">
                      <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Target Bank Account</span>
                      <span className="text-sm font-bold text-brand-navy mt-1 block">
                        {activeDbLoan.bankDetails.bankName} (Acct ending in *{activeDbLoan.bankDetails.accountNumber.slice(-4)})
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      Your requested funds are fully secured and authorized for disbursal. Please click the button below to initiate withdrawal.
                    </p>
                  </div>

                  <button
                    onClick={handleInitiateWithdrawal}
                    className="w-full bg-brand-green text-white hover:bg-brand-green/90 font-extrabold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl active:scale-98 transition-all flex items-center justify-center gap-2 text-base cursor-pointer mb-6"
                  >
                    Withdraw Funds Now <ArrowRight size={18} />
                  </button>
                </div>
              ) : activeDbLoan.withdrawalTriggered && withdrawalTimeRemaining > 0 ? (
                // --- CASE D: WITHDRAWAL IN PROGRESS (30 MIN TIMER ACTIVE) ---
                <div>
                  <div className="w-28 h-28 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner relative">
                    <Loader2 size={56} className="text-brand-navy animate-spin" />
                  </div>

                  <h2 className="text-3xl font-display font-black text-brand-navy mb-2">Processing Disbursal</h2>
                  <p className="text-brand-navy font-bold text-sm uppercase tracking-wider mb-6">
                    Within 30 minutes payment will Approve
                  </p>

                  <div className="bg-slate-900 text-white rounded-3xl p-8 mb-8 text-center relative overflow-hidden shadow-xl border border-slate-800">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-widest block mb-2">Instant Transfer Queue</span>
                    <span className="text-5xl font-mono font-black text-brand-green block tracking-wider animate-pulse">
                      {formatTime(withdrawalTimeRemaining)}
                    </span>
                    
                    {/* Animated progress bar */}
                    <div className="w-full h-2 bg-slate-800 rounded-full mt-6 overflow-hidden">
                      <div 
                        className="h-full bg-brand-green transition-all duration-1000 ease-linear"
                        style={{ width: `${((30 * 60 - withdrawalTimeRemaining) / (30 * 60)) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left mb-8">
                    <p className="text-xs font-semibold text-slate-600 leading-relaxed">
                      Our secure payment gateways are routing the credit corridors to your registered coordinates. Please keep this screen open or check back later. Your timer status is securely synchronized.
                    </p>
                  </div>
                </div>
              ) : (
                // --- CASE E: WITHDRAWAL COMPLETED & SUCCESSFUL (30 MIN COMPLETED) ---
                <div>
                  <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner relative">
                    <CheckCircle size={56} className="text-brand-green animate-[bounce_1.5s_infinite]" />
                    <div className="absolute inset-0 rounded-full bg-brand-green/20 -z-10 animate-ping" />
                  </div>

                  <h2 className="text-3xl font-display font-black text-brand-navy mb-2">Disbursed Successfully!</h2>
                  <p className="text-brand-green font-black text-xl uppercase tracking-wider mb-6">
                    Payment Credited
                  </p>

                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100/50 mb-8 text-left space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green shrink-0 mt-0.5">
                        <Check size={12} className="stroke-[3]" />
                      </div>
                      <p className="text-xs font-semibold text-slate-600">
                        Funds of <strong className="text-brand-navy">₹{activeDbLoan.loanAmount.toLocaleString("en-IN")}</strong> have been successfully transferred to your account ending in <strong className="text-brand-navy">*{activeDbLoan.bankDetails.accountNumber.slice(-4)}</strong>.
                      </p>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green shrink-0 mt-0.5">
                        <Check size={12} className="stroke-[3]" />
                      </div>
                      <p className="text-xs font-semibold text-slate-600">
                        You can download your underwriter-signed loan agreement document directly below.
                      </p>
                    </div>
                  </div>

                  {activeDbLoan.adminPdf ? (
                    <a
                      href={`${API_BASE_URL}/loans/${activeDbLoan._id}/pdf-proxy`}
                      download={activeDbLoan.adminPdf.name || "loan-agreement.pdf"}
                      className="w-full bg-brand-navy text-white hover:bg-brand-navy/90 font-extrabold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl active:scale-98 transition-all flex items-center justify-center gap-2 text-base cursor-pointer mb-6"
                    >
                      <Download size={20} /> Download Loan Agreement (PDF)
                    </a>
                  ) : (

                    <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-semibold text-slate-500 mb-6 flex items-center justify-center gap-2">
                      <Loader2 size={14} className="animate-spin text-slate-400" />
                      Waiting for finalized loan agreement signature...
                    </div>
                  )}
                </div>
              )}

              {!showSubmittedDetails && (
                <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setShowSubmittedDetails(true)}
                    className="w-full py-4 text-brand-navy hover:text-brand-navy/80 font-bold transition-all text-sm flex items-center justify-center gap-2 border border-slate-200 rounded-2xl hover:bg-slate-50 cursor-pointer"
                  >
                    <ArrowLeft size={16} /> Back (View Details)
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Small Legal Footer */}
      <footer className="hidden md:block bg-white border-t border-slate-100 py-6 px-6 text-center text-[10px] text-slate-400 shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} Avivaa Finance (Avivaa FinTech Private Limited). All rights reserved.</p>
          <div className="flex items-center gap-4 font-bold uppercase tracking-wider">
            <span className="hover:underline cursor-pointer">Privacy Policy</span>
            <span className="hover:underline cursor-pointer">Terms & Conditions</span>
            <span className="hover:underline cursor-pointer">NBFC Disclosures</span>
          </div>
        </div>
      </footer>
      {/* Lightbox Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
          <div className="relative bg-white rounded-3xl p-5 max-w-2xl w-full flex flex-col shadow-2xl border border-slate-100 max-h-[90vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-sm font-bold text-brand-navy">{previewImage.title}</span>
              <button 
                type="button"
                onClick={() => setPreviewImage(null)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-hidden flex items-center justify-center p-2 min-h-0 mt-4">
              <img 
                src={previewImage.url} 
                alt={previewImage.title} 
                className="max-w-full max-h-[60vh] object-contain rounded-2xl shadow-md"
              />
            </div>
            <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewImage(null)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
