import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  Building2, Landmark, CheckCircle, AlertCircle, Clock, 
  Search, LogOut, FileText, ChevronRight, User, Phone, 
  Download, Calendar, ShieldCheck, DollarSign, Loader2, X, ArrowLeft, MessageSquare, Copy, Check, Trash2
} from "lucide-react";
import logo from "../assets/logo.jpeg";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Leads() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [adminUser, setAdminUser] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [dialog, setDialog] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info",
    onConfirm: null,
  });

  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [tempAccountNumber, setTempAccountNumber] = useState("");
  const [savingAccount, setSavingAccount] = useState(false);

  useEffect(() => {
    if (selectedLead) {
      setTempAccountNumber(selectedLead.bankDetails?.accountNumber || "");
      setIsEditingAccount(false);
    }
  }, [selectedLead]);

  const handleSaveAccountNumber = async () => {
    if (!tempAccountNumber.trim()) {
      showAlert("Account number cannot be empty", "error");
      return;
    }
    setSavingAccount(true);
    try {
      const token = localStorage.getItem("avivaa_dashboard_token");
      const response = await fetch(`${API_BASE_URL}/loans/${selectedLead._id}/account-number`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ accountNumber: tempAccountNumber })
      });

      if (!response.ok) {
        throw new Error("Failed to update account number");
      }

      const updated = await response.json();
      
      // Update local state
      setLoans(loans.map(loan => loan._id === selectedLead._id ? updated : loan));
      setSelectedLead(updated);
      setIsEditingAccount(false);
      showAlert("Account number updated successfully!", "success");
    } catch (err) {
      showAlert(err.message, "error");
    } finally {
      setSavingAccount(false);
    }
  };

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
      const response = await fetch(`${API_BASE_URL}/loans`, {
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

      const data = await response.json();
      setLoans(data);
    } catch (err) {
      setError(err.message || "Could not connect to API");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("avivaa_dashboard_token");
    localStorage.removeItem("avivaa_dashboard_user");
    navigate("/dashboard/login");
  };

  const handleCopyText = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const showAlert = (message, type = "info", title = "") => {
    setDialog({
      isOpen: true,
      title: title || (type === "success" ? "Success" : type === "error" ? "Error" : "Notice"),
      message,
      type,
      onConfirm: null
    });
  };

  const showConfirm = (title, message, onConfirm) => {
    setDialog({
      isOpen: true,
      title,
      message,
      type: "confirm",
      onConfirm
    });
  };

  const handleDeleteLead = (leadId) => {
    showConfirm(
      "Confirm Deletion",
      "Are you sure you want to permanently delete this lead record? This action cannot be undone and will delete all associated media files from Cloudinary storage.",
      async () => {
        setDeletingId(leadId);
        try {
          const token = localStorage.getItem("avivaa_dashboard_token");
          const response = await fetch(`${API_BASE_URL}/loans/${leadId}`, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error("Failed to delete lead record");
          }

          setLoans(loans.filter(loan => loan._id !== leadId));
          setSelectedLead(null);
          showAlert("Lead record and associated files deleted successfully.", "success");
        } catch (err) {
          showAlert(err.message, "error");
        } finally {
          setDeletingId(null);
        }
      }
    );
  };

  // Filter for incomplete/leads (currentStep < 8 and currentStep >= 2)
  const leads = loans.filter(loan => loan.currentStep !== undefined && loan.currentStep < 8);

  const filteredLeads = leads.filter(lead => {
    const nameMatch = lead.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const phoneMatch = lead.mobileNumber?.includes(searchTerm) || false;
    const emailMatch = lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    const idMatch = lead.loanId?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
    return nameMatch || phoneMatch || emailMatch || idMatch;
  });

  const getStepName = (stepNum) => {
    switch (stepNum) {
      case 2: return "Step 2: Personal Details Form";
      case 3: return "Step 3: Upload PAN Card";
      case 4: return "Step 4: Upload Aadhaar Front";
      case 5: return "Step 5: Upload Aadhaar Back";
      case 6: return "Step 6: Upload Selfie Photo";
      case 7: return "Step 7: Bank Details & Verification";
      default: return `Step ${stepNum || "Unknown"}`;
    }
  };

  const getStepProgressColor = (stepNum) => {
    if (stepNum >= 7) return "bg-emerald-500 text-slate-950";
    if (stepNum >= 4) return "bg-cyan-500 text-slate-950";
    return "bg-amber-500 text-slate-950";
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

  const formatCurrency = (val) => {
    if (!val) return "N/A";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden">
      {/* Background radial overlays */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-amber-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-cyan-500/5 blur-[150px] pointer-events-none" />

      {/* Navigation Header */}
      <header className="border-b border-slate-900 bg-slate-900/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="p-2 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-1.5 text-xs font-bold">
              <ArrowLeft size={16} /> Back
            </Link>
            <div className="h-5 w-px bg-slate-800" />
            <img src={logo} alt="AVIVAA Logo" className="h-8 rounded-lg object-contain hidden sm:block" />
            <span className="text-sm font-bold tracking-wider text-slate-400 uppercase">Leads Manager</span>
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
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Incomplete Application Leads 
            <span className="px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-black rounded-full border border-amber-500/20">
              {leads.length} Active Leads
            </span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Follow up with users who logged in and started their application, but did not complete the full submission.
          </p>
        </div>

        {/* Filter and Search controls */}
        <div className="bg-slate-900/30 border border-slate-900 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input 
              type="text"
              placeholder="Search leads by name, phone number, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500/50 text-white text-xs pl-11 pr-4 py-3 rounded-xl outline-none transition-all"
            />
          </div>
        </div>

        {/* Leads List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 size={36} className="text-amber-500 animate-spin" />
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Loading incomplete application leads...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16 border border-slate-900 rounded-2xl bg-slate-900/10">
            <AlertCircle size={44} className="text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">Failed to Synchronize</h3>
            <p className="text-slate-500 text-xs">{error}</p>
          </div>
        ) : filteredLeads.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-slate-800 rounded-2xl bg-slate-900/5">
            <FileText size={44} className="text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-white mb-1">No incomplete leads found</h3>
            <p className="text-slate-500 text-xs">There are no records matching your search queries.</p>
          </div>
        ) : (
          <div className="bg-slate-900/20 border border-slate-900 rounded-3xl overflow-hidden shadow-xl">
            {/* Desktop Table View */}
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-900 bg-slate-900/40 text-[10px] uppercase font-black tracking-wider text-slate-500">
                    <th className="py-4 px-6">Name</th>
                    <th className="py-4 px-6">Phone Number</th>
                    <th className="py-4 px-6">Email</th>
                    <th className="py-4 px-6">Progress State</th>
                    <th className="py-4 px-6">Last Active</th>
                    <th className="py-4 px-6 text-right">Audit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/50">
                  {filteredLeads.map(lead => (
                    <tr 
                      key={lead._id}
                      onClick={() => setSelectedLead(lead)}
                      className="hover:bg-slate-900/30 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-slate-200">{lead.fullName || "Unnamed User"}</span>
                          {lead.loanId && (
                            <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded">
                              {lead.loanId}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 text-sm font-bold text-slate-300 font-mono">
                        {lead.mobileNumber}
                      </td>
                      <td className="py-4 px-6 text-sm text-slate-400">
                        {lead.email || "Not entered yet"}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${getStepProgressColor(lead.currentStep)}`}>
                          {getStepName(lead.currentStep)}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-slate-400">
                        {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400 group-hover:text-amber-400 transition-all">
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
              {filteredLeads.map(lead => (
                <div 
                  key={lead._id}
                  onClick={() => setSelectedLead(lead)}
                  className="p-5 hover:bg-slate-900/20 active:bg-slate-900/30 transition-colors cursor-pointer space-y-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="font-bold text-base text-slate-200">{lead.fullName || "Unnamed User"}</div>
                        {lead.loanId && (
                          <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded">
                            {lead.loanId}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-1 font-mono">
                        <Phone size={12} /> {lead.mobileNumber}
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-full ${getStepProgressColor(lead.currentStep)}`}>
                      Step {lead.currentStep || "?"}
                    </span>
                  </div>

                  <div className="text-xs text-slate-400 flex flex-col gap-1">
                    <div>Email: <span className="font-semibold text-slate-300">{lead.email || "N/A"}</span></div>
                    <div>State: <span className="font-semibold text-amber-400">{getStepName(lead.currentStep)}</span></div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs text-slate-500 border-t border-slate-900/30">
                    <div>Last Active</div>
                    <div>
                      {new Date(lead.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Lead details Modal */}
      <AnimatePresence>
        {selectedLead && (
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
                    <h2 className="text-xl font-bold text-white">{selectedLead.fullName || "Unnamed User"}</h2>
                    <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full ${getStepProgressColor(selectedLead.currentStep)}`}>
                      {getStepName(selectedLead.currentStep)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-1">
                    {selectedLead.loanId && (
                      <span className="px-2 py-0.5 text-[10px] font-mono font-bold text-amber-450 bg-amber-500/10 border border-amber-500/20 rounded">
                        LOAN ID: {selectedLead.loanId}
                      </span>
                    )}
                    <span className="text-slate-500 text-[10px] font-mono">System ID: {selectedLead._id}</span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLead(null)}
                  className="p-2 bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto space-y-8 flex-1" data-lenis-prevent>
                
                {/* Contact Actions */}
                <div className="flex flex-wrap gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-2xl items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Phone className="text-amber-500" size={20} />
                    <div>
                      <p className="text-xs font-bold text-slate-200">Contact Lead</p>
                      <p className="text-[10px] text-slate-500">Call or Message this lead to help them finish the application.</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleCopyText(selectedLead.mobileNumber, `phone_${selectedLead._id}`)}
                      className="py-2 px-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-1.5 transition-all"
                    >
                      {copiedId === `phone_${selectedLead._id}` ? (
                        <>
                          <Check size={12} className="text-emerald-500" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> Copy Phone
                        </>
                      )}
                    </button>
                    <a 
                      href={`https://wa.me/91${selectedLead.mobileNumber}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                    >
                      <MessageSquare size={12} /> WhatsApp Lead
                    </a>
                  </div>
                </div>

                {/* 1. Loan Parameters & Disbursal Bank */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Loan Parameters */}
                  <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                      <DollarSign size={14} /> Requested Loan parameters
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Requested Loan</span>
                        <span className="text-base font-extrabold text-white">{formatCurrency(selectedLead.loanAmount)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Tenure Term</span>
                        <span className="text-base font-bold text-slate-200">{selectedLead.loanDuration ? `${selectedLead.loanDuration} Months` : "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Monthly EMI</span>
                        <span className="text-base font-bold text-slate-200">{formatCurrency(selectedLead.emi)}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Interest rate</span>
                        <span className="text-base font-bold text-amber-400">{selectedLead.interestRate ? `${selectedLead.interestRate}%` : "N/A"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Disbursal Target Bank */}
                  <div className="bg-slate-950/60 border border-slate-850 p-5 rounded-2xl space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                      <Landmark size={14} /> Bank Details
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Bank Provider</span>
                        <span className="text-sm font-bold text-white truncate block">{selectedLead.bankDetails?.bankName || "N/A"}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">IFSC Code</span>
                        <span className="text-sm font-mono font-bold text-slate-200">{selectedLead.bankDetails?.ifscCode || "N/A"}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Account Holder Name</span>
                        <span className="text-sm font-bold text-slate-200">{selectedLead.bankDetails?.accountHolder || "N/A"}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-[10px] text-slate-500 uppercase font-semibold block">Disbursal Account Number</span>
                        {isEditingAccount ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="text"
                              value={tempAccountNumber}
                              onChange={(e) => setTempAccountNumber(e.target.value.replace(/\D/g, ""))}
                              className="bg-slate-950 border border-slate-800 text-white font-mono text-sm px-3 py-1.5 rounded-xl outline-none focus:border-emerald-500/50 w-full"
                              placeholder="Enter new account number"
                            />
                            <button
                              onClick={handleSaveAccountNumber}
                              disabled={savingAccount}
                              className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors"
                            >
                              {savingAccount ? <Loader2 size={12} className="animate-spin" /> : "Save"}
                            </button>
                            <button
                              onClick={() => {
                                setTempAccountNumber(selectedLead.bankDetails?.accountNumber || "");
                                setIsEditingAccount(false);
                              }}
                              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-sm font-mono font-bold text-white tracking-widest">
                              {selectedLead.bankDetails?.accountNumber || "N/A"}
                            </span>
                            {selectedLead.bankDetails && (
                              <button
                                onClick={() => setIsEditingAccount(true)}
                                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                              >
                                Edit
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Customer Credentials */}
                <div className="bg-slate-950/30 border border-slate-855 p-5 rounded-2xl space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                    <User size={14} /> Profile Information
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Mobile Number</span>
                      <span className="text-xs font-bold text-white">{selectedLead.mobileNumber}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Email ID</span>
                      <span className="text-xs font-bold text-white truncate block">{selectedLead.email || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Date of Birth</span>
                      <span className="text-xs font-bold text-white">{selectedLead.dob || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">PAN Number</span>
                      <span className="text-xs font-mono font-bold text-white">{selectedLead.panNumber || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Aadhaar Card</span>
                      <span className="text-xs font-mono font-bold text-white">{selectedLead.aadhaarNumber || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Employment Profile</span>
                      <span className="text-xs font-bold text-white">{selectedLead.employmentType || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Establishment Name</span>
                      <span className="text-xs font-bold text-white truncate block">{selectedLead.companyName || "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Monthly Earnings</span>
                      <span className="text-xs font-bold text-emerald-400">{selectedLead.monthlyIncome ? formatCurrency(selectedLead.monthlyIncome) : "N/A"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold block">Nominee Assigned</span>
                      <span className="text-xs font-bold text-slate-350">{selectedLead.nomineeName || "N/A"} {selectedLead.nomineeRelation ? `(${selectedLead.nomineeRelation})` : ""}</span>
                    </div>
                  </div>
                </div>

                {/* 3. Inline KYC Document Attachments */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <FileText size={14} /> Biometric & File Credentials (If uploaded)
                  </h3>
                  <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {/* Selfie Biometric */}
                    {selectedLead.kycFiles?.selfieImage ? (
                      <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl flex flex-col items-center">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-3 block">Selfie Image</span>
                        <img 
                          src={selectedLead.kycFiles.selfieImage} 
                          alt="Biometric Selfie" 
                          className="w-36 h-36 rounded-full object-cover border-4 border-slate-900 shadow-md"
                        />
                      </div>
                    ) : (
                      <div className="bg-slate-950/40 p-4 border border-dashed border-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-600 text-xs py-10">
                        No Selfie Uploaded Yet
                      </div>
                    )}

                    {/* PAN Card File */}
                    {selectedLead.kycFiles?.panCard?.data ? (
                      <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl flex flex-col items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-3 block truncate max-w-full">
                          PAN: {selectedLead.kycFiles.panCard.name || "pan_card.jpg"}
                        </span>
                        
                        {isKycFilePdf(selectedLead.kycFiles.panCard) ? (
                          <div className="h-32 w-full flex items-center justify-center bg-slate-900 rounded-xl">
                            <span className="text-xs font-bold text-slate-400">PDF Document</span>
                          </div>
                        ) : (
                          <img 
                            src={selectedLead.kycFiles.panCard.data} 
                            alt="PAN Card" 
                            className="max-h-32 object-contain rounded-lg border border-slate-900"
                          />
                        )}

                        <a 
                          href={selectedLead.kycFiles.panCard.data}
                          download={selectedLead.kycFiles.panCard.name || "pan_card"}
                          target={selectedLead.kycFiles.panCard.data.startsWith("http") ? "_blank" : undefined}
                          rel={selectedLead.kycFiles.panCard.data.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="mt-3 py-1.5 px-3 bg-slate-900 hover:bg-slate-850 rounded-lg text-[10px] font-bold text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Download size={12} /> Download
                        </a>
                      </div>
                    ) : (
                      <div className="bg-slate-950/40 p-4 border border-dashed border-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-600 text-xs py-10">
                        No PAN Card Uploaded Yet
                      </div>
                    )}

                    {/* Aadhaar Front */}
                    {selectedLead.kycFiles?.aadhaarFront?.data ? (
                      <div className="bg-slate-950 p-4 border border-slate-850 rounded-2xl flex flex-col items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 mb-3 block truncate max-w-full">
                          Aadhaar Front: {selectedLead.kycFiles.aadhaarFront.name || "front.jpg"}
                        </span>
                        
                        {isKycFilePdf(selectedLead.kycFiles.aadhaarFront) ? (
                          <div className="h-32 w-full flex items-center justify-center bg-slate-900 rounded-xl">
                            <span className="text-xs font-bold text-slate-400">PDF Document</span>
                          </div>
                        ) : (
                          <img 
                            src={selectedLead.kycFiles.aadhaarFront.data} 
                            alt="Aadhaar Front" 
                            className="max-h-32 object-contain rounded-lg border border-slate-900"
                          />
                        )}

                        <a 
                          href={selectedLead.kycFiles.aadhaarFront.data}
                          download={selectedLead.kycFiles.aadhaarFront.name || "aadhaar_front"}
                          target={selectedLead.kycFiles.aadhaarFront.data.startsWith("http") ? "_blank" : undefined}
                          rel={selectedLead.kycFiles.aadhaarFront.data.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="mt-3 py-1.5 px-3 bg-slate-900 hover:bg-slate-850 rounded-lg text-[10px] font-bold text-slate-300 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Download size={12} /> Download
                        </a>
                      </div>
                    ) : (
                      <div className="bg-slate-950/40 p-4 border border-dashed border-slate-900 rounded-2xl flex flex-col items-center justify-center text-slate-600 text-xs py-10">
                        No Aadhaar Front Uploaded Yet
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="p-6 border-t border-slate-800 bg-slate-900/60 backdrop-blur-md flex flex-col sm:flex-row gap-4 justify-between items-center shrink-0">
                <div>
                  <button
                    onClick={() => handleDeleteLead(selectedLead._id)}
                    disabled={deletingId !== null}
                    className="w-full sm:w-auto px-5 py-3 border border-red-500/30 bg-red-955/20 hover:bg-red-900/20 text-red-500 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {deletingId === selectedLead._id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Trash2 size={14} />
                    )}
                    Delete Lead
                  </button>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 transition-colors"
                >
                  Close Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Custom Dialog Alert / Confirm */}
      <AnimatePresence>
        {dialog.isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 overflow-hidden relative"
            >
              {/* Type Accent Bar or Icon */}
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl shrink-0 ${
                  dialog.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                  dialog.type === 'error' ? 'bg-red-500/10 text-red-400' :
                  dialog.type === 'confirm' ? 'bg-amber-500/10 text-amber-400' :
                  'bg-cyan-500/10 text-cyan-400'
                }`}>
                  {dialog.type === 'success' && <CheckCircle size={24} />}
                  {dialog.type === 'error' && <AlertCircle size={24} />}
                  {dialog.type === 'confirm' && <Trash2 size={24} />}
                  {dialog.type === 'info' && <FileText size={24} />}
                </div>
                
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-base font-bold text-white leading-tight">
                    {dialog.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {dialog.message}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex justify-end gap-3">
                {dialog.type === 'confirm' ? (
                  <>
                    <button
                      onClick={() => setDialog({ ...dialog, isOpen: false })}
                      className="px-4 py-2.5 bg-slate-955 hover:bg-slate-850 border border-slate-800 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        setDialog({ ...dialog, isOpen: false });
                        if (dialog.onConfirm) dialog.onConfirm();
                      }}
                      className="px-5 py-2.5 bg-red-500 hover:bg-red-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-red-500/10 transition-colors cursor-pointer"
                    >
                      Confirm
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setDialog({ ...dialog, isOpen: false })}
                    className={`px-6 py-2.5 font-bold rounded-xl text-xs transition-colors cursor-pointer ${
                      dialog.type === 'success' ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950' :
                      dialog.type === 'error' ? 'bg-red-500 hover:bg-red-400 text-slate-950' :
                      'bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-800'
                    }`}
                  >
                    OK
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
