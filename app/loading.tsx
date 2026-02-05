export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#181411]">
      <div className="relative flex flex-col items-center gap-4">
        {/* Modern Spinner */}
        <div className="relative size-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#2a2419]"></div>
          <div className="absolute inset-0 rounded-full border-4 border-t-[#f4af25] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          
          {/* Inner Pulse */}
          <div className="absolute inset-0 m-auto size-2 rounded-full bg-[#f4af25] animate-pulse"></div>
        </div>
        
        {/* Text */}
        <div className="text-[#f4af25] text-sm font-medium tracking-[0.2em] animate-pulse">
          LOADING
        </div>
      </div>
    </div>
  );
}
