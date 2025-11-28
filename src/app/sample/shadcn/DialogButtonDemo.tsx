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

interface DialogButtonDemoProps {
  title: string;
  description?: string;
  onClick?: () => void;
}

export function DialogButtonDemo({ title, description, onClick }: DialogButtonDemoProps) {
  const [open, setOpen] = useState(false);
 const handleDelete = (e: React.MouseEvent) => {
    // e.preventDefault(); 
    onClick?.();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button
            size={16}
            variant="white"
            className="border-1 border-gray-200"
          >
            일정 삭제 Dialog
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader className="flex justify-self-center">
            <DialogTitle className="text-center">{title}</DialogTitle>
            <DialogDescription className="text-center">
              {description}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-self-center">
            <DialogClose asChild>
              <Button 
                variant="list" 
                className="bg-gray-100!">취소
              </Button>
            </DialogClose>
            <Button 
              variant="list" 
              className="bg-red-100! text-white"
              onClick={handleDelete}
            >
                삭제
            </Button>
              
            
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
