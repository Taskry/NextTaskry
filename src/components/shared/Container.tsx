interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export default function Container({
  children,
  className,
  ...props
}: ContainerProps) {
  return (
    <section
      className={`w-full max-w-[1280px] px-5 md:px-10 mx-auto py-25 ${
        className || ""
      }`}
      {...props}
    >
      {children}
    </section>
  );
}
