type Props = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant = "primary",
  ...props
}: Props) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 mx-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";

  const styles = {
    primary:
      "bg-black text-white hover:bg-neutral-800 focus:ring-black",
    secondary:
      "border border-neutral-300 bg-white hover:bg-neutral-50 focus:ring-neutral-400",
    danger:
      "text-red-600 hover:bg-red-50 focus:ring-red-500",
  };

  return (
    <button className={`${base} ${styles[variant]}`} {...props}>
      {children}
    </button>
  );
}
