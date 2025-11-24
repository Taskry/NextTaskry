import { Icon } from "@/components/shared/Icon"

interface ProjectProps {
  projectName: string;
  type: string;
  status: string;
  startedAt: Date | undefined;
  endedAt: Date | undefined;
  createdAt: Date | undefined;
  updatedAt: Date | undefined;
  techStack: string;
  description: string;
}

export default function ProjectDateCard({projectData}:{projectData: ProjectProps}) {
  return (
    <div>
        <div className="flex py-2 grid grid-cols-2 gap-5">
          <div className="flex items-center rounded-md border-2 hover:border-blue-100/50 p-5">
            <div className="w-10 h-10 mr-4 rounded-full bg-blue-100/40 flex items-center justify-center">
              <Icon
                type="calendarShare"
                size={20}
                className="text-blue-100"
              />
            </div>
            <div>
              <div className="font-bold">시작일</div>
              <div>
                  {projectData?.startedAt 
                    ? new Date(projectData.startedAt).toLocaleDateString() 
                    : '-'}
              </div>
            </div>
          </div>
          <div className="flex items-center rounded-md border-2 hover:border-red-100/50 p-5">
            <div className="w-10 h-10 mr-4 rounded-full bg-red-100/40 flex items-center justify-center">
              <Icon
                type="calendarCheck"
                size={20}
                className="text-red-100"
              />
            </div>
            <div>
              <div className="font-bold">마감일</div>
              <div>
                  {projectData?.endedAt 
                    ? new Date(projectData.endedAt).toLocaleDateString() 
                    : '-'}
              </div>
            </div>
          </div>
        </div>
        <div className="flex py-2 grid grid-cols-2 gap-5">
          <div className="flex items-center rounded-md border-2 hover:border-green-100/50 p-5">
            <div className="w-10 h-10 mr-4 rounded-full bg-green-100/40 flex items-center justify-center">
              <Icon
                type="calendarPlus"
                size={20}
                className="text-green-100"
              />
            </div>
            <div>
              <div className="font-bold">생성일</div>
              <div>
                 {projectData?.createdAt 
                    ? new Date(projectData.createdAt).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'numeric', // or '2-digit'
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                        }) 
                    : '-'}
              </div>
            </div>
          </div>
          <div className="flex items-center rounded-md border-2 hover:border-yellow-100/50 p-5">
            <div className="w-10 h-10 mr-4 rounded-full bg-yellow-100/40 flex items-center justify-center">
              <Icon
                type="calendarStar"
                size={20}
                className="text-yellow-100"
              />
            </div>
            <div>
              <div className="font-bold">최종 수정일</div>
              <div>
                  {projectData?.updatedAt 
                    ? new Date(projectData.updatedAt).toLocaleString('ko-KR', {
                        year: 'numeric',
                        month: 'numeric', // or '2-digit'
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                        }) 
                    : '-'}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}
