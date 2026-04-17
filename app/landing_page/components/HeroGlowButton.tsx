"use client";

import { MouseEvent } from "react";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "./ui/button";

type HeroGlowButtonProps = {
  href: string;
  label: string;
};

export const HeroGlowButton = ({ href, label }: HeroGlowButtonProps) => {
  const handleGlowMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const button = event.currentTarget;
    const bounds = button.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;

    button.style.setProperty("--hero-button-glow-x", `${x}px`);
    button.style.setProperty("--hero-button-glow-y", `${y}px`);
  };

  const handleGlowEnter = (event: MouseEvent<HTMLAnchorElement>) => {
    event.currentTarget.classList.add("hero-button-glow-active");
  };

  const handleGlowLeave = (event: MouseEvent<HTMLAnchorElement>) => {
    const button = event.currentTarget;
    button.classList.remove("hero-button-glow-active");
    button.style.removeProperty("--hero-button-glow-x");
    button.style.removeProperty("--hero-button-glow-y");
  };

  return (
    <a
      rel="noreferrer noopener"
      href={href}
      onMouseMove={handleGlowMove}
      onMouseEnter={handleGlowEnter}
      onMouseLeave={handleGlowLeave}
      className={`hero-button-glow ${buttonVariants({ variant: "outline" })}`}
    >
      {label}
      <ArrowRight className="ml-2 w-4 h-4" />
    </a>
  );
};
