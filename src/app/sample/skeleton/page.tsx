import Container from "@/components/shared/Container";
import { ProjectCardSkeleton } from "@/components/ui/ProjectCardSkeleton";
import { UserTableSkeleton } from "@/components/ui/UserTableSkeleton";

export default function Page() {
  return (
    <Container>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">프로젝트 카드용</h1>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </div>
      <div className="mb-8 w-3xl ">
        <h1 className="text-2xl font-bold mb-4">
          관리자 대시보드 - 유저 관리용
        </h1>
        <div>
          {Array.from({ length: 6 }).map((_, i) => (
            <UserTableSkeleton key={i} />
          ))}
        </div>
      </div>
    </Container>
  );
}
