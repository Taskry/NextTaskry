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

interface DialogIconDemoProps {
  title: string;
  description?: string;
  onClick?: () => void;
}

export function DialogIconDemo({ title, description, onClick }: DialogIconDemoProps) {
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
                className="bg-red-100! text-white">확인
              </Button>
            </DialogClose>
              
            
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}
