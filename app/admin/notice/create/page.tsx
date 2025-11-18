"use client";
import { SectionHeader } from "@/app/components/SectionHeader";
import Checkbox from "@/app/components/UI/Checkbox";
import Container from "@/app/components/UI/Container";
import { useEffect, useState } from "react";

export default function Page() {
  // 폼 상태 관리
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isImportant: false,
  });

  useEffect(() => {
    document.body.classList.remove("overflow-hidden");
    document.body.classList.remove("h-full");

    return () => {
      document.body.classList.add("overflow-hidden");
      document.body.classList.add("h-full");
    };
  }, []);

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("제출 데이터:", formData);
    // TODO: API 호출 로직
  };

  // 취소 핸들러
  const handleCancel = () => {
    if (confirm("작성 중인 내용이 있습니다. 정말 취소하시겠습니까?")) {
      setFormData({
        title: "",
        content: "",
        isImportant: false,
      });
      // TODO: 이전 페이지로 이동 또는 목록으로 이동
    }
  };

  return (
    <Container>
      {/* 1. 페이지 제목 및 설명 */}
      <SectionHeader
        title="공지사항 작성"
        description="새로운 공지사항을 작성하고 관리합니다."
        className="mb-10"
      />

      {/* 2. 작성 폼 영역 (시맨틱 구조의 핵심) */}
      <form
        onSubmit={handleSubmit}
        className="space-y-10 bg-[#FAFAFA] p-7 rounded-xl"
      >
        {/* 2-1. 기본 정보 필드셋 */}
        <fieldset className="p-6 border border-gray-100 rounded-xl space-y-6 bg-white shadow-lg">
          <legend className="text-lg font-bold text-gray-800 px-2 mb-0">
            기본 정보
          </legend>

          {/* 제목 입력 필드 */}
          <div className="flex flex-col space-y-2">
            <label
              htmlFor="notice-title"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              제목
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="notice-title"
              type="text"
              placeholder="공지사항 제목을 입력하세요."
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 transition duration-150"
            />
          </div>

          {/* 중요 공지 체크박스 */}
          <div className="flex items-center">
            <Checkbox
              checked={formData.isImportant}
              onChange={(checked) =>
                setFormData({ ...formData, isImportant: checked })
              }
              label="중요 공지로 설정 (상단에 고정됩니다.)"
            />
          </div>
        </fieldset>

        {/* 2-2. 내용 작성 필드셋 */}
        <fieldset className="p-6 border border-gray-100 rounded-xl space-y-6 bg-white shadow-lg">
          <legend className="text-lg font-bold text-gray-800 px-2 mb-0">
            내용 작성
          </legend>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="notice-content"
              className="text-sm font-medium text-gray-700 flex items-center"
            >
              내용
              <span className="text-red-500 ml-1" aria-hidden="true">
                *
              </span>
            </label>
            {/* 실제로는 여기에 리치 텍스트 에디터 컴포넌트가 들어갑니다. */}
            <textarea
              id="notice-content"
              placeholder="공지사항 내용을 입력하세요."
              required
              rows={15}
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 resize-y transition duration-150"
            />
            {/* <div>... 리치 텍스트 에디터 컴포넌트 위치 ...</div> */}
          </div>
        </fieldset>

        {/* 3. 액션 버튼 */}
        <div className="flex justify-end pt-4 gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150"
          >
            공지사항 작성
          </button>
        </div>
      </form>
    </Container>
  );
}
