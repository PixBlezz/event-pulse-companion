const Logo = ({ size = 40 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="50" fill="#E8820C" />
    {/* Three raised fingers */}
    <rect x="28" y="18" width="10" height="30" rx="5" fill="#0A0A0A" />
    <rect x="45" y="14" width="10" height="34" rx="5" fill="#0A0A0A" />
    <rect x="62" y="18" width="10" height="30" rx="5" fill="#0A0A0A" />
    {/* Horizontal connecting bar */}
    <rect x="26" y="46" width="48" height="10" rx="5" fill="#0A0A0A" />
    {/* Small circle at bottom */}
    <circle cx="50" cy="70" r="8" fill="#0A0A0A" />
  </svg>
);

export default Logo;
