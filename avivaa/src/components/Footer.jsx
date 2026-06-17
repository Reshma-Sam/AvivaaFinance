import { ArrowUp } from "lucide-react";
import logo from "../assets/logo.jpeg";

const Facebook = (props) => (
  <svg viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Instagram = (props) => (
  <svg viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const Linkedin = (props) => (
  <svg viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const Twitter = (props) => (
  <svg viewBox="0 0 24 24" width={props.size || 24} height={props.size || 24} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-brand-navy text-white pt-20 pb-10 overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden border border-white/10 shadow-sm shrink-0">
                 <img src={logo} alt="AVIVAA logo" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-xl font-bold tracking-tighter text-white">AVIVAA</span>
                <span className="text-[10px] font-bold tracking-[0.3em] text-brand-green">FINANCE</span>
              </div>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              We are here to bring you products that are led by technology, innovation and partnership. Bringing institutional capital to everyone.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Facebook, href: "#" },
                { Icon: Instagram, href: "https://www.instagram.com/avivaafinance?igsh=MWtpNnFoejNxZ21rag%3D%3D" },
                { Icon: Linkedin, href: "#" },
                { Icon: Twitter, href: "#" }
              ].map(({ Icon, href }, idx) => (
                <a 
                  key={idx} 
                  href={href} 
                  target={href !== "#" ? "_blank" : undefined}
                  rel={href !== "#" ? "noopener noreferrer" : undefined}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-brand-green hover:border-brand-green transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-3 grid md:grid-cols-3 gap-8 p-8 bg-white/5 rounded-[32px] border border-white/10">
             <div>
                <h5 className="text-brand-green text-xs font-bold uppercase tracking-widest mb-4">Head Office</h5>
                <p className="text-sm text-white/70 leading-relaxed">
                  Office 108, Level 1 AI Fattan Currency House, Dubai International Financial Centre (DIFC), PO Box 482092, Dubai, UAE
                </p>
             </div>
             <div>
                <h5 className="text-brand-green text-xs font-bold uppercase tracking-widest mb-4">Branch Office</h5>
                <p className="text-sm text-white/70 leading-relaxed">
                  401-A, The Kanakia Wall Street, Chakala, Near J B Nagar, Mumbai - 400093
                </p>
             </div>
             <div>
                <h5 className="text-brand-green text-xs font-bold uppercase tracking-widest mb-4">WhatsApp</h5>
                <div className="space-y-1">
                   <p className="text-sm text-white/70 tracking-wide font-mono">+91 9077321430</p>
                   <p className="text-sm text-white/70 tracking-wide font-mono">+91 8259089662</p>
                   <p className="text-sm text-white/70 tracking-wide font-mono">+91 8258949088</p>
                </div>
             </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div>
             <h4 className="font-display font-bold text-lg mb-6">Quick Links</h4>
             <ul className="space-y-4 text-sm text-white/50">
               {[
                 { name: "About Us", href: "/#about" },
                 { name: "Our Services", href: "/#services" },
                 { name: "Our Journey", href: "/our-journey" },
                 { name: "Loan Calculator", href: "/#calculator" },
                 { name: "Contact", href: "/#contact" }
               ].map((link) => (
                 <li key={link.name}>
                   <a href={link.href} className="hover:text-brand-green transition-colors">{link.name}</a>
                 </li>
               ))}
             </ul>
          </div>

          <div>
             <h4 className="font-display font-bold text-lg mb-6">Services</h4>
             <ul className="space-y-4 text-sm text-white/50">
               {["Personal Loan", "Business Loan", "Medical Finance", "Home Improvement", "Travel Loan"].map((link) => (
                 <li key={link}>
                   <a href="/#services" className="hover:text-brand-green transition-colors">{link}</a>
                 </li>
               ))}
             </ul>
          </div>

          <div>
             <h4 className="font-display font-bold text-lg mb-6">Newsletter</h4>
             <p className="text-sm text-white/50 mb-6">Subscribe to get the latest financial insights and offers.</p>
             <div className="relative">
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-green transition-all"
                />
                <button className="absolute right-2 top-2 bottom-2 bg-brand-green text-white px-4 rounded-lg text-xs font-bold hover:bg-brand-green/90 transition-all">
                   Join
                </button>
             </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-xs text-white/30">
             © 2026 Avivaa Finance. All rights reserved. | Terms & Conditions Applied.
           </p>
           
           <button 
             onClick={scrollToTop}
             className="flex items-center gap-2 text-xs font-bold text-white/40 hover:text-brand-green transition-all group"
           >
             Back to Top
             <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand-green">
               <ArrowUp size={14} />
             </div>
           </button>
        </div>
      </div>
    </footer>
  );
}
