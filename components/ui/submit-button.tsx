export function SubmitButton({ children, className }: { children: string; className?: string }) {
  return (
    <button
      type="submit"
      className={className ?? "rounded-xl bg-grind-red px-4 py-2 text-sm font-semibold text-white hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"}
    >
      {children}
    </button>
  );
}
