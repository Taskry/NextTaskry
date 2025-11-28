"use client";

import { useState } from "react";
import PaginationDemo from "./PaginationDemo";
import { TableDemo } from "./TableDemo";
import { DialogButtonDemo } from "./DialogButtonDemo";
import { DialogIconDemo } from "./DialogIconDemo";
import { SkeletonDemo } from "./SkeletonDemo";
import { SkeletonCardDemo } from "./SkeletonCardDemo";


export default function Page() {
    const [currnetPage, setCurrnetPage] = useState(1);

    const handlePageChange = (newPage: number) => {
        setCurrnetPage(newPage);
    };
    async function handleDialogEvent() {
        console.log("event 발생")
      }
    return (
        <div className="mt-20">
            <div className="mt-6">
                <TableDemo />
            </div>
            <div className="mt-6">
                <PaginationDemo currentPage={currnetPage} totalPage={20} onPageChange={handlePageChange} />
            </div>
            <div className="mt-6 flex justify-center items-center gap-4">
                <DialogButtonDemo
                    title="이 일정을 삭제하시겠습니까?" 
                    description="모든 하위 할 일이 사라집니다"
                    onClick={() => handleDialogEvent()}
                />
                <DialogIconDemo
                    title="성공" 
                    description="작업이 완료되었습니다."
                />
            </div>
            <div className="mt-6 flex justify-center items-center gap-4">
                <div className="p-4 border-2 rounded-lg border-gray-100">
                    <SkeletonDemo />    
                </div>
                <div className="p-4 border-2 rounded-lg border-gray-100">
                    <SkeletonCardDemo />
                </div>
                
            </div>
        </div>
    );
}
