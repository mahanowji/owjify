export function OwjifySymbol({ size = 36, darkBg = false }) {
  const frameBg = darkBg ? '#F6F5F0' : '#11120F';
  const peakFill = darkBg ? '#11120F' : '#F6F5F0';

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="48" height="48" rx="13" fill={frameBg} />
      <path
        d="M12.5 33.5L24 11.5L35.5 33.5H29.1L24 23.4L18.9 33.5H12.5Z"
        fill={peakFill}
      />
      <circle cx="24" cy="34.5" r="4.2" fill="#C7F36B" />
      <circle cx="35.5" cy="13.5" r="2.3" fill="#C7F36B" />
    </svg>
  );
}

export const OwjifyMark = OwjifySymbol;
