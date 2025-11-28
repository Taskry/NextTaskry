import Button from "@/components/ui/Button";

export default function ProjectBoardEmpty() {
  return (
    <div className="items-center justify-center pt-40">
      <div className="flex items-center justify-center">
        <Button btnType="icon" icon="board" size={18}></Button>
      </div>

      <div className="flex items-center justify-center font-bold text-lg py-1">
        프로젝트 없음
      </div>
      <div className="flex items-center justify-center py-1">
        나만의 첫 프로젝트를 만들어 시작합니다.
      </div>
    </div>
  );
}
