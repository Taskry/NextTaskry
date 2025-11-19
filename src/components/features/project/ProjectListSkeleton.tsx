{
  /* 프로젝트 목록 폴더에 loading.tsx 생성한 뒤 아래 내용 복붙하면 스켈레톤 적용됩니다
  import ProjectListSkeleton from "../components/Skeleton/ProjectListSkeleton";

  export default function Loading() {
    return <ProjectListSkeleton />;
  }
*/
}
import { SectionHeader } from "../SectionHeader";
import Container from "@/components/shared/Container";

export default function ProjectListSkeleton() {
  return (
    <Container>
      <div className="max-w-7xl mx-auto">
        {/* 헤더 섹션 스켈레톤 */}
        <SectionHeader
          title="내 프로젝트 목록"
          description="프로젝트를 생성하고 관리합니다."
        />

        {/* 프로젝트 카드 그리드 스켈레톤 */}
        <main>
          <section className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((item) => (
              <article
                key={item}
                className="border rounded-2xl p-6 animate-pulse"
              >
                {/* 헤더 */}
                <header>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </header>

                {/* 중간 섹션 */}
                <div className="flex justify-between mt-4 mb-6">
                  <div className="flex gap-1">
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
                    <div className="h-4 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>

                {/* 버튼 영역 */}
                <div className="flex justify-end gap-2">
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                  <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                </div>
              </article>
            ))}
          </section>
        </main>
      </div>
    </Container>
  );
}
