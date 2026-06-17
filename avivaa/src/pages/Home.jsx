import React, { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, CheckCircle2, TrendingDown, Zap, ShieldCheck,
  Users, Building2, MapPin, Award, HeartPulse, Home as HomeIcon, 
  GraduationCap, Plane, PlusCircle, Gem, Calculator, Info,
  Send, Upload, AlertCircle, Quote, Phone, CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import heroImage from "../assets/hero_image.png";

// --- Hero Section ---
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-navy/5 -skew-x-12 transform translate-x-20 z-0 hidden lg:block" />
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-green/10 rounded-full blur-3xl z-0" />
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10 w-full">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 bg-brand-green/10 text-brand-green px-4 py-2 rounded-full mb-6">
            <TrendingDown size={18} />
            <span className="text-sm font-bold uppercase tracking-wider">Interest rates as low as 0.5%*</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold leading-[1.1] mb-6 text-brand-navy">
            Making Finance <br />
            <span className="text-brand-green">Accessible</span> <br />
            to Everyone.
          </h1>
          
          <p className="text-lg text-brand-navy/60 max-w-lg mb-10 leading-relaxed">
            Quick funds for your personal needs. Medical expenses, home renovation, education, or travel. Get up to ₹5,00,000 with hassle-free processing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Link
                to="/apply"
                className="btn-primary flex items-center justify-center gap-2 group"
              >
                Get Started
                <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <motion.a
              href="/#services"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary flex items-center justify-center"
            >
              Learn More
            </motion.a>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
             <div className="flex items-center gap-2">
                <CheckCircle2 size={24} className="text-brand-green" />
                <span className="text-sm font-semibold text-brand-navy/80 tracking-tight">17 Years of Trust</span>
             </div>
             <div className="flex items-center gap-2">
                <ShieldCheck size={24} className="text-brand-green" />
                <span className="text-sm font-semibold text-brand-navy/80 tracking-tight">Secure Process</span>
             </div>
             <div className="flex items-center gap-2">
                <Zap size={24} className="text-brand-green" />
                <span className="text-sm font-semibold text-brand-navy/80 tracking-tight">24-Hr Approval</span>
             </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative lg:h-[600px] flex items-center justify-center w-full"
        >
          <div className="relative w-full max-w-lg aspect-square lg:aspect-[4/5] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white bg-slate-100 group">
            <img 
              src={heroImage} 
              alt="AVIVAA Finance" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
            />
            {/* Subtle premium brand gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/40 via-transparent to-transparent pointer-events-none" />
          </div>
          
          {/* Floating badge for Awwwards-style premium look */}
          <motion.div 
            animate={{ y: [10, -10, 10] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-4 bg-white shadow-2xl rounded-2xl p-5 flex items-center gap-4 border border-slate-100/80 backdrop-blur-md hidden sm:flex z-20"
          >
            <div className="w-12 h-12 bg-brand-green/10 rounded-full flex items-center justify-center text-brand-green shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status</p>
               <p className="text-base font-extrabold text-brand-navy">Docs Verified</p>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -bottom-6 -left-4 bg-white shadow-2xl rounded-2xl p-5 flex items-center gap-4 border border-slate-100/80 backdrop-blur-md hidden sm:flex z-20"
          >
            <div className="w-12 h-12 bg-brand-navy/5 rounded-full flex items-center justify-center text-brand-green shrink-0">
              <Zap size={24} />
            </div>
            <div>
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Approval Time</p>
               <p className="text-base font-extrabold text-brand-navy">24 Hours</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

// --- About Section ---
const STATS = [
  { label: "States Served", value: "28", icon: MapPin },
  { label: "Years of Trust", value: "17", icon: Award },
  { label: "Happy Customers", value: "8 Lakh+", icon: Users },
  { label: "Financial Partners", value: "50+", icon: Building2 },
];

function About() {
  return (
    <section id="about" className="section-padding bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 gap-4"
          >
            {STATS.map((stat, idx) => (
              <div 
                key={stat.label}
                className={`p-8 rounded-3xl flex flex-col items-center text-center transition-all hover:shadow-xl ${idx % 2 === 0 ? 'bg-brand-navy text-white mt-8' : 'bg-brand-green/10 text-brand-navy mb-8'}`}
              >
                <stat.icon size={32} className={idx % 2 === 0 ? 'text-brand-green mb-4' : 'text-brand-green mb-4'} />
                <h3 className="text-4xl font-display font-bold mb-2">{stat.value}</h3>
                <p className={`text-sm font-semibold uppercase tracking-widest ${idx % 2 === 0 ? 'text-white/60' : 'text-brand-navy/60'}`}>
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-sm font-bold text-brand-green uppercase tracking-[0.2em] mb-4">About Avivaa Finance</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-brand-navy mb-6 leading-tight">
              Leading the Way in <br />
              Digital Financial <br />
              Inclusion.
            </h3>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              Founded on the principles of technology, innovation, and partnership, Avivaa Finance is committed to bringing institutional capital to individuals and small businesses across India. With 17 years of experience, we've refined our process to be the fastest in the market.
            </p>
            
            <ul className="space-y-4 mb-10">
              {["Technology Driven Loans", "Transparent Fee Structure", "Tailored Financial Solutions", "Expert Advisory Support"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-brand-navy font-semibold">
                   <div className="w-6 h-6 rounded-full bg-brand-green/20 flex items-center justify-center text-brand-green">
                      <div className="w-2 h-2 rounded-full bg-brand-green" />
                   </div>
                   {item}
                </li>
              ))}
            </ul>

            <Link to="/our-journey" className="btn-primary inline-block">Our Journey</Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --- Services Section ---
const SERVICES = [
  { title: "Personal Loans", desc: "Flexible funds for any personal requirement, from weddings to medical bills.", icon: Users, color: "bg-blue-500" },
  { title: "Medical Expenses", desc: "Instant capital for urgent healthcare and hospital requirements.", icon: HeartPulse, color: "bg-red-500" },
  { title: "Home Renovation", desc: "Upgrade your living space with quick approval and easy installments.", icon: HomeIcon, color: "bg-orange-500" },
  { title: "Education Loans", desc: "Invest in your future without financial barriers. Simple processing.", icon: GraduationCap, color: "bg-emerald-500" },
  { title: "Travel Loans", desc: "Don't delay your dream vacation. Explore the world now, pay later.", icon: Plane, color: "bg-cyan-500" },
  { title: "Wedding Loans", desc: "Make your special day perfect with our tailored wedding finance options.", icon: Gem, color: "bg-pink-500" },
];

function Services() {
  return (
    <section id="services" className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            className="text-sm font-bold text-brand-green uppercase tracking-[0.2em] mb-4"
          >
            Our Offerings
          </motion.h2>
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-display font-bold text-brand-navy"
          >
            Financial Solutions <br />
            Tailored for You.
          </motion.h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service, idx) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -10 }}
              className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 transition-all hover:shadow-xl group"
            >
              <div className={`w-14 h-14 rounded-2xl ${service.color} bg-opacity-10 flex items-center justify-center text-brand-navy mb-6 group-hover:scale-110 transition-transform`}>
                <service.icon size={28} className={service.color.replace('bg-', 'text-')} />
              </div>
              <h4 className="text-xl font-display font-bold text-brand-navy mb-3">{service.title}</h4>
              <p className="text-slate-500 mb-6 leading-relaxed">
                {service.desc}
              </p>
              <Link to="/apply" className="inline-flex items-center gap-2 text-sm font-bold text-brand-navy hover:text-brand-green transition-colors">
                Apply Now <PlusCircle size={16} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// --- Loan Calculator Section ---
function LoanCalculator() {
  const [amount, setAmount] = useState(100000);
  const [tenure, setTenure] = useState(24);
  const rate = 0.5;

  const emi = useMemo(() => {
    const r = rate / 100;
    const n = tenure;
    const p = amount;
    const emiCalc = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emiCalc);
  }, [amount, tenure]);

  const totalInterest = emi * tenure - amount;

  return (
    <section id="calculator" className="section-padding bg-brand-navy text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-green/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
          >
            <div className="inline-flex items-center gap-2 bg-brand-green/20 text-brand-green px-4 py-2 rounded-full mb-6">
              <Calculator size={18} />
              <span className="text-sm font-bold uppercase tracking-wider">Loan Estimator</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Plan Your <br />
              Financial <span className="text-brand-green">Future</span>.
            </h2>
            <p className="text-lg text-white/60 mb-10 max-w-md">
              Use our interactive calculator to find the perfect loan structure for your needs. Quick approximations with zero commitment.
            </p>

            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold uppercase tracking-widest text-white/40">Loan Amount</label>
                  <span className="text-2xl font-display font-bold">₹ {amount.toLocaleString()}</span>
                </div>
                <input 
                  type="range" 
                  min="50000" 
                  max="500000" 
                  step="10000"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-green"
                />
                <div className="flex justify-between text-[10px] uppercase font-bold text-white/30">
                   <span>₹ 50,000</span>
                   <span>₹ 5,00,000</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-bold uppercase tracking-widest text-white/40">Tenure (Months)</label>
                  <span className="text-2xl font-display font-bold">{tenure} Months</span>
                </div>
                <input 
                  type="range" 
                  min="12" 
                  max="48" 
                  step="6"
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-green"
                />
                <div className="flex justify-between text-[10px] uppercase font-bold text-white/30">
                   <span>12 Months</span>
                   <span>48 Months</span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="w-full max-w-sm bg-white rounded-[40px] p-10 text-brand-navy shadow-2xl relative">
              <div className="absolute top-0 right-0 p-4">
                 <Info size={20} className="text-slate-300 hover:text-brand-green transition-colors cursor-help" />
              </div>

              <div className="text-center mb-10">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-2">Estimated Monthly EMI</p>
                <h3 className="text-6xl font-display font-bold text-brand-navy">₹ {emi.toLocaleString()}</h3>
              </div>

              <div className="space-y-6 mb-10">
                 <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-500">Interest Rate</span>
                    <span className="text-sm font-bold text-brand-green">0.5% Monthly</span>
                 </div>
                 <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                    <span className="text-sm font-medium text-slate-500">Total Interest</span>
                    <span className="text-sm font-bold">₹ {totalInterest.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-500">Total Payable</span>
                    <span className="text-sm font-bold">₹ {(amount + totalInterest).toLocaleString()}</span>
                 </div>
              </div>

              <Link to="/apply" className="w-full btn-primary !rounded-2xl text-center block">Apply for this Loan</Link>
              <p className="text-[10px] text-center text-slate-400 mt-6 leading-relaxed">
                *Calculations are indicative. Processing fees and other charges may apply at the time of dispersal.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --- Portfolio Section ---
const SUCCESS_STORIES = [
  { name: "Rajesh Kumar", category: "Small Business", content: "Avivaa Finance helped me scale my bakery when banks ignored me. The 0.5% interest rate was a game changer for my cash flow.", loanAmount: "₹ 3,00,000", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200" },
  { name: "Priya Sharma", category: "Home Renovation", content: "The approval process was incredibly fast. I applied on Monday and had the funds by Tuesday. My kitchen looks amazing now!", loanAmount: "₹ 1,50,000", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200" },
  { name: "Amit Patel", category: "Education", content: "Securing my daughter's higher education was top priority. Avivaa's transparent terms made the whole process stress-free.", loanAmount: "₹ 5,00,000", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200" },
  { name: "Sonia Verma", category: "Medical Emergency", content: "When my father needed surgery, Avivaa provided the funds within 24 hours. I can't thank them enough for their support.", loanAmount: "₹ 2,00,000", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200" },
  { name: "Vikram Singh", category: "Travel", content: "I always wanted to take my family on a world tour. Avivaa's flexible EMI options made it possible without feeling the pinch.", loanAmount: "₹ 4,00,000", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200" },
  { name: "Anjali Gupta", category: "Wedding", content: "My dream wedding became a reality thanks to Avivaa Finance. The process was smooth and the staff was very helpful.", loanAmount: "₹ 5,00,000", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200" },
];

function Portfolio() {
  const [showAll, setShowAll] = useState(false);
  const visibleStories = showAll ? SUCCESS_STORIES : SUCCESS_STORIES.slice(0, 3);
  return (
    <section id="portfolio" className="section-padding bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <h2 className="text-sm font-bold text-brand-green uppercase tracking-[0.2em] mb-4">Success Stories</h2>
            <h3 className="text-4xl md:text-5xl font-display font-bold text-brand-navy">
              Empowering Real <br />
              People, Real Dreams.
            </h3>
          </div>
          <button 
            onClick={() => setShowAll(!showAll)}
            className="btn-secondary !py-3 !px-6 text-sm"
          >
            {showAll ? "Show Less" : "View All Stories"}
          </button>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {visibleStories.map((story, idx) => (
              <motion.div
                key={story.name}
                initial={{ opacity: 0, scale: 0.9, y: 45 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false, amount: 0.1 }}
                transition={{ duration: 0.6, ease: "easeOut", delay: idx * 0.1 }}
                className="group relative bg-slate-50 rounded-[32px] p-8 border border-slate-100 overflow-hidden"
              >
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote size={80} />
              </div>
              
              <div className="flex items-center gap-4 mb-6">
                <img src={story.image} alt={story.name} className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md" />
                <div>
                   <h4 className="font-bold text-brand-navy">{story.name}</h4>
                   <p className="text-xs font-bold text-brand-green uppercase tracking-wider">{story.category}</p>
                </div>
              </div>

              <p className="text-slate-600 mb-8 italic leading-relaxed">
                "{story.content}"
              </p>

              <div className="flex justify-between items-center pt-6 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Loan Amount</span>
                <span className="text-lg font-bold text-brand-navy">{story.loanAmount}</span>
              </div>
            </motion.div>
          ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// --- Contact Form Section ---
function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState(null);
  const [hp, setHp] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hp) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSuccess(true);
      e.target.reset();
      setFileName(null);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <section id="contact" className="section-padding bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-3 gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-1"
          >
             <h2 className="text-sm font-bold text-brand-green uppercase tracking-[0.2em] mb-4">Contact Us</h2>
             <h3 className="text-4xl font-display font-bold text-brand-navy mb-8">Get Your Loan Approved Today.</h3>
             <p className="text-slate-500 mb-12">
               Fill out the form and our financial advisors will reach out to you within 24 hours to discuss your requirements.
             </p>

             <div className="space-y-8">
                {[
                  { icon: Phone, title: "WhatsApp", lines: ["+91 9077321430", "+91 8259089662", "+91 8258949088"] },
                  { icon: MapPin, title: "Head Office", lines: ["Office 108, Level 1 AI Fattan Currency House, Dubai International Financial Centre (DIFC), PO Box 482092, Dubai, UAE"] },
                  { icon: MapPin, title: "Branch Office", lines: ["401-A, The Kanakia Wall Street, Chakala, Near J B Nagar, Mumbai - 400093"] }
                ].map((item, idx) => (
                   <motion.div 
                     key={idx}
                     initial={{ opacity: 0, y: 25 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: false, amount: 0.2 }}
                     transition={{ duration: 0.5, delay: idx * 0.1 }}
                     className="flex items-start gap-4"
                   >
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-green shadow-sm border border-slate-100 shrink-0">
                         <item.icon size={20} />
                      </div>
                      <div>
                         <h4 className="font-bold text-brand-navy">{item.title}</h4>
                         {item.lines.map((line, lIdx) => (
                           <p key={lIdx} className="text-sm text-slate-500 max-w-[250px]">{line}</p>
                         ))}
                      </div>
                   </motion.div>
                ))}
             </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-2"
          >
            <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-xl border border-slate-100 relative overflow-hidden">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center text-center py-12"
                  >
                    <div className="w-20 h-20 bg-green-100 text-brand-green rounded-full flex items-center justify-center mb-6">
                       <CheckCircle size={40} />
                    </div>
                    <h3 className="text-3xl font-display font-bold text-brand-navy mb-4">Application Submitted!</h3>
                    <p className="text-slate-500 max-w-sm mb-8">
                       Thank you for choosing Avivaa Finance. Our team will review your details and contact you shortly.
                    </p>
                    <button onClick={() => setIsSuccess(false)} className="btn-secondary !py-3">New Application</button>
                  </motion.div>
                ) : (
                  <motion.form key="form" onSubmit={handleSubmit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid md:grid-cols-2 gap-6">
                    <input type="text" className="hidden" value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" />
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name *</label>
                       <input type="text" required placeholder="John Doe" className="input-field" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address *</label>
                       <input type="email" required placeholder="john@example.com" className="input-field" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Phone Number *</label>
                       <input type="tel" required placeholder="+91 00000 00000" className="input-field" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Company Name</label>
                       <input type="text" placeholder="Your Business LP" className="input-field" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">PAN Details *</label>
                       <input type="text" required placeholder="ABCDE1234F" className="input-field" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Aadhaar Number *</label>
                       <input type="text" required placeholder="XXXX XXXX XXXX" className="input-field" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Service Type *</label>
                       <select required className="input-field appearance-none">
                          <option value="">Select Service</option>
                          <option value="personal">Personal Loan</option>
                          <option value="business">Business Loan</option>
                          <option value="medical">Medical Loan</option>
                          <option value="education">Education Loan</option>
                          <option value="home">Home Renovation</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Inquiry Date *</label>
                       <input type="date" required className="input-field" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Message</label>
                       <textarea rows={4} placeholder="Describe your requirement..." className="input-field resize-none"></textarea>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                       <label className="text-xs font-bold uppercase tracking-widest text-slate-400 ml-1">Supporting Documents (PDF/JPG)</label>
                       <div onClick={() => fileInputRef.current?.click()} className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 hover:border-brand-green hover:bg-brand-green/5 transition-all cursor-pointer group">
                          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 group-hover:bg-brand-green group-hover:text-white transition-all">
                             <Upload size={20} />
                          </div>
                          <p className="text-sm font-semibold text-slate-500">{fileName || "Drag and drop or click to upload"}</p>
                          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                       </div>
                    </div>
                    {error && <div className="md:col-span-2 flex items-center gap-2 text-red-500 text-sm font-semibold"><AlertCircle size={16} />{error}</div>}
                    <div className="md:col-span-2">
                       <button type="submit" disabled={isSubmitting} className="w-full btn-primary !rounded-2xl py-4 flex items-center justify-center gap-3">
                          {isSubmitting ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Processing...</> : <>Submit Application<Send size={20} /></>}
                       </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// --- Main Home Component ---
export default function Home() {
  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.substring(1);
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, []);

  return (
    <div className="min-h-screen selection:bg-brand-green selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1 }}
        >
          <LoanCalculator />
        </motion.div>
        <Portfolio />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
