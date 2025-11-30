"use client";

import { NoticeFormProps } from "@/types/notice";
import { useRef } from "react";
import RichTextEditor from "./RichTextEditor";
import Checkbox from "@/components/ui/Checkbox";

export function NoticeForm({
  formData,
  errors,
  onTitleChange,
  onContentChange,
  onImportantChange,
  mode = "create",
}: NoticeFormProps) {
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentEditorRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="px-5 py-7 lg:p-7 space-y-10 bg-[#FAFAFA] dark:bg-[#1A1A1A] rounded-xl">
      <fieldset className="p-6 border border-border rounded-xl space-y-6 shadow-lg bg-white dark:bg-transparent">
        <legend className="text-lg font-bold px-2 mb-0">기본 정보</legend>

        <div className="flex flex-col space-y-2">
          <label
            htmlFor={`notice-title-${mode}`}
            className="text-sm font-medium flex items-center"
          >
            제목
            <span className="text-red-100" aria-hidden="true">
              *
            </span>
          </label>
          <input
            id={`notice-title-${mode}`}
            type="text"
            placeholder="공지사항 제목을 입력해주세요."
            value={formData.title}
            ref={titleInputRef}
            onChange={(e) => onTitleChange(e.target.value)}
            className={`p-3 mb-0 border rounded-lg transition duration-150 w-full focus:outline-none focus:ring ${
              errors.title
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                : "border-border focus:border-[#87BAC3] focus:ring-[#87BAC3]/30"
            }`}
            aria-invalid={!!errors.title}
            aria-describedby={errors.title ? `title-error-${mode}` : undefined}
          />
          {errors.title && (
            <p id={`title-error-${mode}`} className="text-sm text-red-500 mt-3">
              {errors.title}
            </p>
          )}
        </div>

        <div className="flex items-center">
          <Checkbox
            id={`isImportant-${mode}`}
            label="중요 공지로 설정(상단에 고정됩니다.)"
            checked={formData.isImportant}
            onChange={(e) => onImportantChange(e.target.checked)}
          />
        </div>
      </fieldset>

      <fieldset className="p-6 border border-border rounded-xl space-y-6 shadow-lg bg-white dark:bg-transparent">
        <legend className="text-lg font-bold px-2 mb-0">내용 작성</legend>

        <div className="flex flex-col space-y-2">
          <RichTextEditor
            value={formData.content}
            ref={contentEditorRef}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              onContentChange(e.target.value)
            }
            placeholder="공지사항 내용을 입력해주세요."
            rows={15}
            className={`${
              errors.content
                ? "border-red-500 focus:border-red-500 focus:ring-red-500/30"
                : "focus:border-[#87BAC3] focus:ring-[#87BAC3]/30"
            } focus:outline-none focus:ring`}
            aria-invalid={!!errors.content}
            aria-describedby={
              errors.content ? `content-error-${mode}` : undefined
            }
          />
          {errors.content && (
            <p
              id={`content-error-${mode}`}
              className="text-sm text-red-500 mt-1"
            >
              {errors.content}
            </p>
          )}
        </div>
      </fieldset>
    </div>
  );
}
