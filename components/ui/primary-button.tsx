import { ReactNode } from 'react';
import { ArrowRight } from 'lucide-react';

interface PrimaryButtonProps {
  onClick?: () => void;
  text?: string;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  children?: ReactNode;
}

export function PrimaryButton({ onClick, text, className = "", type = "button", disabled = false, children }: PrimaryButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={`relative overflow-hidden group cursor-pointer bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-sans text-xs font-bold uppercase tracking-wider py-3.5 px-8 rounded-full shadow-lg shadow-red-700/20 hover:shadow-red-600/30 transition-all duration-300 flex items-center justify-center gap-2 border border-red-500/30 disabled:scale-95 disabled:opacity-50 hover:scale-105 ${className}`}
    >
      <span className="absolute right-0 w-8 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-40 ease"></span>
      {children ? children : (
        <>
          {text}
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </>
      )}
    </button>
  );
}
