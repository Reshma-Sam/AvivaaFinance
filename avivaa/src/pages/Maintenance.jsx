import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  Server,
  RefreshCw,
  ShieldCheck,
  Clock,
  Phone,
  Mail,
  Check,
  AlertCircle
} from "lucide-react";
import logo from "../assets/logo.jpeg";

export default function Maintenance() {
  const [countdown, setCountdown] = useState(30);
  const [isChecking, setIsChecking] = useState(false);
  const [statusFeedback, setStatusFeedback] = useState(null);

  // Auto-refresh countdown loop
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleCheckStatus(true);
      setCountdown(30);
    }
  }, [countdown]);

  const handleCheckStatus = (isAuto = false) => {
    setIsChecking(true);
    setStatusFeedback("Pinging server cluster...");

    setTimeout(() => {
      setIsChecking(false);
      setStatusFeedback("HTTP 503: Maintenance still in progress. Retrying automatically.");
      setTimeout(() => setStatusFeedback(null), 4000);
    }, 1500);
  };

  return (
    <div className="h-screen w-screen bg-white text-slate-800 font-sans flex flex-col justify-between p-4 sm:p-6 md:p-8 overflow-hidden relative selection:bg-brand-green selection:text-white">
      {/* Subtle Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#002b5b 1px, transparent 1px)`,
          backgroundSize: "24px 24px"
        }}
      />

      {/* Top Header */}
      <header className="relative z-10 max-w-4xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shadow-sm flex items-center justify-center p-0.5 bg-white shrink-0">
            <img src={logo} alt="AVIVAA Logo" className="w-full h-full object-cover rounded-lg" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-[#002b5b] font-display">AVIVAA</span>
              <span className="text-[8px] font-extrabold tracking-[0.2em] text-[#26892C] bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                FINANCE
              </span>
            </div>
            <p className="text-[10px] text-slate-400">Institutional Capital & Financial Services</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200/80 px-3 py-1 rounded-full text-xs text-amber-800 font-medium shadow-sm">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span>System Maintenance</span>
        </div>
      </header>

      {/* Main Center Body (Fits seamlessly inside 1 viewport) */}
      <main className="relative z-10 max-w-2xl w-full mx-auto text-center my-auto py-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="space-y-4 md:space-y-5"
        >
          {/* Minimalist Icon */}
          <div className="inline-flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center shadow-sm relative">
              <Server className="w-8 h-8 sm:w-10 sm:h-10 text-[#002b5b]" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 items-center justify-center text-[9px] text-white font-bold">!</span>
              </span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 bg-rose-50 text-rose-700 border border-rose-200 px-3 py-0.5 rounded-full text-[11px] font-semibold">
              <AlertCircle className="w-3 h-3" />
              Server Down (HTTP 503)
            </span>
            <span className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-600 border border-slate-200 px-3 py-0.5 rounded-full text-[11px] font-medium">
              <Clock className="w-3 h-3 text-slate-500" />
              Scheduled Upgrade
            </span>
          </div>

          {/* Heading and Clean Description */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#002b5b] tracking-tight font-display">
              We&apos;re Under Scheduled Maintenance
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Our core servers and financial services are currently undergoing infrastructure maintenance and security upgrades. 
              <span className="font-semibold text-slate-800 block mt-1">Please wait, we will be back online shortly.</span>
            </p>
          </div>

          {/* Compact Telemetry & Safety Badges */}
          <div className="grid grid-cols-3 gap-2 max-w-lg mx-auto text-left pt-1">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Status</div>
              <div className="text-xs font-bold text-amber-600 mt-0.5">Upgrading</div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Client Data</div>
              <div className="text-xs font-bold text-[#26892C] flex items-center justify-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3" /> 100% Safe
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Incident ID</div>
              <div className="text-xs font-mono font-bold text-slate-700 mt-0.5">AVV-8941</div>
            </div>
          </div>

          {/* Compact Reconnect / Check Status Box */}
          <div className="max-w-md mx-auto pt-1 space-y-2">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 space-y-2.5 shadow-sm">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className={`w-3.5 h-3.5 text-[#26892C] ${isChecking ? "animate-spin" : ""}`} />
                  Auto-checking server:
                </span>
                <span className="font-mono font-bold text-[#002b5b] bg-white px-2 py-0.5 rounded border border-slate-200">
                  {countdown}s
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full bg-[#26892C] transition-all duration-1000 ease-linear"
                  style={{ width: `${((30 - countdown) / 30) * 100}%` }}
                />
              </div>

              {/* Check button */}
              <button
                onClick={() => handleCheckStatus(false)}
                disabled={isChecking}
                className="w-full py-2.5 px-4 bg-[#002b5b] hover:bg-[#002044] active:scale-[0.99] disabled:opacity-60 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? "animate-spin" : ""}`} />
                {isChecking ? "Pinging Server..." : "Check Status Now"}
              </button>

              {statusFeedback && (
                <div className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 font-mono">
                  {statusFeedback}
                </div>
              )}
            </div>
          </div>

          {/* Quick Contact Links */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-3 text-xs">
            <span className="text-slate-400">Need urgent assistance?</span>
            <a
              href="https://wa.me/919447051433?text=Hi%20Avivaa%20Finance,%20I%20have%20an%20urgent%20inquiry."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[#26892C] font-semibold hover:underline"
            >
              <Phone className="w-3.5 h-3.5" /> WhatsApp Support
            </a>
            <span className="text-slate-300">•</span>
            <a
              href="mailto:support@avivaafinance.com"
              className="inline-flex items-center gap-1.5 text-[#002b5b] font-semibold hover:underline"
            >
              <Mail className="w-3.5 h-3.5" /> support@avivaafinance.com
            </a>
          </div>
        </motion.div>
      </main>

      {/* Clean 1-Line Footer */}
      <footer className="relative z-10 max-w-4xl w-full mx-auto border-t border-slate-100 pt-3 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-1 text-center sm:text-left">
        <div>© 2026 Avivaa Finance. All rights reserved.</div>
        <div className="flex items-center gap-2">
          <span>Mumbai • Dubai</span>
          <span>•</span>
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> 256-Bit SSL Encrypted
          </span>
        </div>
      </footer>
    </div>
  );
}
