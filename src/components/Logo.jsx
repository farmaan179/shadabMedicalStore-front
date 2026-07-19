export default function Logo({ size = 44 }) {
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-sm">
        <circle cx="32" cy="32" r="30" fill="#0B5351" />
        <path d="M32 12C22 16 18 26 22 36C26 46 32 50 32 50C32 50 38 46 42 36C46 26 42 16 32 12Z" fill="#8FC1B5" />
        <path d="M32 14V48" stroke="#0B5351" strokeWidth="1.5" opacity="0.5" />
        <rect x="28.5" y="24" width="7" height="18" rx="1.5" fill="#F2A65A" />
        <rect x="23" y="29.5" width="18" height="7" rx="1.5" fill="#F2A65A" />
      </svg>
      <span className="font-display font-semibold text-lg leading-tight text-teal-DEEP">
        Shadab
        <span className="block text-[10px] tracking-[0.25em] font-body font-medium text-amber-dark uppercase">
          Medical Store
        </span>
      </span>
    </div>
  );
}