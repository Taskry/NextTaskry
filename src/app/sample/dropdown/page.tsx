import DropdownToggle from "@/components/ui/Dropdown";
import Container from "@/components/shared/Container";

export default function Page() {
  return (
    <Container>
      <div className="flex gap-2">
        <DropdownToggle type="view" currentValue="view" />
        <DropdownToggle type="theme" currentValue="theme" />
      </div>
    </Container>
  );
}
