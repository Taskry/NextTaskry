import Button from "@/components/ui/Button";
import { DateSelect } from "./DateSelect";
import { SortSelect } from "./SortSelect";
import { ViewSelect } from "./ViewSelect";
import { cn } from "@/lib/utils/utils";

interface ProjectCardFilterProps {
    filter: any;
    onFilterChange: (key: string, value: string) => void;
    showFilter: boolean;          // 부모로부터 받는 상태
    onToggleFilter: () => void;   // 상태 변경 함수
}

export default function PorjectCardFilter({ filter, 
    onFilterChange,
    showFilter,     // props로 받음
    onToggleFilter  // props로 받음
}: ProjectCardFilterProps) {

    const handleSelectChange = (key:string, value:string) => {
        if (onFilterChange) {
            onFilterChange(key, value);
        }
    };
    // Select 컴포넌트를 위한 handleChange
    return (
    <div className={cn("flex", showFilter ? "justify-between" : "justify-end")}>
        { showFilter &&
        <div className="px-4 mr-4 flex w-full border-gray-100 border-2 rounded-sm">
            <div className="flex justify-center items-center">  
            <div className="mr-2">
                View Type:
            </div>
            <div>
                <ViewSelect value={filter.view} onValueChange={(value) => {
                handleSelectChange("view", value);
                }}/>
            </div>
            </div>
        
            <div className="mx-2 flex justify-center items-center"> | </div>
            <div className="flex justify-center items-center">  
            <div className="mr-2">
                정렬 기준:
            </div>
            <div>
                <DateSelect value={filter.date} onValueChange={(value) => {
                handleSelectChange("date", value);
                }}/>
            </div>
            </div>
            <div className="mx-2 flex justify-center items-center"> | </div>

            <div className="flex justify-center items-center">  
            <div className="mr-2">
                정렬:
            </div>
            <div>
                <SortSelect value={filter.sort} onValueChange={(value) => {
                handleSelectChange("sort", value);
                }}/>
            </div>
            </div>
        </div>
        }
        <div className="flex justify-center items-center">  
            <Button
            btnType="icon"
            icon="filter"
            size={16}
            variant="white"
            onClick={onToggleFilter} 
            className="
                hover:bg-main-100/40 
                hover:border-main-100/40 
                text-main-400 
                dark:text-main-200 
                dark:bg-gray-700
                dark:border-gray-500
                dark:hover:bg-gray-100/40"
            />
        </div>
    </div>
    )
}