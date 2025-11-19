import Button from "@/components/ui/Button";
import Link from "next/link";

export default function ProjectCardHeader() {
  return (
    <div className="mx-20 my-10">
      <div className="flex justify-between">
        <div>
          <div className="text-2xl font-bold p-1">내 프로젝트 목록</div>
          <div className="p-1">Taskry에서 프로젝트를 생성하고 관리합니다</div>
        </div>
        <div className="p-1 content-center">
          <Link href={"/project/create"}>
            <Button btnType="form" icon="plus">
              새 프로젝트
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

