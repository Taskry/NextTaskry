import { bgColorOpacity } from "@/app/sample/color/page";
import Button from "@/components/ui/Button";
import Container from "@/components/shared/Container";

export default function EmptyNotice() {
  return (
    <Container className="text-center">
      <Button
        btnType="icon"
        icon="speakerphone"
        size={32}
        className={`w-15 h-15 ${bgColorOpacity.colorOpacity[2]}`}
      />
      <p className="text-xl font-bold mt-3">공지사항이 없습니다.</p>
    </Container>
  );
}
