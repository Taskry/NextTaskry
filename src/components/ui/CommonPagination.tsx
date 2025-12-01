"use client";

import { Icon } from "@/components/shared/Icon";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/shadcn/Pagination";
import { cn } from "@/lib/utils/utils";

interface CommonPaginationProps {
  // 현재 페이지
  currentPage: number;

  // 전체 페이지 수
  totalPages: number;

  // 페이지 변경 시 실행될 함수
  onPageChange: (page: number) => void;

  // 페이지를 그룹으로 보여줄지 여부를 설정합니다.
  // 1) pageGroupSize = false 인 경우, 모든 페이지 번호를 다 보여줍니다.
  //    예: [< 1 2 3 4 5 6 7 8 9 10 >]
  // 2) pageGroupSize = 숫자 인 경우, 페이지를 그룹으로 묶어서 보여줍니다.
  //    예를 들어, pageGroupSize={5} 라고 설정하면,
  //    1~5페이지 → [< 1 2 3 4 5 >]
  //    6~10페이지 → [< 6 7 8 9 10 >]
  pageGroupSize?: number | false;

  // 이전, 다음 버튼 스타일입니다.
  buttonStyle?: "arrow";
  className?: string;
}

interface PageRangeInfo {
  startPage: number;
  endPage: number;
  hasPrevGroup: boolean;
  hasNextGroup: boolean;
  prevGroupPage: number | null;
  nextGroupPage: number | null;
}

