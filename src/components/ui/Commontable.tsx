"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/shadcn/Table";
import { ReactNode } from "react";

// ------------------------------ 각 테이블 컬럼 설정을 정의합니다.
export interface TableColumn<T> {
  // 헤더에 보이는 텍스트
  label: string;
  // 핵심 부분입니다.
  // 1) accessor: 'user_name'으로 설정하면 user_name 그대로 표시돕니다.
  // 2) accessor: (row) => (
  //  <Button onClick={() => delete(row.id)}>삭제</Button>
  // )
  // 이런 식으로 작성하면 JSX를 반환합니다.
  accessor: keyof T | ((row: T) => ReactNode);
  // 컬럼 전체 너비 등
  className?: string;
  // 헤더만의 스타일 정의
  headerClassName?: string;
  // 셀만의 스타일 정의
  cellClassName?: string;
  // 정렬 스타일 정의
  align?: "left" | "center" | "right";
  // 모바일에서 숨김 여부
  hideOnMobile?: boolean;
}

// ------------------------------ 테이블 컴포넌트 전체의 props를 정의합니다.
export interface CommonTableProps<T> {
  // 표시할 데이터 배열
  data: T[];
  // 컬럼 설정 배열
  columns: TableColumn<T>[];
  // 고유 key
  getRowKey: (row: T, index: number) => string | number;
  // 행 클릭 시
  onRowClick?: (row: T) => void;
  // 조건부 스타일 정의
  getRowClassName?: (row: T) => string;
  // 빈 데이터 메시지
  emptyMessage?: string;
  // 테이블 래퍼 클래스
  className?: string;
  // 모바일 헤더 표시 여부
  showHeaderOnMobile?: boolean;
}

export default function CommonTable<T>({
  data,
  columns,
  getRowKey,
  onRowClick,
  getRowClassName,
  emptyMessage = "데이터가 없습니다.",
  className = "",
  showHeaderOnMobile = false,
}: CommonTableProps<T>) {
  // -------------------------------------------
  // 함수로 작성하면 실행해서 그 결과를 반환하고, 키면 그 값을 반환합니다.
  // 예를 들어,
  // 1) accessor가 "user_name"이면
  //    getCellValue(user, "user_name") → user.user_name 반환
  // 2) accessor가 함수면
  //    getCellValue(user, (u) => <span>{u.name}</span>)
  //    → <span>...</span> 반환
  // -------------------------------------------
  const getCellValue = (row: T, accessor: TableColumn<T>["accessor"]) => {
    if (typeof accessor === "function") {
      return accessor(row);
    }
    return row[accessor] as ReactNode;
  };

  // 텍스트 정렬을 위한 Tailwind 클래스를 반환합니다.
  const getAlignClass = (align?: "left" | "center" | "right") => {
    switch (align) {
      case "left":
        return "text-left";
      case "right":
        return "text-right";
      case "center":
      default:
        return "text-center";
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <Table>
        {/* showHeaderOnMobile={false} 이면 모바일에서 헤더를 숨깁니다. */}
        <TableHeader
          className={showHeaderOnMobile ? "" : "hidden lg:table-header-group"}
        >
          <TableRow>
            {columns.map((column, index) => (
              // hideOnMobile={true} → 특정 컬럼만 모바일에서 숨깁니다.
              <TableHead
                key={index}
                className={`text-base py-3 
                  ${column.className || ""}
                  ${column.headerClassName || ""}
                  ${getAlignClass(column.align)}
                  ${column.hideOnMobile ? "hidden lg:table-cell" : ""}
                `}
              >
                {column.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {/* 데이터가 없으면 전체 너비로 메시지를 표시합니다. */}
          {data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-muted-foreground"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, rowIndex) => (
              <TableRow
                // getRowKey: 각 행의 고유 key를 생성합니다
                // onRowClick: 행 클릭 시 해당 데이터를 콜백으로 전달합니다
                // getRowClassName: 조건부로 행 스타일을 변경합니다
                key={getRowKey(row, rowIndex)}
                onClick={() => onRowClick?.(row)}
                className={`
                  ${onRowClick ? "cursor-pointer" : ""}
                  ${getRowClassName ? getRowClassName(row) : ""}
                `}
              >
                {columns.map((column, colIndex) => (
                  <TableCell
                    key={colIndex}
                    className={`py-4
                      ${column.className || ""}
                      ${column.cellClassName || ""}
                      ${getAlignClass(column.align)}
                      ${column.hideOnMobile ? "hidden lg:table-cell" : ""}
                    `}
                  >
                    {getCellValue(row, column.accessor)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
