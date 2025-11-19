import DropdownToggle from "@/app/components/Dropdown/DropdownToggle";
import Container from "@/app/components/UI/Container";

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
