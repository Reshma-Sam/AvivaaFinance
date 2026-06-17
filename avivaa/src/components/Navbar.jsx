import { motion, useScroll, useTransform } from "motion/react";
import { useEffect, useState } from "react";
import { Menu, X, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";

const NAV_LINKS = [
  { name: "About", href: "/#about" },
  { name: "Services", href: "/#services" },
  { name: "Our Journey", href: "/our-journey" },
  { name: "Testimonials", href: "/#portfolio" },
  { name: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      const previous = scrollY.getPrevious() || 0;
      if (latest > previous && latest > 150) {
        setHidden(true);
      } else {
        setHidden(false);
      }
    });
  }, [scrollY]);

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(248, 250, 252, 0)", "rgba(248, 250, 252, 0.9)"]
  );
  const borderBottom = useTransform(
    scrollY,
    [0, 100],
    ["rgba(255, 255, 255, 0)", "rgba(0, 43, 91, 0.1)"]
  );

  return (
    <motion.nav
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={isMobile ? (hidden ? "hidden" : "visible") : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      style={{ backgroundColor, borderBottom }}
      className={`${isMobile ? "fixed" : "absolute"} top-0 left-0 right-0 z-50 backdrop-blur-sm transition-colors duration-300`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center group">
          <div className="w-16 h-16 rounded-xl flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105 shadow-sm border border-slate-100">
             <img src={logo} alt="AVIVAA logo" className="w-full h-full object-cover" />
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-brand-navy/70 hover:text-brand-navy transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-green transition-all group-hover:w-full"></span>
            </a>
          ))}
          <Link
            to="/apply"
            className="flex items-center gap-2 bg-brand-navy text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-navy/90 transition-all hover:shadow-lg active:scale-95"
          >
            <PhoneCall size={16} />
            Apply Now
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-brand-navy p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={isOpen ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
        className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-b border-brand-navy/10"
      >
        <div className="flex flex-col gap-4 p-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-lg font-semibold text-brand-navy"
            >
              {link.name}
            </a>
          ))}
          <Link
            to="/apply"
            onClick={() => setIsOpen(false)}
            className="bg-brand-navy text-white px-6 py-4 rounded-xl text-center font-bold block"
          >
            Apply Now
          </Link>
        </div>
      </motion.div>
    </motion.nav>
  );
}
