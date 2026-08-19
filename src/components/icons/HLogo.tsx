interface HLogoProps {
  className?: string;
  /** 28 = ヘッダー、64 以上 = 待機画面（03_デザイントークン.md 9章） */
  size?: number;
}

export function HLogo({ className = "", size = 28 }: HLogoProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      aria-label="H"
      role="img"
    >
      <path
        d="M4 4H10V11H18V4H24V24H18V16H10V24H4V4Z"
        fill="currentColor"
      />
    </svg>
  );
}
