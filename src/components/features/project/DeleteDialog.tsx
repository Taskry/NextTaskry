import Button  from "@/components/ui/Button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/shadcn/Dialog"
import React, { useState } from "react";

interface DeleteDialogProps {
  onClick: () => void;
}

export function DeleteDialog({ onClick }: DeleteDialogProps) {
  const [open, setOpen] = useState(false);
 const handleDelete = (e: React.MouseEvent) => {
    // e.preventDefault(); 
    onClick();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button
            btnType="icon"
            icon="trash"
            size={16}
            variant="white"
            className="
              hover:bg-red-100/40 
              hover:border-red-100/40
              text-red-100
              dark:text-red-100/80!
              dark:bg-gray-700!
              dark:border-gray-500!
              dark:hover:bg-gray-100/40!"
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>프로젝트를 삭제하시겠습니까?</DialogTitle>
            <DialogDescription>
              삭제한 프로젝트는 다시 되돌릴 수 없습니다.
              프로젝트 관련 모든 데이터가 삭제됩니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="list" 
              className="hover:bg-main-200/40"
              onClick={handleDelete}
            >
                삭제
            </Button>
              
            <DialogClose asChild>
              <Button 
                variant="list" 
                className="hover:bg-main-200/40">취소
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
