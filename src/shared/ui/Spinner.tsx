export function Spinner({ className = "h-5 w-5" }: { className?: string }) {
  return <div className={`animate-spin rounded-full border-2 border-brand-600 border-t-transparent ${className}`} />;
}
