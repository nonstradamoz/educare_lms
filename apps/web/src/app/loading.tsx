import Image from "next/image";
import logo2 from "@/logos/logo2.png";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-brand-blue backdrop-blur-md">
      <div className="relative flex flex-col items-center">
        
        {/* Decorative spinning rings behind the logo */}
        <div className="absolute inset-0 -m-8 rounded-full border-[4px] border-transparent border-t-white/30 border-b-white/30 animate-[spin_3s_linear_infinite]" />
        <div className="absolute inset-0 -m-12 rounded-full border-[2px] border-transparent border-l-brand-red/50 border-r-brand-red/50 animate-[spin_4s_linear_infinite_reverse]" />
        <div className="absolute inset-0 -m-4 rounded-full bg-white/5 animate-pulse" />

        {/* The Logo Container */}
        <div className="relative z-10 w-32 h-32 md:w-48 md:h-48 bg-white rounded-full shadow-[0_0_40px_rgba(255,255,255,0.15)] overflow-hidden flex items-center justify-center">
          <Image
            src={logo2}
            alt="Educare LMS Loading"
            fill
            className="object-contain scale-[1.3] animate-pulse"
            priority
          />
        </div>
        
        {/* Loading indicator below */}
        <div className="mt-16 flex flex-col items-center space-y-4">
          <div className="flex space-x-3">
            <div className="w-2.5 h-2.5 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2.5 h-2.5 bg-brand-red rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <p className="text-sm font-medium tracking-[0.2em] text-white/60 uppercase">
            Loading Application
          </p>
        </div>

      </div>
    </div>
  );
}
