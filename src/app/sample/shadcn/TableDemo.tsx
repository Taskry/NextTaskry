import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/Table"
import { DialogIconDemo } from "./DialogIconDemo"
import { SelectDemo } from "./SelectDemo"
import { useState } from "react"

const sampleData = [
  {
    name: "Name1",
    email: "email1@domain.com",
    role: "leader",
    project: "프로젝트1",
  },
  {
    name: "Name2",
    email: "email2@domain.com",
    role: "member",
    project: "프로젝트1",
  },
  {
    name: "Name3",
    email: "email3@domain.com",
    role: "member",
    project: "프로젝트1",
  },
  {
    name: "Name4",
    email: "email4@domain.com",
    role: "member",
    project: "프로젝트2",
  },
  {
    name: "Name5",
    email: "email5@domain.com",
    role: "member",
    project: "프로젝트2",
  },
]

export function TableDemo() {
  const [selectData, setSelectData] = useState("leader");
  const handleSelectChange = (value:string) => {
    setSelectData(value)
  }
  return (
    <div className="w-full max-w-3xl mx-auto">
      <Table>        
        {/* 테이블 헤더 */}
        <TableHeader className="bg-main-300 ">
          <TableRow>
            <TableHead className="w-[100px] text-center text-white">이름</TableHead>
            <TableHead className="text-center text-white">이메일</TableHead>
            <TableHead className="text-center text-white">권한</TableHead>
            <TableHead className="text-center text-white">프로젝트</TableHead>
            <TableHead className="text-center text-white">관리</TableHead>
          </TableRow>
        </TableHeader>

        {/* 테이블 바디 (데이터 매핑) */}
        <TableBody>
          {sampleData.map((data,index) => (
            <TableRow key={index}>
              <TableCell className="text-center">{data.name}</TableCell>
              <TableCell className="text-center">{data.email}</TableCell>
              <TableCell className="text-center">
                <SelectDemo 
                  value={selectData}
                  onValueChange={(value) =>
                  handleSelectChange(value)
                }/>
              </TableCell>
              <TableCell className="text-center">{data.project}</TableCell>
              <TableCell className="text-center">
                <DialogIconDemo 
                    title={`${data.name} 유저를 삭제하시겠습니까?`} 
                  />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}