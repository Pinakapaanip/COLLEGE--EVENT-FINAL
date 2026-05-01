import { useEffect, useState } from "react";

const images = ["/images/event-stage.svg", "/images/event-lab.svg", "/images/event-tech.svg"];

export default function Carousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % images.length);
    }, 3600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className="relative h-72 overflow-hidden rounded-xl border border-cyan-300/30 shadow-2xl shadow-purple-700/30 md:h-96">
      {images.map((image, index) => (
        <img
          key={image}
          src={image}
          alt="Chanakya University event showcase"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            active === index ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/75 via-purple-950/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-cyan-200">Chanakya University</p>
        <h2 className="mt-3 text-5xl font-black text-white drop-shadow-2xl md:text-7xl">OJAS 2K26</h2>
        <p className="mt-3 max-w-2xl text-sm text-slate-200 md:text-base">
          Centralized event operations, live participation tracking, and leadership analytics.
        </p>
      </div>
      <div className="absolute bottom-5 right-5 flex gap-2">
        {images.map((image, index) => (
          <button
            key={image}
            onClick={() => setActive(index)}
            className={`h-2.5 rounded-full transition-all ${active === index ? "w-8 bg-cyan-300" : "w-2.5 bg-white/40"}`}
            aria-label={`Show slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
