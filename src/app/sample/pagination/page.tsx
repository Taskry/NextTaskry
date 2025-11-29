"use client";

import { useState } from "react";
import CommonPagination from "@/components/ui/CommonPagination";
import Container from "@/components/shared/Container";

export default function PaginationSample() {
  const [page1, setPage1] = useState(1);
  const [page2, setPage2] = useState(5);

  return (
    <Container className="max-w-4xl mx-auto p-8 space-y-12">
      <h1 className="text-3xl font-bold mb-8">페이지네이션 샘플</h1>

      {/* 케이스 1: 기본 모드 */}
      <section className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">
          1. 기본 모드 (모든 페이지 표시)
          <br />
        </h2>
        <p className="text-gray-600 mb-4">
          - pageGroupSize를 설정하지 않거나 false로 설정
          <br /> - 모든 페이지(1~10)가 다 보이고, 이전/다음 버튼으로 한 페이지씩
          이동
        </p>
        <div className="bg-gray-50 p-4 rounded mb-4">
          <code className="text-sm">
            {`<CommonPagination
              currentPage={${page1}}
              totalPages={10}
              onPageChange={setPage}
            />`}
          </code>
        </div>
        <CommonPagination
          currentPage={page1}
          totalPages={10}
          onPageChange={setPage1}
          buttonStyle="arrow"
        />
      </section>

      {/* 케이스 2: 그룹 모드 */}
      <section className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-2">2. 그룹 모드</h2>
        <p className="text-gray-600 mb-4">
          - pageGroupSize=3으로 설정, 그룹 경계에서 이동
          <br />- 3개씩 그룹으로 묶여서 표시됨 (예: [1 2 3], [4 5 6], [7 8
          9]...)
        </p>
        <div className="bg-gray-50 p-4 rounded mb-4">
          <code className="text-sm">
            {`<CommonPagination
              currentPage={${page2}}
              totalPages={20}
              onPageChange={setPage}
              pageGroupSize={3}
              buttonStyle="arrow"
            />`}
          </code>
        </div>
        <CommonPagination
          currentPage={page2}
          totalPages={20}
          onPageChange={setPage2}
          pageGroupSize={3}
        />
      </section>
    </Container>
  );
}
