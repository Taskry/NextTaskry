interface SectionHeaderProps {
  title?: string;
  description?: string;
  className?: string;
}

export function SectionHeader({
  title,
  description,
  className,
  ...props
}: SectionHeaderProps) {
  const allClasses = `mb-7 ${className}`;

  return (
    <header className={allClasses}>
      <h2 className="text-xl font-black mb-2">{title}</h2>
      {description && (
        <p
          className="text-base font-medium"
          dangerouslySetInnerHTML={{ __html: description }}
        ></p>
      )}
    </header>
  );
}
