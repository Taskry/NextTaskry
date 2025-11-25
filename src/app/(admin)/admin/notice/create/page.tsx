"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/utils/toast";
import { createNotice } from "@/lib/api/notices";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { NOTICE_CONSTANS, NOTICE_MESSAGES } from "@/lib/constants/notices";
import Button from "@/components/ui/Button";
import RichTextEditor from "@/components/features/notice/RichTextEditor";
import Checkbox from "@/components/ui/Checkbox";
import Container from "@/components/shared/Container";

export default function AdminNoticeCreatePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState({ title: "", content: "" });

  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentEditorRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    document.body.classList.remove("overflow-hidden");
    document.body.classList.remove("h-full");

    return () => {
      document.body.classList.add("overflow-hidden");
      document.body.classList.add("h-full");
    };
  }, []);

  const validateForm = () => {
    const newErrors = { title: "", content: "" };

    if (!title.trim()) {
      newErrors.title = NOTICE_MESSAGES.TITLE_REQUIRED;
      setErrors(newErrors);
      titleInputRef.current?.focus();
      return false;
    }
    if (title.length > NOTICE_CONSTANS.TITLE_MAX_LENGTH) {
      newErrors.title = NOTICE_MESSAGES.TITLE_TOO_LONG;
      setErrors(newErrors);
      titleInputRef.current?.focus();
      return false;
    }
    if (!content.trim()) {
      newErrors.content = NOTICE_MESSAGES.CONTENT_REQUIRED;
      setErrors(newErrors);
      contentEditorRef.current?.focus();
      return false;
    }

    setErrors(errors);

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!validateForm()) {
        return;
      }

      await createNotice({
        title: title.trim(),
        content: content.trim(),
        is_important: isImportant,
      });

      alert(NOTICE_MESSAGES.CREATE_SUCCESS);

      // 데이터 캐시를 새로고침하고 목록 페이지로 이동
      router.refresh();
      router.push("/notice");
    } catch (error) {
      console.log("오류 발생: ", error);
      showToast(NOTICE_MESSAGES.UNKNOWN_ERROR, "error");
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsImportant(e.target.checked);
  };

  return (
    <Container>
      <SectionHeader
        title="공지사항 작성"
        description="새로운 공지사항을 작성하고 관리합니다."
        className="mb-10"
      />
      <form
        onSubmit={handleSubmit}
        className="px-5 py-7 lg:p-7 space-y-10 bg-[#FAFAFA] dark:bg-[#1A1A1A] rounded-xl"
      >
        <fieldset className="p-6 border border-gray-100 rounded-xl space-y-6 shadow-lg bg-white dark:bg-transparent">
          <legend className="text-lg font-bold px-2 mb-0">기본 정보</legend>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="notice-title"
              className="text-sm font-medium flex items-center"
            >
              제목
              <span className="text-red-100" aria-hidden="true">
                *
              </span>
            </label>
            <input
              id="notice-title"
              type="text"
              placeholder="공지사항 제목을 입력해주세요."
              value={title}
              ref={titleInputRef}
              onChange={(e: any) => {
                setTitle(e.target.value);
                setErrors((prev) => ({ ...prev, title: "" }));
              }}
              className={`p-3 mb-0 border rounded-lg transition duration-150 w-full focus:border-[#87BAC3] focus:outline-none focus:ring focus:ring-[#87BAC3]/30 ${
                errors.title ? "border-red-500" : "border-gray-100"
              }`}
            />
            <span className="text-red-500 text-sm mt-2">{errors.title}</span>
          </div>

          <div className="flex items-center">
            <Checkbox
              id="isImportant"
              label="중요 공지로 설정(상단에 고정됩니다.)"
              checked={isImportant}
              onChange={handleCheckboxChange}
            />
          </div>
        </fieldset>

        <fieldset className="p-6 border border-gray-100 rounded-xl space-y-6 shadow-lg bg-white dark:bg-transparent">
          <legend className="text-lg font-bold px-2 mb-0">내용 작성</legend>

          <div className="flex flex-col space-y-2">
            <RichTextEditor
              value={content}
              ref={contentEditorRef}
              onChange={(e: any) => {
                setContent(e.target.value);
                setErrors((prev) => ({ ...prev, content: "" }));
              }}
              placeholder="공지사항 내용을 입력해주세요."
              rows={15}
              className={`
                ${errors.content ? "border-red-500" : "border-gray-100"}
                focus:border-[#87BAC3]
                focus:outline-none
                focus:ring
                focus:ring-[#87BAC3]/30
              `}
            />
            <span className="text-red-500 text-sm mt-2 h-4">
              {errors.content}
            </span>
          </div>
        </fieldset>

        <div className="flex justify-end pt-4 gap-3">
          <Button type="button" btnType="basic" onClick={() => router.back()}>
            취소
          </Button>
          <Button type="submit" btnType="basic" variant="new">
            등록
          </Button>
        </div>
      </form>
    </Container>
  );
}
