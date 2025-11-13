interface SectionHeaderProps {
  title?: string;
  description?: string;
}

export function SectionHeader({
  title,
  description,
  ...props
}: SectionHeaderProps) {
  return (
    <header className="mb-7" {...props}>
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
