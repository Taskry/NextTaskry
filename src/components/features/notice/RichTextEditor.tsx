// RichTextEditor.tsx
"use client";
import React, {
  useCallback,
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef as useReactRef,
} from "react";
import Button from "@/components/ui/Button";

interface RichTextEditorProps {
  value: string;
  onChange: (e: any) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

const RichTextEditor = forwardRef<HTMLTextAreaElement, RichTextEditorProps>(
  ({ value, onChange, placeholder, rows = 15, className }, ref) => {
    const textareaId = "editor-textarea";
    const textareaRef = useReactRef<HTMLTextAreaElement>(null);

    // 부모에게 textarea ref를 노출
    useImperativeHandle(ref, () => textareaRef.current, []);
    const [activeFormats, setActiveFormats] = useState({});
    const [showPreview, setShowPreview] = useState(false);

    // 현재 커서 위치의 포맷 감지
    const detectActiveFormats = useCallback(() => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;

      // 선택 영역이나 커서 주변 텍스트 확인
      const before = textarea.value.substring(Math.max(0, start - 2), start);
      const after = textarea.value.substring(
        end,
        Math.min(textarea.value.length, end + 2)
      );
      const selected = textarea.value.substring(start, end);

      const active = {
        bold:
          (before.endsWith("**") && after.startsWith("**")) ||
          selected.match(/^\*\*.*\*\*$/),
        italic:
          (before.endsWith("*") &&
            after.startsWith("*") &&
            !before.endsWith("**")) ||
          selected.match(/^\*[^*].*[^*]\*$/),
      };

      setActiveFormats(active);
    }, []);

    // 키보드 단축키 처리
    const handleKeyDown = useCallback((e: any) => {
      // Ctrl/Cmd + B: 굵게
      if ((e.ctrlKey || e.metaKey) && e.key === "b") {
        e.preventDefault();
        applyFormat("bold");
      }
      // Ctrl/Cmd + I: 기울임
      else if ((e.ctrlKey || e.metaKey) && e.key === "i") {
        e.preventDefault();
        applyFormat("italic");
      }
      // Ctrl/Cmd + U: 목록
      else if ((e.ctrlKey || e.metaKey) && e.key === "u") {
        e.preventDefault();
        applyFormat("list");
      }
    }, []);

    const applyFormat = useCallback(
      (format: any) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);

        const formats = {
          bold: { prefix: "**", suffix: "**", placeholder: "굵게" },
          italic: { prefix: "*", suffix: "*", placeholder: "기울임" },
          list: { prefix: "\n- ", suffix: "", placeholder: "항목 1" },
          heading: { prefix: "\n## ", suffix: "\n", placeholder: "소제목" },
        };

        const fmt = formats[format];
        if (!fmt) return;

        const textToWrap = selectedText || fmt.placeholder;
        const newText = fmt.prefix + textToWrap + fmt.suffix;

        const newValue =
          textarea.value.substring(0, start) +
          newText +
          textarea.value.substring(end);

        onChange({ target: { value: newValue } });

        setTimeout(() => {
          textarea.focus();

          let newCursorPos;
          if (selectedText) {
            newCursorPos = start + newText.length;
          } else {
            newCursorPos = start + fmt.prefix.length + fmt.placeholder.length;
          }

          textarea.setSelectionRange(newCursorPos, newCursorPos);
          detectActiveFormats();
        }, 0);
      },
      [onChange, detectActiveFormats]
    );

    // 마크다운을 HTML로 변환
    // 마크다운을 HTML로 변환하는 함수
    const renderMarkdown = (text: string) => {
      if (!text) return "";

      return (
        text
          // ------------------------------------ 제목
          .replace(
            /^## (.+)$/gm,
            '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>'
          )
          // ------------------------------------ 굵게 (먼저 처리) - [\s\S]로 줄바꿈 포함
          .replace(
            /\*\*([\s\S]+?)\*\*/g,
            '<strong class="font-bold">$1</strong>'
          )
          // ------------------------------------ 기울임 (굵게가 아닌 단일 * 만 매칭)
          .replace(
            /(?<!\*)\*(?!\*)([\s\S]+?)(?<!\*)\*(?!\*)/g,
            '<em class="italic">$1</em>'
          )
          // ------------------------------------ 목록
          .replace(/^- (.+)(\n)?/gm, '<li class="ml-4 list-disc">$1</li>')
          // ------------------------------------ 줄바꿈
          .replace(/\n/g, "<br />")
      );
    };

    const ToolbarButton = ({ format, children, shortcut }: any) => (
      <button
        onClick={() => applyFormat(format)}
        className="text-sm transition-all border border-border rounded-sm px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-100/20"
        title={shortcut}
      >
        {children}
      </button>
    );

    return (
      <div className={`rounded-lg `}>
        {/* 툴바 */}
        <div className="flex flex-wrap justify-end gap-3 items-center justify-between p-2 border border-b-0 border-border rounded-t-lg">
          <div className="flex gap-1 flex-wrap w-full">
            <ToolbarButton format="bold" shortcut="Ctrl+B">
              <strong>B</strong> (굵게)
            </ToolbarButton>
            <ToolbarButton format="italic" shortcut="Ctrl+I">
              <em>I</em> (기울임)
            </ToolbarButton>
            <ToolbarButton format="heading">H1 (제목)</ToolbarButton>
            <ToolbarButton format="list" shortcut="Ctrl+U">
              • (목록)
            </ToolbarButton>
          </div>

          {/* 프리뷰 토글 */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm transition-all border border-border rounded-sm px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-100/20"
          >
            {showPreview ? "편집" : "미리보기"}
          </button>
        </div>

        {/* 에디터/프리뷰 영역 */}
        <div className="flex">
          {/* 텍스트 영역 */}
          <textarea
            ref={textareaRef} // 내부 ref 사용
            id={textareaId}
            value={value}
            onChange={(e: any) => {
              onChange(e);
              detectActiveFormats();
            }}
            onKeyDown={handleKeyDown}
            onMouseUp={detectActiveFormats}
            onSelect={detectActiveFormats}
            placeholder={placeholder}
            rows={rows}
            className={`p-4 border border-border resize-y  ${
              showPreview ? "w-1/2 " : "w-full"
            } ${className || ""}`}
            style={{ minHeight: `${rows * 1.5}rem` }}
          />

          {/* 프리뷰 영역 */}
          {showPreview && (
            <div
              className="w-1/2 p-4 overflow-y-auto border bg-gray-50 dark:bg-transparent"
              style={{ minHeight: `${rows * 1.5}rem` }}
            >
              <div
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

RichTextEditor.displayName = "RichTextEditor";

export default RichTextEditor;
