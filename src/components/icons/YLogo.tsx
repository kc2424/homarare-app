export function YLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-label="Y"
      role="img"
    >
      <path
        d="M4 4H10.5L14 12.5L17.5 4H24L16.5 20V24H11.5V20L4 4Z"
        fill="currentColor"
      />
    </svg>
  );
}
