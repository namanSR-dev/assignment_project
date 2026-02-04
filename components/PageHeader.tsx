export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-8 space-y-1">
      <h1 className="text-3xl font-bold tracking-tight">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-neutral-600">{subtitle}</p>
      )}
    </div>
  );
}
