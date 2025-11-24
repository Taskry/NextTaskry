interface ContainerProps {
  children: React.ReactNode;
}

export default function Container({ children, ...props }: ContainerProps) {
  return (
    <section className="px-5 lg:px-8 max-w-[1010px] mx-auto py-15" {...props}>
      {children}
    </section>
  );
}
