import React from "react";
import { Github, Linkedin, Mail, FileText } from "lucide-react";

const links = [
  {
    href: "https://github.com/Leosly7663",
    label: "GitHub",
    icon: Github,
  },
  {
    href: "https://www.linkedin.com/in/leonardo-nigro-948513199/",
    label: "LinkedIn",
    icon: Linkedin,
  },
  {
    href: "/LeonardoNigroResume.pdf",
    label: "Resume",
    icon: FileText,
  },
  {
    href: "mailto:Contact@leonardonigro.com",
    label: "Email",
    icon: Mail,
  },
];

const Footer = () => {
  return (
    <footer className="mx-auto max-w-6xl px-6 pb-14 pt-8">
      <div className="rounded-[2rem] border border-white/70 bg-white/85 px-6 py-8 shadow-[0_30px_80px_rgba(15,23,42,0.09)] backdrop-blur">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-700">
              Contact
            </p>
            <h2 className="mt-3 font-oswald text-3xl text-slate-900 md:text-4xl">
              Let&apos;s keep the conversation going.
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              If something here resonates, I&apos;d love to chat about projects,
              design, opportunities, or just the next ski season.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            {links.map((link) => {
              const Icon = link.icon;

              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    link.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:text-slate-900"
                >
                  <Icon size={16} />
                  {link.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
