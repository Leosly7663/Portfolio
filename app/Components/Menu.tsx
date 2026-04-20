import React from "react";

const NavBar: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <nav className="fixed inset-x-0 top-0 z-20 px-4 py-4">
      <div className="mx-auto flex max-w-6xl items-center justify-between rounded-full border border-white/80 bg-white/78 px-6 py-3 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur">
        <button
          type="button"
          onClick={() => scrollToSection("top")}
          className="text-left"
        >
          <span className="block text-xs font-semibold uppercase tracking-[0.35em] text-sky-700">
            Portfolio
          </span>
          <span className="block text-base font-semibold text-slate-900 md:text-lg">
            Leonardo Nigro
          </span>
        </button>

        <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
          <button
            className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900"
            onClick={() => scrollToSection("about")}
          >
            About
          </button>
          <button
            className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900"
            onClick={() => scrollToSection("highlights")}
          >
            Projects
          </button>
          <button
            className="rounded-full px-4 py-2 transition hover:bg-slate-100 hover:text-slate-900"
            onClick={() => scrollToSection("contact")}
          >
            Contact
          </button>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
