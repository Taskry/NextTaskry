interface ContainerProps {
  children: React.ReactNode;
}

export default function Container({ children, ...props }: ContainerProps) {
  return (
    <section className="max-w-[1010px] mx-auto px-8 py-15" {...props}>
      {children}
    </section>
  );
}
