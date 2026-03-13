import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Zap, Phone, ArrowRight } from 'lucide-react';

const reasons = [
  {
    icon: DollarSign,
    emoji: '💰',
    title: 'Save on Fees',
    desc: 'Third-party apps add 15–30% fees. Order direct and pay the real price — no markup, ever.',
    highlight: 'Up to 30% cheaper',
    color: '#d4a017',
  },
  {
    icon: Zap,
    emoji: '⚡',
    title: 'Ready Faster',
    desc: 'Direct orders go straight to our kitchen. No middleman processing delays — your pizza is ready sooner.',
    highlight: '10 min faster on average',
    color: '#C0392B',
  },

  {
    icon: Phone,
    emoji: '📞',
    title: 'Real Support',
    desc: 'Issues? Speak to us directly. No chatbots, no waiting. We own the experience end to end.',
    highlight: 'Direct line always open',
    color: '#C0392B',
  },
];

const WhyOrderDirect: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    sectionRef.current?.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="bg-[#1a0a00] py-24 md:py-28 relative overflow-hidden">
      {/* Subtle red glow top-right */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#C0392B]/8 blur-[100px] rounded-full pointer-events-none" />

      <div className="container-custom relative z-10">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="reveal">
            <span className="font-barlow text-[13px] font-600 uppercase tracking-[0.3em] text-[#d4a017] block mb-4">
              — Why It Matters —
            </span>
            <h2 className="font-bebas text-[48px] md:text-[64px] text-white tracking-wider leading-none mb-4">
              Why Order<br /><span style={{ color: '#C0392B' }}>Direct?</span>
            </h2>
            <p className="font-inter text-white/40 text-[16px] leading-relaxed max-w-md">
              Every time you order through Uber Eats or DoorDash, you're paying 20–30% extra in hidden fees — and we get less. Order direct. Everyone wins.
            </p>
          </div>

          {/* Comparison mini-table */}
          <div className="reveal bg-[#2b1200] rounded-[16px] border border-white/8 overflow-hidden">
            <div className="grid grid-cols-3 text-center">
              <div className="p-4 border-b border-r border-white/5">
                <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-white/30">Fee</p>
              </div>
              <div className="p-4 border-b border-r border-white/5 bg-[#C0392B]/10">
                <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-[#C0392B]">Direct</p>
              </div>
              <div className="p-4 border-b border-white/5">
                <p className="font-barlow text-[11px] font-700 uppercase tracking-wider text-white/30">App</p>
              </div>
              {[
                ['Service Fee', '$0', '~$4–8'],
                ['Garlic Bread', '✓ Free', '✗ No'],
                ['Wait Time', 'Faster', 'Slower'],
              ].map(([label, direct, app]) => (
                <React.Fragment key={label}>
                  <div className="p-3 border-b border-r border-white/5 flex items-center justify-center">
                    <span className="font-barlow text-[12px] font-600 text-white/50">{label}</span>
                  </div>
                  <div className="p-3 border-b border-r border-white/5 bg-[#C0392B]/5 flex items-center justify-center">
                    <span className="font-barlow text-[13px] font-700 text-[#4ade80]">{direct}</span>
                  </div>
                  <div className="p-3 border-b border-white/5 flex items-center justify-center">
                    <span className="font-barlow text-[13px] font-600 text-white/30">{app}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        {/* Reason cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reasons.map((reason, i) => (
            <div
              key={reason.title}
              className="reveal group relative p-6 rounded-[14px] border border-white/5 bg-[#2b1200] hover:border-white/15 hover:-translate-y-1 transition-all duration-400"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-[10px] flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                style={{ background: `${reason.color}15`, border: `1px solid ${reason.color}30` }}
              >
                <reason.icon className="w-6 h-6" style={{ color: reason.color }} />
              </div>

              <h3 className="font-barlow font-700 text-[16px] uppercase tracking-wider text-white mb-2">{reason.title}</h3>
              <p className="font-inter text-[13px] text-white/40 leading-relaxed mb-4">{reason.desc}</p>

              {/* Highlight chip */}
              <span
                className="inline-flex items-center font-barlow text-[11px] font-700 uppercase tracking-wider px-3 py-1 rounded-full"
                style={{ background: `${reason.color}15`, color: reason.color, border: `1px solid ${reason.color}30` }}
              >
                {reason.highlight}
              </span>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4 reveal">
          <Link to="/menu" className="btn-primary px-10 py-4 text-[15px]">
            Order Direct Now <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="font-inter text-[13px] text-white/30">Free garlic bread on every direct order, today only.</p>
        </div>
      </div>
    </section>
  );
};

export default WhyOrderDirect;
