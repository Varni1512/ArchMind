import React from "react";
import { LogoIcon } from "../icons/LogoIcon";

export function Header() {
  return (
    <header className="sticky top-0 z-[100] bg-[#ECE5C7]/82 backdrop-blur-[14px] backdrop-saturate-150 border-b border-[#354259]/10">
      <nav className="flex items-center justify-between py-4 px-8 max-w-7xl mx-auto">
        <a href="#top" className="flex items-center gap-[9px] font-heading font-extrabold text-[19px] text-primary focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary focus-visible:rounded-md">
          <LogoIcon />
          ArchMind
        </a>
        <div className="hidden min-[900px]:flex items-center gap-[34px] text-[14.5px] font-medium text-primary">
          <a href="#learn" className="relative opacity-[0.82] transition-opacity duration-200 hover:opacity-100 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[6px] after:h-[2px] after:bg-primary after:scale-x-0 after:origin-left after:transition-transform after:duration-250 hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary focus-visible:rounded-md">Learn</a>
          <a href="#practice" className="relative opacity-[0.82] transition-opacity duration-200 hover:opacity-100 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[6px] after:h-[2px] after:bg-primary after:scale-x-0 after:origin-left after:transition-transform after:duration-250 hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary focus-visible:rounded-md">Practice</a>
          <a href="#design" className="relative opacity-[0.82] transition-opacity duration-200 hover:opacity-100 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[6px] after:h-[2px] after:bg-primary after:scale-x-0 after:origin-left after:transition-transform after:duration-250 hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary focus-visible:rounded-md">Design</a>
          <a href="#interview" className="relative opacity-[0.82] transition-opacity duration-200 hover:opacity-100 after:content-[''] after:absolute after:left-0 after:right-0 after:-bottom-[6px] after:h-[2px] after:bg-primary after:scale-x-0 after:origin-left after:transition-transform after:duration-250 hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary focus-visible:rounded-md">Interview</a>
        </div>
        <div className="flex items-center gap-[18px]">
          <a
            href="#"
            className="inline-flex items-center justify-center gap-2 font-heading font-semibold whitespace-nowrap transition-all duration-250 ease-[cubic-bezier(.2,.8,.2,1)] border-[1.5px] border-transparent text-surface bg-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_10px_24px_-10px_rgba(53,66,89,0.55)] hover:-translate-y-[2px] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_16px_30px_-10px_rgba(53,66,89,0.6)] px-[18px] py-[10px] text-[13.5px] rounded-[10px] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-primary"
          >
            Log in
          </a>
        </div>
      </nav>
    </header>
  );
}
