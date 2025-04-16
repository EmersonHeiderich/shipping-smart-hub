
import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  className?: string;
}

export function FeatureCard({
  title,
  description,
  icon: Icon,
  href,
  className,
}: FeatureCardProps) {
  return (
    <Link
      to={href}
      className={cn(
        "group relative overflow-hidden rounded-lg card-material p-6 transition-all duration-300 card-elevation-1 hover:card-elevation-2",
        className
      )}
    >
      <div className="flex flex-col space-y-2">
        <div className="mb-2 rounded-full w-12 h-12 bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary-500" />
        </div>
        <h3 className="text-xl font-medium">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="mt-4 flex items-center text-sm text-primary-500">
        <span className="font-medium">Acessar</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
