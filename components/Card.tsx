export default function Card({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-300 bg-neutral-100 p-6 shadow-sm transition-shadow hover:shadow-md">
      {children}
    </div>
  );
}
