import Button from "@/components/ui/Button";
import { DateSelect } from "./DateSelect";
import { SortSelect } from "./SortSelect";
import { ViewSelect } from "./ViewSelect";
import { cn } from "@/lib/utils/utils";

interface ProjectCardFilterProps {
  filter: any;
  // showFilter: boolean;
  // onToggleFilter: () => void;
  onFilterChange: (key: string, value: string) => void;
}

export default function PorjectCardFilter({
  filter,
  // showFilter,
  // onToggleFilter,
  onFilterChange,
}: ProjectCardFilterProps) {
  const handleSelectChange = (key: string, value: string) => {
    if (onFilterChange) {
      onFilterChange(key, value);
    }
  };
  return (
    <div
      className={cn(
        "flex mb-5 min-h-[70px] ",
        "justify-between"
      )}
    >
    
      <div
        className="
        p-4 mr-4 
        flex justify-start gap-4 md:justify-center flex-wrap 
        border border-border 
        rounded-xl 
        w-full"
      >
        <div className="flex justify-center items-center">
          <div className="mr-2">View Type:</div>
          <div>
            <ViewSelect
              value={filter.view}
              onValueChange={(value) => {
                handleSelectChange("view", value);
              }}
            />
          </div>
        </div>

        <div className="flex justify-center items-center">
          <div className="mr-2">정렬 기준:</div>
          <div>
            <DateSelect
              value={filter.date}
              onValueChange={(value) => {
                handleSelectChange("date", value);
              }}
            />
          </div>
        </div>

        <div className="flex justify-center items-center">
          <div className="mr-2">정렬:</div>
          <div>
            <SortSelect
              value={filter.sort}
              onValueChange={(value) => {
                handleSelectChange("sort", value);
              }}
            />
          </div>
        </div>
      </div>
      
      {/* <div className="flex justify-center items-center">
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
                dark:text-main-200!
                dark:bg-gray-700!
                dark:border-gray-500!
                dark:hover:bg-gray-100/40!"
        />
      </div> */}
    </div>
  );
}