export default function CommonPagination({
  currentPage,
  totalPages,
  onPageChange,
  pageGroupSize = false,
  buttonStyle = "arrow",
  className,
}: CommonPaginationProps) {
  // 페이지가 없으면 아무것도 렌더링하지 않습니다.
  if (totalPages === 0) return null;

  // 현재 보여줄 페이지 범위를 계산합니다.
  // 기본: 1부터 totalPages까지
  // 그룹: 현재 페이지가 속한 그룹의 시작/끝 계산
  const getPageRange = (): PageRangeInfo => {
    // false의 경우 모든 페이지 번호를 한 번에 다 보여줍니다.
    if (pageGroupSize === false) {
      return {
        startPage: 1, // 항상 1부터 표시
        endPage: totalPages, // 마지막 페이지까지
        hasPrevGroup: false, // 이전 그룹 없음
        hasNextGroup: false, // 다음 그룹 없음
        prevGroupPage: null, // 기본 모드에서는 사용되지 않음
        nextGroupPage: null, // 기본 모드에서는 사용되지 않음
      };
    }

    // 현재 페이지가 몇 번째 그룹에 속하는지 계산
    // -1을 하는 건 그룹 인덱스는 0부터 시작하기 때문
    const currentGroup = Math.floor((currentPage - 1) / pageGroupSize);

    // 그룹의 시작 페이지 계산
    const startPage = currentGroup * pageGroupSize + 1;

    // 그룹의 끝 페이지 계산(전체 페이지 수를 넘지 않도록)
    const endPage = Math.min(startPage + pageGroupSize - 1, totalPages);

    return {
      // 현재 그룹의 첫 페이지
      startPage,
      // 현재 그룹의 마지막 페이지
      endPage,
      // 이전 그룹이 존재하는지(startPage = 4일 경우, 이전 그룹 [1,2,3] 존재)
      hasPrevGroup: startPage > 1,
      // 다음 그룹이 존재하는지
      // endPage = 3, totalPages = 20일 경우 다음 그룹 존재 (true)
      // endPage = 20, totalPages = 20일 경우 다음 그룹 존재X (false)
      hasNextGroup: endPage < totalPages,
      // 이전 버튼을 눌렀을 때 이동할 페이지 번호
      prevGroupPage: startPage - 1,
      // 다음 버튼을 눌렀을 때 이동할 페이지 번호
      nextGroupPage: endPage + 1,
    };
  };

  const {
    startPage,
    endPage,
    hasPrevGroup,
    hasNextGroup,
    prevGroupPage,
    nextGroupPage,
  } = getPageRange();

  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  // -------------------- 이전, 다음 버튼 핸들러
  const handlePrevClick = (e: React.MouseEvent) => {
    // 첫 페이지면 동작하지 않음
    if (isFirstPage) {
      e.preventDefault();
      return;
    }

    // 기본 모드: 한 페이지씩
    if (pageGroupSize === false) {
      onPageChange(currentPage - 1);
      return;
    }

    // 그룹 모드
    // 1) 현재 페이지가 현재 그룹의 첫 번째 페이지에 있고
    // 2) 현재 그룹보다 이전 그룹이 존재할 경우
    // -> 이전 버튼을 누르면 이전 그룹으로 점프
    if (currentPage === startPage && hasPrevGroup && prevGroupPage !== null) {
      onPageChange(prevGroupPage);
    } else {
      // 그룹 내 이동 -> 한 페이지씩
      onPageChange(currentPage - 1);
    }
  };

  const handleNextClick = (e: React.MouseEvent) => {
    // 마지막 페이지면 동작하지 않음
    if (isLastPage) {
      e.preventDefault();
      return;
    }

    // 기본 모드: 한 페이지씩
    if (pageGroupSize === false) {
      onPageChange(currentPage + 1);
      return;
    }

    // 그룹 모드
    // 1) 현재 페이지가 현재 그룹의 마지막 페이지에 있고
    // 2) 다음 그룹이 존재할 경우
    // -> 다음 버튼을 누르면 다음 그룹으로 점프
    if (currentPage === endPage && hasNextGroup && nextGroupPage !== null) {
      // 현재 그룹의 마지막 페이지 → 다음 그룹의 첫 페이지로
      onPageChange(nextGroupPage);
    } else {
      // 그룹 내 이동 -> 한 페이지씩
      onPageChange(currentPage + 1);
    }
  };
  // -------------------- END 이전, 다음 버튼 핸들러

  // -------------------- 버튼 렌더링
  const renderPrevButton = () => {
    if (buttonStyle === "arrow") {
      return (
        <PaginationPrevious
          className={cn(
            "px-2 py-2 border border-border rounded cursor-pointer",
            isFirstPage && "opacity-40 pointer-events-none cursor-not-allowed"
          )}
          onClick={handlePrevClick}
          aria-disabled={isFirstPage}
        >
          <Icon type="arrowDown" className="rotate-90" size={17} />
        </PaginationPrevious>
      );
    }

    return (
      <PaginationPrevious
        onClick={handlePrevClick}
        className={cn(
          "cursor-pointer cursor-target",
          isFirstPage && "opacity-40 pointer-events-none cursor-not-allowed"
        )}
        aria-disabled={isFirstPage}
      />
    );
  };

  const renderNextButton = () => {
    if (buttonStyle === "arrow") {
      return (
        <PaginationNext
          className={cn(
            "px-2 py-2 border border-border rounded cursor-pointer",
            isLastPage && "opacity-40 pointer-events-none cursor-not-allowed"
          )}
          onClick={handleNextClick}
          aria-disabled={isLastPage}
        >
          <Icon type="arrowDown" className="rotate-270" size={16} />
        </PaginationNext>
      );
    }

    return (
      <PaginationNext
        onClick={handleNextClick}
        className={cn(
          "cursor-pointer cursor-target",
          isLastPage && "opacity-40 pointer-events-none cursor-not-allowed"
        )}
        aria-disabled={isLastPage}
      />
    );
  };
  // -------------------- END 버튼 렌더링

  return (
    <Pagination className={cn("mx-auto mt-10", className)}>
      <PaginationContent>
        {/* 이전 버튼 */}
        <PaginationItem>{renderPrevButton()}</PaginationItem>

        {/* 
          페이지 번호
          
          1. Array.from으로 필요한 개수만큼 배열을 생성 후,
          2. 각 인덱스를 실제 페이지 번호로 변환합니다.
          3. isActive로 현재 페이지임을 강조하고,
          4. 클릭 시 onPageChange 함수를 호출합니다.
        */}
        {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
          const page = startPage + i;
          return (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => onPageChange(page)}
                isActive={page === currentPage}
                className="cursor-pointer cursor-target"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* 다음 버튼 */}
        <PaginationItem>{renderNextButton()}</PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
