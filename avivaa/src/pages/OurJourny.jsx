import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "motion/react";
import { Award, Target, History, Users2 } from "lucide-react";
import { Link } from "react-router-dom";


export default function OurJourney() {
  const milestones = [
    {
      year: "2007",
      title: "The Foundation",
      desc: "Avivaa Finance was born with a vision to revolutionize the digital lending landscape in India.",
      icon: History,
    },
    {
      year: "2012",
      title: "1 Lakh Customers",
      desc: "Crossed our first major milestone, serving diverse needs across 10+ states.",
      icon: Users2,
    },
    {
      year: "2018",
      title: "Tech Innovation",
      desc: "Launched our first fully automated loan approval system, reducing wait times by 80%.",
      icon: Target,
    },
    {
      year: "2024",
      title: "Trusted Financial Partner",
      desc: "Recognized as a leading finance provider with over 17 years of excellence and 8 Lakh+ happy customers.",
      icon: Award,
    },
  ];

  return (
    <div className="min-h-screen selection:bg-brand-green selection:text-white bg-slate-50">
      <Navbar />
      <main className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.1 }}
            className="text-center mb-20"
          >
            <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-navy mb-6">
              Our <span className="text-brand-green">Journey</span>
            </h1>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              For over 17 years, we've been dedicated to making finance accessible, transparent, and fast for everyone. Our story is built on trust and innovation.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-brand-navy/10 hidden md:block" />

            <div className="space-y-12">
              {milestones.map((milestone, idx) => (
                  <motion.div
                    key={milestone.year}
                    initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: false, amount: 0.2 }}
                    className={`flex flex-col md:flex-row items-center gap-8 ${
                      idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    }`}
                  >
                  <div className="flex-1 text-center md:text-right">
                    <div className={idx % 2 === 0 ? "md:text-right" : "md:text-left"}>
                      <span className="text-4xl font-display font-bold text-brand-green mb-2 inline-block">
                        {milestone.year}
                      </span>
                      <h3 className="text-2xl font-bold text-brand-navy mb-4">{milestone.title}</h3>
                      <p className="text-slate-500 max-w-sm ml-auto mr-auto md:ml-0 md:mr-0 inline-block">
                        {milestone.desc}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 w-16 h-16 bg-white border-2 border-brand-green rounded-full flex items-center justify-center text-brand-green shadow-xl shrink-0">
                    <milestone.icon size={28} />
                  </div>

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.2 }}
            className="mt-32 p-12 bg-brand-navy rounded-[40px] text-white text-center shadow-2xl overflow-hidden relative"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/20 rounded-full blur-[100px]" />
            <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-white/60 mb-10 max-w-lg mx-auto">
              Join 8 Lakh+ happy customers who transformed their financial future with Avivaa Finance.
            </p>
            <Link to="/apply" className="btn-primary inline-flex items-center gap-2">
              Apply Now
            </Link>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
