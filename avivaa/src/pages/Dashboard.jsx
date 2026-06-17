import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Landmark, CheckCircle, AlertCircle, Clock, 
  Search, LogOut, FileText, ChevronRight, User, Phone, 
  Download, Calendar, ShieldCheck, DollarSign, Loader2, X, Upload
} from "lucide-react";
import logo from "../assets/logo.jpeg";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem("avivaa_dashboard_token");
    const userStr = localStorage.getItem("avivaa_dashboard_user");
    
    if (!token || !userStr) {
      navigate("/dashboard/login");
      return;
    }

    setAdminUser(JSON.parse(userStr));
    fetchLoans(token);
  }, [navigate]);

  const fetchLoans = async (token) => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/loans", {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error("Failed to fetch applications");
      }

      const data = await response.ok ? await response.json() : [];
      setLoans(data);
    } catch (err) {
      setError(err.message || "Could not connect to API");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (loanId, newStatus) => {
    setUpdatingStatusId(loanId);
    try {
      const token = localStorage.getItem("avivaa_dashboard_token");
      const response = await fetch(`http://localhost:5000/api/loans/${loanId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      const updated = await response.json();
      
      // Update local state
      setLoans(loans.map(loan => loan._id === loanId ? updated : loan));
      if (selectedLoan && selectedLoan._id === loanId) {
        setSelectedLoan(updated);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("avivaa_dashboard_token");
    localStorage.removeItem("avivaa_dashboard_user");
    navigate("/dashboard/login");
  };

  const handlePdfUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      alert("Please upload a valid PDF file");
      return;
    }

    setUploadingPdf(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = reader.result;
        const token = localStorage.getItem("avivaa_dashboard_token");
        const response = await fetch(`http://localhost:5000/api/loans/${selectedLoan._id}/upload-pdf`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({
            name: file.name,
            data: base64Data
          })
        });

        if (!response.ok) {
          throw new Error("Failed to upload PDF");
        }

        const updated = await response.json();
        setLoans(loans.map(loan => loan._id === selectedLoan._id ? updated : loan));
        setSelectedLoan(updated);
        alert("PDF uploaded and linked to user successfully!");
      };
    } catch (err) {
      alert(err.message);
    } finally {
      setUploadingPdf(false);
    }
  };

  const getWithdrawalStatusText = (loan) => {
    if (!loan.withdrawalTriggered) return "Not Initiated";
    
    const startedTime = new Date(loan.withdrawalStartedAt).getTime();
    const now = Date.now();
    const elapsedMinutes = (now - startedTime) / (1000 * 60);
    
    if (elapsedMinutes >= 30) {
      return "Completed & Disbursed (30m elapsed)";
    } else {
      const remaining = Math.max(0, Math.ceil(30 - elapsedMinutes));
      return `Withdrawal Timer Active (${remaining} min remaining)`;
    }
  };

  // Calculate statistics
  const totalApps = loans.length;
  const pendingApps = loans.filter(l => l.status === "Pending").length;
  const approvedApps = loans.filter(l => l.status === "Approved").length;
  const rejectedApps = loans.filter(l => l.status === "Rejected").length;
  const totalApprovedVolume = loans
    .filter(l => l.status === "Approved")
    .reduce((sum, curr) => sum + curr.loanAmount, 0);

  // Filtered list
  const filteredLoans = loans.filter(loan => {
    const matchesSearch = 
      loan.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.mobileNumber.includes(searchTerm) ||
      loan.panNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.aadhaarNumber.includes(searchTerm);
    
    const matchesFilter = statusFilter === "All" || loan.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Rejected": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  const isKycFilePdf = (fileObj) => {
    if (!fileObj || !fileObj.data) return false;
    return (
      fileObj.data.startsWith("data:application/pdf") ||
      fileObj.name?.toLowerCase().endsWith(".pdf") ||
      fileObj.data.toLowerCase().endsWith(".pdf") ||
      fileObj.data.includes("/raw/upload/")
    );
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden">
      {/* Background radial overlays */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-slate-900 bg-slate-900/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="AVIVAA Logo" className="h-8 rounded-lg object-contain" />
            <div className="h-5 w-px bg-slate-800" />
            <span className="text-sm font-bold tracking-wider text-slate-400 uppercase">Underwriting Desk</span>
          </div>

          <div className="flex items-center gap-4">
            {adminUser && (
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-200">{adminUser.username}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-widest">{adminUser.role}</p>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-red-400 transition-all cursor-pointer flex items-center gap-2 text-xs font-semibold"
            >
              <LogOut size={16} /> <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 space-y-8">
        {/* Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Applications Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Audit credentials, evaluate risk metrics, and control disbursal workflows.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-slate-900/50 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">Total Requests</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{totalApps}</span>
              <span className="text-xs text-slate-500">files</span>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">Pending Evaluation</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-500">{pendingApps}</span>
              <span className="text-xs text-slate-500">in queue</span>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">Approved Loans</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-500">{approvedApps}</span>
              <span className="text-xs text-slate-500">cleared</span>
            </div>
          </div>
          <div className="bg-slate-900/50 border border-slate-900 p-5 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">Declined Loans</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-red-500">{rejectedApps}</span>
              <span className="text-xs text-slate-500">rejected</span>
            </div>
          </div>
          <div className="bg-emerald-950/20 border border-emerald-900/20 p-5 rounded-2xl flex flex-col justify-between col-span-1 sm:col-span-2 lg:col-span-1">
            <span className="text-[10px] uppercase font-black tracking-wider text-emerald-500/80">Approved Capital Volume</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-400">{formatCurrency(totalApprovedVolume)}</span>
            </div>
          </div>
        </div>

        {/* Filter and Search controls */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text"
              placeholder="Search by name, phone, PAN or Aadhaar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 text-white text-xs pl-11 pr-4 py-3 rounded-xl outline-none transition-all"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {["All", "Pending", "Approved", "Rejected"].map(filterVal => (
              <button
                key={filterVal}
                onClick={() => setStatusFilter(filterVal)}
                className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  statusFilter === filterVal 
                    ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/10" 
                    : "bg-slate-900 hover:bg-slate-850 text-slate-400 border border-slate-800"
                }`}
              >
                {filterVal}
              </button>
            ))}
          </div>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={36} className="text-emerald-500 animate-spin" />
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Synchronizing secure pipeline ledger...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 border border-slate-900 rounded-2xl bg-slate-900/10">
            <AlertCircle size={44} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">Failed to Synchronize</h3>
            <p className="text-slate-500 text-xs">{error}</p>
          </div>
        ) : filteredLoans.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/5">
            <FileText size={44} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No applications found</h3>
            <p className="text-slate-500 text-xs">There are no records matching your current filter guidelines.</p>
          </div>
        ) : (
          <div className="bg-slate-900/20 border border-slate-900 rounded-3xl overflow-hidden shadow-xl">
            {/* Desktop Table View */}
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-900/40 text-[10px] uppercase font-black tracking-wider text-slate-500">
                    <th className="py-4 px-6">Applicant</th>
                    <th className="py-4 px-6">Required Amount</th>
                    <th className="py-4 px-6">Monthly EMI</th>
                    <th className="py-4 px-6">Bank Name</th>
                    <th className="py-4 px-6">Audit Status</th>
                    <th className="py-4 px-6">Date Submitted</th>
                    <th className="py-4 px-6 text-right">Verification</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/50">
                  {filteredLoans.map(loan => (
                    <tr 
                      key={loan._id}
                      onClick={() => setSelectedLoan(loan)}
                      className="hover:bg-slate-900/30 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6">
                        <div className="font-bold text-sm text-slate-200">{loan.fullName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Phone size={10} /> {loan.mobileNumber}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-extrabold text-sm text-white">{formatCurrency(loan.loanAmount)}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5">{loan.loanDuration} Months tenure</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-sm text-slate-300">{formatCurrency(loan.emi)}</div>
                        <div className="text-[11px] text-emerald-500 font-semibold mt-0.5">{loan.interestRate}% Flat Flat</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-xs font-bold text-slate-400 truncate max-w-[120px]">{loan.bankDetails.bankName}</div>
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">{loan.bankDetails.ifscCode}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full border ${getStatusColor(loan.status)}`}>
                          {loan.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-400">
                        {new Date(loan.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric"
                        })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 group-hover:text-emerald-400 transition-all">
                          <ChevronRight size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List View */}
            <div className="block md:hidden divide-y divide-slate-900/50">
              {filteredLoans.map(loan => (
                <div 
                  key={loan._id}
                  onClick={() => setSelectedLoan(loan)}
                  className="p-5 hover:bg-slate-900/20 active:bg-slate-900/30 transition-colors cursor-pointer space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-bold text-base text-slate-200">{loan.fullName}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-mono">
                        <Phone size={12} /> {loan.mobileNumber}
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-full border ${getStatusColor(loan.status)}`}>
                      {loan.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-950/40 p-3.5 rounded-xl border border-slate-900/55">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider block">Requested Loan</span>
                      <span className="text-sm font-extrabold text-white mt-0.5 block">{formatCurrency(loan.loanAmount)}</span>
                      <span className="text-[10px] text-slate-450 mt-0.5 block">{loan.loanDuration} Months term</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase font-black tracking-wider block">Monthly EMI</span>
                      <span className="text-sm font-bold text-slate-300 mt-0.5 block">{formatCurrency(loan.emi)}</span>
                      <span className="text-[10px] text-emerald-500 font-semibold mt-0.5 block">{loan.interestRate}% Interest</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="text-slate-500">
                      Target Bank: <span className="font-bold text-slate-400">{loan.bankDetails.bankName}</span>
                    </div>
                    <div className="text-slate-500">
                      {new Date(loan.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short"
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Applicant Audit Details Modal */}
      <AnimatePresence>
        {selectedLoan && (
          <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" data-lenis-prevent>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-800 bg-slate-900/60 backdrop-blur-md flex items-center justify-between shrink-0">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white">{selectedLoan.fullName}</h2>
                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full border ${getStatusColor(selectedLoan.status)}`}>
                      {selectedLoan.status}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5 font-mono">ID: {selectedLoan._id}</p>
                </div>
                <button 
                  onClick={() => setSelectedLoan(null)}
                  className="p-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-8 flex-1" data-lenis-prevent>
                
                {/* 1. Loan Parameters & Disbursal Bank */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Loan Parameters */}
                  <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <DollarSign size={14} /> Underwriting Risk Parameters
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Requested Loan</span>
                        <span className="text-base font-extrabold text-white">{formatCurrency(selectedLoan.loanAmount)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Tenure Term</span>
                        <span className="text-base font-bold text-slate-200">{selectedLoan.loanDuration} Months</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Monthly flat rate EMI</span>
                        <span className="text-base font-bold text-slate-200">{formatCurrency(selectedLoan.emi)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Interest rate</span>
                        <span className="text-base font-bold text-emerald-400">{selectedLoan.interestRate}% Flat Flat</span>
                      </div>
                    </div>
                  </div>

                  {/* Disbursal Target Bank */}
                  <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <Landmark size={14} /> Disbursal Bank Coordinates
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Bank Provider</span>
                        <span className="text-sm font-bold text-white truncate block">{selectedLoan.bankDetails.bankName}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">IFSC Code</span>
                        <span className="text-sm font-mono font-bold text-slate-200">{selectedLoan.bankDetails.ifscCode}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Account Holder Name</span>
                        <span className="text-sm font-bold text-slate-200">{selectedLoan.bankDetails.accountHolder}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Disbursal Account Number</span>
                        <span className="text-sm font-mono font-bold text-white tracking-widest">{selectedLoan.bankDetails.accountNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Customer Credentials */}
                <div className="bg-slate-950/30 border border-slate-850 p-5 rounded-2xl space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <User size={14} /> KYC Profile Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Mobile Number</span>
                      <span className="text-xs font-bold text-white">{selectedLoan.mobileNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Email ID</span>
                      <span className="text-xs font-bold text-white truncate block">{selectedLoan.email || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Date of Birth</span>
                      <span className="text-xs font-bold text-white">{selectedLoan.dob}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">PAN Number</span>
                      <span className="text-xs font-mono font-bold text-white">{selectedLoan.panNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Aadhaar Card</span>
                      <span className="text-xs font-mono font-bold text-white">{selectedLoan.aadhaarNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Employment Profile</span>
                      <span className="text-xs font-bold text-white">{selectedLoan.employmentType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Establishment Name</span>
                      <span className="text-xs font-bold text-white truncate block">{selectedLoan.companyName || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Monthly Earnings</span>
                      <span className="text-xs font-bold text-emerald-400">{formatCurrency(selectedLoan.monthlyIncome)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Nominee Assigned</span>
                      <span className="text-xs font-bold text-slate-350">{selectedLoan.nomineeName} ({selectedLoan.nomineeRelation})</span>
                    </div>
                  </div>
                </div>

                {/* Underwriting & Disbursal Workflow (Admin Control Panel) */}
                <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                    <ShieldCheck size={14} /> Underwriting & Disbursal Workflow
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Withdrawal Status</span>
                      <span className={`text-sm font-bold block mt-1 ${selectedLoan.withdrawalTriggered ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {getWithdrawalStatusText(selectedLoan)}
                      </span>
                      {selectedLoan.withdrawalTriggered && (
                        <span className="text-[10px] text-slate-505 font-mono block mt-1">
                          Started at: {new Date(selectedLoan.withdrawalStartedAt).toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block mb-2">Loan Agreement (PDF for Client)</span>
                      {selectedLoan.adminPdf ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                            <FileText size={16} className="text-emerald-500" />
                            <span className="truncate max-w-[180px]">{selectedLoan.adminPdf.name}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <a 
                              href={selectedLoan.adminPdf.data}
                              download={selectedLoan.adminPdf.name}
                              target={selectedLoan.adminPdf.data.startsWith("http") ? "_blank" : undefined}
                              rel={selectedLoan.adminPdf.data.startsWith("http") ? "noopener noreferrer" : undefined}
                              className="py-1 px-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-300 flex items-center gap-1 cursor-pointer"
                            >
                              <Download size={10} /> Download PDF
                            </a>
                            <label className="py-1 px-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-lg text-[10px] font-bold text-slate-300 flex items-center gap-1 cursor-pointer">
                              <Upload size={10} /> Replace
                              <input 
                                type="file" 
                                accept=".pdf" 
                                onChange={handlePdfUpload}
                                className="hidden" 
                              />
                            </label>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <label className="py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors">
                            {uploadingPdf ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                            Upload PDF
                            <input 
                              type="file" 
                              accept=".pdf" 
                              onChange={handlePdfUpload}
                              disabled={uploadingPdf}
                              className="hidden" 
                            />
                          </label>
                          <span className="text-[10px] text-slate-500 leading-tight">Link a PDF document for user withdrawal access.</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 3. Inline KYC Document Attachments */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FileText size={14} /> Live Biometric & File Credentials
                  </h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Selfie Biometric */}
                    {selectedLoan.kycFiles?.selfieImage && (
                      <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-3 block">Selfie Audit Image</span>
                        <img 
                          src={selectedLoan.kycFiles.selfieImage} 
                          alt="Biometric Selfie" 
                          className="w-36 h-36 rounded-full object-cover border-4 border-slate-900 shadow-md"
                        />
                      </div>
                    )}

                    {/* PAN Card File */}
                    {selectedLoan.kycFiles?.panCard?.data && (
                      <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl flex flex-col items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-3 block truncate max-w-full">
                          PAN: {selectedLoan.kycFiles.panCard.name || "pan_card.jpg"}
                        </span>
                        
                        {isKycFilePdf(selectedLoan.kycFiles.panCard) ? (
                          <div className="h-32 w-full flex items-center justify-center bg-slate-900 rounded-xl">
                            <span className="text-xs font-bold text-slate-400">PDF Document</span>
                          </div>
                        ) : (
                          <img 
                            src={selectedLoan.kycFiles.panCard.data} 
                            alt="PAN Card" 
                            className="max-h-32 object-contain rounded-lg border border-slate-900"
                          />
                        )}

                        <a 
                          href={selectedLoan.kycFiles.panCard.data}
                          download={selectedLoan.kycFiles.panCard.name || "pan_card"}
                          target={selectedLoan.kycFiles.panCard.data.startsWith("http") ? "_blank" : undefined}
                          rel={selectedLoan.kycFiles.panCard.data.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="mt-3 py-1.5 px-3 bg-slate-900 hover:bg-slate-850 rounded-lg text-[10px] font-bold text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Download size={12} /> Download File
                        </a>
                      </div>
                    )}

                    {/* Aadhaar Front */}
                    {selectedLoan.kycFiles?.aadhaarFront?.data && (
                      <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl flex flex-col items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-3 block truncate max-w-full">
                          Aadhaar Front: {selectedLoan.kycFiles.aadhaarFront.name || "front.jpg"}
                        </span>
                        
                        {isKycFilePdf(selectedLoan.kycFiles.aadhaarFront) ? (
                          <div className="h-32 w-full flex items-center justify-center bg-slate-900 rounded-xl">
                            <span className="text-xs font-bold text-slate-400">PDF Document</span>
                          </div>
                        ) : (
                          <img 
                            src={selectedLoan.kycFiles.aadhaarFront.data} 
                            alt="Aadhaar Front" 
                            className="max-h-32 object-contain rounded-lg border border-slate-900"
                          />
                        )}

                        <a 
                          href={selectedLoan.kycFiles.aadhaarFront.data}
                          download={selectedLoan.kycFiles.aadhaarFront.name || "aadhaar_front"}
                          target={selectedLoan.kycFiles.aadhaarFront.data.startsWith("http") ? "_blank" : undefined}
                          rel={selectedLoan.kycFiles.aadhaarFront.data.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="mt-3 py-1.5 px-3 bg-slate-900 hover:bg-slate-850 rounded-lg text-[10px] font-bold text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Download size={12} /> Download File
                        </a>
                      </div>
                    )}

                    {/* Aadhaar Back */}
                    {selectedLoan.kycFiles?.aadhaarBack?.data && (
                      <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl flex flex-col items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-3 block truncate max-w-full">
                          Aadhaar Back: {selectedLoan.kycFiles.aadhaarBack.name || "back.jpg"}
                        </span>
                        
                        {isKycFilePdf(selectedLoan.kycFiles.aadhaarBack) ? (
                          <div className="h-32 w-full flex items-center justify-center bg-slate-900 rounded-xl">
                            <span className="text-xs font-bold text-slate-400">PDF Document</span>
                          </div>
                        ) : (
                          <img 
                            src={selectedLoan.kycFiles.aadhaarBack.data} 
                            alt="Aadhaar Back" 
                            className="max-h-32 object-contain rounded-lg border border-slate-900"
                          />
                        )}

                        <a 
                          href={selectedLoan.kycFiles.aadhaarBack.data}
                          download={selectedLoan.kycFiles.aadhaarBack.name || "aadhaar_back"}
                          target={selectedLoan.kycFiles.aadhaarBack.data.startsWith("http") ? "_blank" : undefined}
                          rel={selectedLoan.kycFiles.aadhaarBack.data.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="mt-3 py-1.5 px-3 bg-slate-900 hover:bg-slate-850 rounded-lg text-[10px] font-bold text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Download size={12} /> Download File
                        </a>
                      </div>
                    )}

                    {/* Nominee Doc */}
                    {selectedLoan.kycFiles?.nomineeDoc?.data && (
                      <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl flex flex-col items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-3 block truncate max-w-full">
                          Nominee ID: {selectedLoan.kycFiles.nomineeDoc.name || "nominee.jpg"}
                        </span>
                        
                        {isKycFilePdf(selectedLoan.kycFiles.nomineeDoc) ? (
                          <div className="h-32 w-full flex items-center justify-center bg-slate-900 rounded-xl">
                            <span className="text-xs font-bold text-slate-450">PDF Document</span>
                          </div>
                        ) : (
                          <img 
                            src={selectedLoan.kycFiles.nomineeDoc.data} 
                            alt="Nominee Document" 
                            className="max-h-32 object-contain rounded-lg border border-slate-900"
                          />
                        )}

                        <a 
                          href={selectedLoan.kycFiles.nomineeDoc.data}
                          download={selectedLoan.kycFiles.nomineeDoc.name || "nominee_doc"}
                          target={selectedLoan.kycFiles.nomineeDoc.data.startsWith("http") ? "_blank" : undefined}
                          rel={selectedLoan.kycFiles.nomineeDoc.data.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="mt-3 py-1.5 px-3 bg-slate-900 hover:bg-slate-855 rounded-lg text-[10px] font-bold text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Download size={12} /> Download File
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="p-6 border-t border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col sm:flex-row gap-3 justify-end shrink-0">
                {selectedLoan.status === "Pending" ? (
                  <>
                    <button
                      onClick={() => handleUpdateStatus(selectedLoan._id, "Rejected")}
                      disabled={updatingStatusId !== null}
                      className="px-6 py-3 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {updatingStatusId === selectedLoan._id ? <Loader2 size={14} className="animate-spin" /> : null}
                      Decline Application
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedLoan._id, "Approved")}
                      disabled={updatingStatusId !== null}
                      className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      {updatingStatusId === selectedLoan._id ? <Loader2 size={14} className="animate-spin" /> : null}
                      Approve & Disburse Loan
                    </button>
                  </>
                ) : (
                  <div className="text-slate-500 text-xs font-semibold flex items-center gap-2">
                    <ShieldCheck size={16} className="text-slate-400" /> This application has been locked under audit decision: <span className={`uppercase font-black ${selectedLoan.status === 'Approved' ? 'text-emerald-400' : 'text-red-400'}`}>{selectedLoan.status}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
