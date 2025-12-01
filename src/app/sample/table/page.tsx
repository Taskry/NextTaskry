"use client";

import { useState } from "react";
import CommonTable, { TableColumn } from "@/components/ui/Commontable";
import { Button } from "@/components/ui/shadcn/Button";
import Container from "@/components/shared/Container";

// 샘플 데이터 타입 정의
interface User {
  id: number;
  user_name: string;
  email: string;
  role: "admin" | "user" | "guest";
  status: "active" | "inactive";
  created_at: string;
}

export default function Page() {
  // 샘플 데이터
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      user_name: "김철수",
      email: "chulsoo@example.com",
      role: "admin",
      status: "active",
      created_at: "2024-01-15",
    },
    {
      id: 2,
      user_name: "이영희",
      email: "younghee@example.com",
      role: "user",
      status: "active",
      created_at: "2024-02-20",
    },
    {
      id: 3,
      user_name: "박민수",
      email: "minsu@example.com",
      role: "user",
      status: "inactive",
      created_at: "2024-03-10",
    },
    {
      id: 4,
      user_name: "정수진",
      email: "sujin@example.com",
      role: "guest",
      status: "active",
      created_at: "2024-04-05",
    },
  ]);

  // 테이블 컬럼 정의
  const columns: TableColumn<User>[] = [
    {
      label: "ID",
      accessor: "id",
      align: "center",
      className: "w-20",
      hideOnMobile: true,
    },
    {
      label: "사용자명",
      accessor: "user_name",
      align: "left",
      cellClassName: "font-medium",
    },
    {
      label: "이메일",
      accessor: "email",
      align: "left",
      hideOnMobile: true,
    },
    {
      label: "역할",
      accessor: (row) => (
        <div>
          {row.role === "admin"
            ? "관리자"
            : row.role === "user"
            ? "일반"
            : "게스트"}
        </div>
      ),
      align: "center",
      className: "w-28",
    },
    {
      label: "상태",
      accessor: (row) => (
        <span
          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            row.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {row.status === "active" ? "활성" : "비활성"}
        </span>
      ),
      align: "center",
      hideOnMobile: true,
    },
    {
      label: "가입일",
      accessor: "created_at",
      align: "center",
      hideOnMobile: true,
    },
    {
      label: "액션",
      accessor: () => (
        <div className="flex gap-2 justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            상태 변경
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            삭제
          </Button>
        </div>
      ),
      align: "center",
      className: "w-52",
    },
  ];

  return (
    <Container className="container mx-auto py-10 px-4">
      <div className="bg-white rounded-lg shadow">
        <CommonTable
          data={users}
          columns={columns}
          getRowKey={(row) => row.id}
          onRowClick={(row) => {
            console.log("클릭된 사용자:", row);
            alert(`${row.user_name}님의 정보를 확인합니다.`);
          }}
          getRowClassName={(row) =>
            row.status === "inactive" ? "opacity-50" : ""
          }
          emptyMessage="등록된 사용자가 없습니다."
          showHeaderOnMobile={false}
        />
      </div>

      <div className="mt-4 p-4 bg-blue-50 rounded-lg lg:hidden">
        <p className="text-sm text-blue-800">
          💡 일부 컬럼은 화면 크기가 큰 기기에서만 표시됩니다.
        </p>
      </div>
    </Container>
  );
}
