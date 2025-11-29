// src/components/features/task/detail/TaskDetail.tsx
"use client"; // Next.js 클라이언트 컴포넌트 지시어

// React Hooks - 상태 관리와 생명주기
import { useState, useEffect } from "react";

// UI 컴포넌트들
import Button from "@/components/ui/Button"; // 공통 버튼 컴포넌트
import { Icon } from "@/components/shared/Icon"; // 아이콘 컴포넌트
import { showToast } from "@/lib/utils/toast"; // 토스트 알림
import { TASK_MESSAGES } from "@/lib/constants/messages"; // 메시지 상수
import { supabase } from "@/lib/supabase/supabase"; // Supabase 클라이언트
import { useModal } from "@/hooks/useModal"; // 모달 상태 관리 훅
import Modal from "@/components/ui/Modal"; // 모달 컴포넌트

// Task 관련 공용 컴포넌트들 - 재사용성을 위해 분리
import { FormSection } from "@/components/features/task/shared/FormSection"; // 폼 섹션 래퍼
import { StatusPrioritySection } from "@/components/features/task/shared/StatusPrioritySection"; // 상태/우선순위
import { DateFields } from "@/components/features/task/shared/DateFields"; // 날짜 입력 필드들
import { SubtaskSection } from "@/components/features/task/shared/SubtaskSection"; // 서브태스크 관리
import { AssigneeField } from "@/components/features/task/fields/AssigneeField"; // 담당자 선택

// 타입 정의
import { Task } from "@/types/kanban";

// ============================================
// 🛠️ 유틸리티 함수들
// ============================================

/**
 * 📅 날짜/시간 변환 유틸리티
 *
 * ISO 문자열과 UI 표시용 날짜/시간 간 변환을 담당
 * DB 저장 형식과 사용자 친화적 형식 간의 브릿지 역할
 */
const dateTimeUtils = {
  // 🔄 저장용: 날짜+시간을 ISO 문자열로 변환 (DB 저장용)
  toISOString: (dateStr: string, timeStr?: string) => {
    const time = timeStr || "00:00"; // 시간이 없으면 자정으로
    return `${dateStr}T${time}:00.000Z`; // ISO 8601 형식
  },

  // 🎨 표시용: ISO 문자열을 날짜/시간으로 분리 (UI 표시용)
  parseDateTime: (isoString?: string | null) => {
    if (!isoString) return { date: "", time: "", hasTime: false };

    const [datePart, timePart] = isoString.split("T"); // ISO 문자열 파싱
    const [hours, minutes] = timePart.split(":");

    return {
      date: datePart, // YYYY-MM-DD 형식
      time: `${hours}:${minutes}`, // HH:MM 형식
      hasTime: hours !== "00" || minutes !== "00", // 실제 시간 정보 있는지 확인
    };
  },
};

// ============================================
// 📋 타입 정의
// ============================================

/**
 * TaskDetail 컴포넌트 Props 인터페이스
 *
 * 부모 컴포넌트(KanbanBoard)에서 전달받는 데이터와 콜백들
 */
interface TaskDetailProps {
  task: Task; // 🎯 편집할 Task 데이터 (모든 필드 포함)
  projectStartedAt?: string;
  projectEndedAt?: string;
  onUpdate?: (taskId: string, updates: Partial<Task>) => void; // 📝 Task 업데이트 콜백
  onDelete?: (taskId: string) => void; // 🗑️ Task 삭제 콜백
  onClose?: () => void; // ❌ 모달 닫기 콜백
}

/**
 * 프로젝트 멤버 타입
 *
 * 담당자 선택 드롭다운에서 사용되는 멤버 정보
 * Supabase JOIN 쿼리 결과 구조
 */
type ProjectMember = {
  project_id: string; // 🏷️ 프로젝트 ID
  user_id: string; // 👤 사용자 ID
  role: string; // 🎭 역할 (leader/member)
  users: {
    // 👥 사용자 상세 정보 (JOIN)
    id: string; // 사용자 고유 ID
    name: string; // 사용자 이름
    email: string; // 이메일
    avatar_url: string; // 프로필 이미지 URL
  };
};

// ============================================
// 🎯 메인 컴포넌트
// ============================================

/**
 * TaskDetail 컴포넌트
 *
 * 핵심 기능:
 * - Task 모든 필드 편집 (제목, 설명, 상태, 우선순위, 날짜, 담당자 등)
 * - 실시간 변경사항 감지 및 저장 버튼 활성화
 * - 날짜/시간 형식 변환 (ISO ↔ UI 표시용)
 * - 프로젝트 멤버 조회 및 담당자 할당
 * - 서브태스크 관리
 * - 삭제 확인 모달
 */
export default function TaskDetail({
  task,
  projectStartedAt,
  projectEndedAt,
  onUpdate,
  onDelete,
  onClose,
}: TaskDetailProps) {
  // 🔄 원본 Task의 날짜 데이터를 UI 형식으로 파싱
  const startDateTime = dateTimeUtils.parseDateTime(task.started_at);
  const endDateTime = dateTimeUtils.parseDateTime(task.ended_at);

  // 🎨 UI에서 편집하기 쉬운 형태로 Task 데이터 변환
  const initialTask = {
    ...task, // 원본 Task의 모든 필드 복사
    started_at: startDateTime.date, // ISO → YYYY-MM-DD
    ended_at: endDateTime.date,
    start_time: startDateTime.time, // 시간 부분 분리
    end_time: endDateTime.time,
    use_time: startDateTime.hasTime || endDateTime.hasTime, // 시간 사용 여부
  };

  // 📝 상태 관리
  const [editedTask, setEditedTask] = useState<Task>(initialTask); // 편집 중인 Task 데이터
  const [editingField, setEditingField] = useState<string | null>(null); // 현재 편집 중인 필드
  const [isLoadingMembers, setIsLoadingMembers] = useState(false); // 멤버 로딩 상태
  const [isLoadingAssignee, setIsLoadingAssignee] = useState(false); // assignee 보강 로딩 상태
  const [members, setMembers] = useState<ProjectMember[] | null>(null); // 프로젝트 멤버 목록
  const { openModal, modalProps } = useModal(); // 삭제 확인 모달 관리

  // 🚀 컴포넌트 마운트 시 프로젝트 멤버 데이터 조회
  useEffect(() => {
    /**
     * 👥 프로젝트 멤버 조회 비동기 함수
     *
     * 목적: 담당자 드롭다운에 표시할 멤버 목록 조회
     * API 엔드포인트: /api/projectMembers/forAssignment
     */
    const fetchMember = async () => {
      // 🛡️ 가드: 프로젝트 ID 필수 확인
      if (!task.project_id) {
        console.warn("프로젝트 ID가 없습니다.");
        return;
      }

      setIsLoadingMembers(true); // 로딩 상태 시작
      try {
        // 🌐 API 호출: 프로젝트 멤버 목록 요청
        const response = await fetch(
          `/api/projectMembers/forAssignment?projectId=${task.project_id}`
        );

        // 🚑 HTTP 에러 처리
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error ||
              `HTTP ${response.status}: 프로젝트 멤버를 불러오는 데 실패했습니다.`
          );
        }

        const result = await response.json();

        // 📈 응답 데이터 처리
        if (result.data) {
          setMembers(result.data); // 성공: 멤버 목록 설정
        } else {
          console.warn("프로젝트 멤버 데이터가 없습니다:", result);
          setMembers([]); // 데이터 없음: 빈 배열
        }
      } catch (error) {
        // 🚑 예외 처리: 네트워크 오류, API 에러 등
        console.error("프로젝트 멤버 조회 에러:", error);
        // 에러가 발생해도 UI가 깨지지 않도록 빈 배열로 설정
        setMembers([]);
      } finally {
        setIsLoadingMembers(false); // 로딩 상태 종료
      }
    };

    fetchMember(); // 비동기 함수 실행
  }, [
    task.project_id,
    task.id,
    task.assigned_user_id,
    task.title,
    task.kanban_board_id,
  ]); // 의존성 배열: 이 값들이 변경되면 재실행

  /**
   * 🔄 assignee 정보 보강 useEffect
   *
   * 실시간 생성된 태스크에서 assignee 정보가 누락된 경우
   * assigned_user_id를 기반으로 사용자 정보를 다시 조회
   */
  useEffect(() => {
    const enrichAssigneeInfo = async () => {
      // assigned_user_id는 있지만 assignee 정보가 없는 경우
      if (task.assigned_user_id && !task.assignee) {
        setIsLoadingAssignee(true);

        try {
          const { data: userData } = await supabase
            .from("users")
            .select("user_id, user_name, email")
            .eq("user_id", task.assigned_user_id)
            .single();

          if (userData) {
            const assigneeInfo = {
              user_id: userData.user_id,
              name: userData.user_name,
              email: userData.email,
            };

            // editedTask에 assignee 정보 보강
            setEditedTask((prev) => ({
              ...prev,
              assignee: assigneeInfo,
            }));
          }
        } catch (error) {
          console.error("TaskDetail assignee 정보 로드 실패:", error);
        } finally {
          setIsLoadingAssignee(false);
        }
      }
    };

    enrichAssigneeInfo();
  }, [task.assigned_user_id, task.assignee]); // assignee 정보 변경 시 재실행

  /**
   * 🔍 변경사항 감지 함수
   *
   * 목적: 원본 Task와 편집된 Task를 비교하여 변경사항 존재 여부 확인
   * 사용: 저장 버튼 활성화 조건, 수정 사항 경고 등
   *
   * 비교 대상:
   * - 기본 필드: title, description, status, priority, memo
   * - 날짜 필드: started_at, ended_at, start_time, end_time, use_time
   * - 담당자: assigned_user_id
   * - 서브태스크: subtasks 배열 비교
   */
  const hasChanges = () => {
    // 🔄 원본 Task의 날짜 데이터를 UI 형식으로 파싱
    const originalStart = dateTimeUtils.parseDateTime(task.started_at);
    const originalEnd = dateTimeUtils.parseDateTime(task.ended_at);

    return (
      editedTask.title !== task.title ||
      (editedTask.description || "") !== (task.description || "") ||
      editedTask.status !== task.status ||
      (editedTask.priority || "normal") !== (task.priority || "normal") ||
      (editedTask.assigned_user_id || null) !==
        (task.assigned_user_id || null) ||
      // 날짜 비교
      editedTask.started_at !== originalStart.date ||
      editedTask.ended_at !== originalEnd.date ||
      (editedTask.use_time || false) !==
        (originalStart.hasTime || originalEnd.hasTime) ||
      (editedTask.use_time
        ? editedTask.start_time !== originalStart.time
        : false) ||
      (editedTask.use_time
        ? editedTask.end_time !== originalEnd.time
        : false) ||
      (editedTask.memo || "") !== (task.memo || "") ||
      JSON.stringify(editedTask.subtasks || []) !==
        JSON.stringify(task.subtasks || [])
    );
  };

  const handleChange = (field: keyof Task, value: any) => {
    setEditedTask((prev) => {
      const newData = { ...prev, [field]: value };

      // "시간 지정" 체크 시 기본 시간값 자동 설정
      if (field === "use_time" && value === true) {
        if (!newData.start_time) {
          newData.start_time = "09:00";
        }
        if (!newData.end_time) {
          newData.end_time = "18:00";
        }
      }

      // "시간 지정" 해제 시 시간값 초기화
      if (field === "use_time" && value === false) {
        newData.start_time = "";
        newData.end_time = "";
      }

      // 시간을 모두 지우면 use_time을 false로 설정
      if (
        (field === "start_time" || field === "end_time") &&
        (!value || !value.trim())
      ) {
        const otherTimeField =
          field === "start_time" ? newData.end_time : newData.start_time;
        if (!otherTimeField || !otherTimeField.trim()) {
          console.log(
            `⏰ TaskDetail 시간 모두 삭제됨, use_time을 false로 설정`
          );
          newData.use_time = false;
        }
      }

      return newData;
    });
  };

  const handleSave = async () => {
    if (!hasChanges()) return;

    try {
      // ✅ 수정: 날짜는 항상 자정, 시간은 별도 컬럼에 저장
      const startedAtISO = editedTask.started_at
        ? `${editedTask.started_at}T00:00:00`
        : null;

      const endedAtISO = editedTask.ended_at
        ? `${editedTask.ended_at}T00:00:00`
        : null;

      // 데이터베이스 업데이트용 - UI 전용 필드 제외
      const updates: Partial<Task> = {
        title: editedTask.title,
        description: editedTask.description,
        status: editedTask.status,
        priority: editedTask.priority,
        assigned_user_id: editedTask.assigned_user_id,
        started_at: startedAtISO,
        ended_at: endedAtISO,
        start_time: editedTask.use_time ? editedTask.start_time : null,
        end_time: editedTask.use_time ? editedTask.end_time : null,
        use_time: editedTask.use_time || false,
        memo: editedTask.memo,
        subtasks: editedTask.subtasks,
        updated_at: new Date().toISOString(),
      };

      // 불필요한 필드 제거 (DB에 없는 컬럼들)
      const filteredUpdates = { ...updates };
      delete (filteredUpdates as any).id;
      delete (filteredUpdates as any).created_at;
      delete (filteredUpdates as any).kanban_boards;

      await onUpdate?.(task.id, filteredUpdates);
      showToast("작업이 저장되었습니다.", "success");

      setTimeout(() => {
        onClose?.();
      }, 500);
    } catch (error) {
      console.error("작업 저장 중 오류:", error);
      showToast("작업 저장에 실패했습니다.", "error");
    }
  };
  // 작업 삭제 확인 모달 열기
  const handleDelete = () => {
    openModal("delete", "작업 삭제", TASK_MESSAGES.DELETE_CONFIRM);
  };

  // 작업 삭제 실행
  const confirmDelete = async () => {
    try {
      await onDelete?.(task.id);

      // 삭제 성공 모달 표시
      openModal(
        "deleteSuccess",
        "작업 삭제 완료",
        "선택한 작업이 삭제되었습니다."
      );

      // 5초 후 자동으로 모달 닫기 (deleteSuccess 모달은 자동 닫힘)
      setTimeout(() => {
        onClose?.();
      }, 5000);
    } catch (error) {
      console.error("작업 삭제 중 오류:", error);
      openModal("error", "삭제 실패", "작업 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Header createdAt={task.created_at} updatedAt={task.updated_at} />

      {/* Title */}
      <TitleField
        value={editedTask.title}
        isEditing={editingField === "title"}
        onEdit={() => setEditingField("title")}
        onChange={(v: string) => handleChange("title", v)}
        onBlur={() => setEditingField(null)}
        onCancel={() => {
          setEditedTask(task);
          setEditingField(null);
        }}
      />

      {/* Status & Priority */}
      <StatusPrioritySection
        status={editedTask.status}
        priority={editedTask.priority || "normal"}
        onStatusChange={(v) => handleChange("status", v)}
        onPriorityChange={(v) => handleChange("priority", v)}
      />

      {/* 📄 설명 필드 섹션 - 인라인 편집 가능 */}
      <FormSection icon="description" title="설명">
        <DescriptionField
          value={editedTask.description} // 현재 설명 내용
          isEditing={editingField === "description"} // 현재 편집 모드 여부
          onEdit={() => setEditingField("description")} // 편집 모드 진입
          onChange={(v: string) => handleChange("description", v)} // 내용 변경 시 업데이트
          onBlur={() => setEditingField(null)} // 포커스 잃으면 편집 모드 종료
          onCancel={() => {
            // 취소 시 원본 데이터로 복원
            setEditedTask(task);
            setEditingField(null);
          }}
        />
      </FormSection>

      {/* 👤 담당자 필드 - 프로젝트 멤버 드롭다운 */}
      <AssigneeField
        value={editedTask.assigned_user_id} // 현재 할당된 사용자 ID
        isEditing={editingField === "assigned_user_id"} // 편집 모드 여부
        isLoading={isLoadingMembers || isLoadingAssignee} // 멤버 또는 assignee 로딩 상태
        members={members} // 프로젝트 멤버 목록 (API에서 조회)
        onEdit={() => setEditingField("assigned_user_id")} // 편집 모드 진입
        onChange={(v) => handleChange("assigned_user_id", v)} // 담당자 변경
        onBlur={() => setEditingField(null)} // 편집 모드 종료
        onCancel={() => {
          // 취소 시 원본 데이터로 복원
          setEditedTask(task);
          setEditingField(null);
        }}
      />

      {/* Dates → Add와 동일한 UI */}
      <FormSection icon="calendar" title="기간">
        <DateFields
          startDate={editedTask.started_at || ""}
          endDate={editedTask.ended_at || ""}
          startTime={editedTask.start_time || ""}
          endTime={editedTask.end_time || ""}
          useTime={editedTask.use_time || false}
          projectStartedAt={projectStartedAt}
          projectEndedAt={projectEndedAt}
          onStartDateChange={(v: string) => handleChange("started_at", v)}
          onEndDateChange={(v: string) => handleChange("ended_at", v)}
          onStartTimeChange={(v: string) => handleChange("start_time", v)}
          onEndTimeChange={(v: string) => handleChange("end_time", v)}
          onUseTimeChange={(v: boolean) => handleChange("use_time", v)}
        />
      </FormSection>

      {/* Subtasks */}
      <SubtaskSection
        subtasks={editedTask.subtasks || []}
        onUpdate={(list) => handleChange("subtasks", list)}
      />

      {/* 📃 메모 섹션 - 인라인 편집 가능한 노트 필드 */}
      <FormSection icon="notes" title="메모">
        <MemoField
          value={editedTask.memo} // 현재 메모 내용
          isEditing={editingField === "memo"} // 현재 편집 모드 여부
          onEdit={() => setEditingField("memo")} // 편집 모드 진입
          onChange={(v: string) => handleChange("memo", v)} // 메모 내용 변경
          onBlur={() => setEditingField(null)} // 편집 모드 종료
          onCancel={() => {
            // 취소 시 원본 데이터로 복원
            setEditedTask(task);
            setEditingField(null);
          }}
        />
      </FormSection>

      {/* Action Buttons */}
      <ActionButtons
        hasChanges={hasChanges()}
        onCancel={() => setEditedTask(task)}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      {/* 삭제 확인 모달 */}
      <Modal {...modalProps} onConfirm={confirmDelete} />
    </div>
  );
}

// ============================================
// 🧩 서브 컴포넌트들
// ============================================

/**
 * 📝 Header 컴포넌트 - Task 메타 정보 표시
 *
 * 기능:
 * - Task 생성일 및 수정일 표시
 * - 한국어 날짜 포맷 지원
 * - 생성/수정 여부 자동 감지
 * - 미래 확장: 작성자 정보 추가 예정
 */
function Header({
  createdAt, // 📅 Task 생성 일시 (ISO 문자열)
  updatedAt, // 🔄 Task 수정 일시 (ISO 문자열)
}: {
  createdAt: string; // DB에서 오는 생성 타임스탬프
  updatedAt: string; // DB에서 오는 수정 타임스탬프
}) {
  /**
   * 🌏 날짜 포매팅 유틸리티 함수
   *
   * ISO 문자열을 한국어 날짜 형식으로 변환
   * 예: "2024년 11월 28일 오후 2:30"
   */
  const formatDate = (dateString: string) => {
    const date = new Date(dateString); // ISO 문자열을 Date 객체로 변환
    return date.toLocaleDateString("ko-KR", {
      year: "numeric", // 2024년
      month: "long", // 11월
      day: "numeric", // 28일
      hour: "2-digit", // 14
      minute: "2-digit", // 30
    });
  };

  // 🔍 생성 후 수정 여부 확인 (수정 버튼 표시용)
  const isUpdated = createdAt !== updatedAt;

  return (
    <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex flex-col gap-2 text-sm text-gray-500 dark:text-gray-400">
        {/* 📅 Task 생성 정보 표시 */}
        <div className="flex items-center gap-2">
          {/* ⏰ 시계 아이콘 */}
          <Icon
            type="clock"
            size={16}
            className="text-gray-400 dark:text-gray-500"
          />
          <span className="font-medium text-gray-600 dark:text-gray-400">
            생성:
          </span>
          <span>{formatDate(createdAt)}</span> {/* 포매팅된 생성일 */}
          {/* 🕰️ TODO: 작성자 정보 추가 시 사용 (예: "by 김철수") */}
          {/* <span className="text-gray-400 dark:text-gray-500">by</span>
          <span className="font-medium text-gray-700 dark:text-gray-300">작성자명</span> */}
        </div>

        {/* 🔄 Task 수정 정보 (조건부 렌더링: 수정된 경우만 표시) */}
        {isUpdated && (
          <div className="flex items-center gap-2">
            {/* ✏️ 편집 아이콘 */}
            <Icon
              type="edit"
              size={16}
              className="text-gray-400 dark:text-gray-500"
            />
            <span className="font-medium text-gray-600 dark:text-gray-400">
              수정:
            </span>
            <span>{formatDate(updatedAt)}</span> {/* 포매팅된 수정일 */}
            {/* 🕰️ TODO: 수정자 정보 추가 시 사용 (예: "by 이영희") */}
            {/* <span className="text-gray-400 dark:text-gray-500">by</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">수정자명</span> */}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * 📝 TitleField 컴포넌트 - 인라인 편집 가능한 제목 필드
 *
 * 기능:
 * - 읽기 모드: 제목 표시 + 편집 버튼
 * - 편집 모드: input 필드 + 저장/취소 버튼
 * - 자동 포커스 및 전체 선택
 * - ESC 키로 취소 가능
 * - 빈 값 방지 및 유효성 검사
 */
function TitleField({
  value, // 🏷️ 현재 제목 값
  isEditing, // ✏️ 편집 모드 여부
  onEdit, // 👆 편집 모드 진입 핸들러
  onChange, // 🔄 값 변경 핸들러
  onBlur, // 👁️ 포커스 이탈 핸들러
  onCancel, // ❌ 취소 핸들러
}: any) {
  if (isEditing) {
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={(e) => {
          if (e.key === "Enter") onBlur();
          if (e.key === "Escape") onCancel();
        }}
        autoFocus
        className="text-2xl font-bold text-gray-800 dark:text-gray-200 w-full border-b-2 border-main-300 dark:border-main-600 focus:outline-none pb-2 bg-transparent"
      />
    );
  }

  return (
    <h2
      onClick={onEdit}
      className="text-2xl font-bold text-gray-800 dark:text-gray-200 cursor-pointer hover:text-main-500 dark:hover:text-main-400 transition-colors flex items-center gap-2"
    >
      <Icon
        type="edit"
        size={20}
        className="text-gray-600 dark:text-gray-400"
      />
      {value}
    </h2>
  );
}

function DescriptionField({
  value,
  isEditing,
  onEdit,
  onChange,
  onBlur,
  onCancel,
}: any) {
  return isEditing ? (
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={(e) => {
        if (e.key === "Escape") onCancel();
      }}
      autoFocus
      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300 dark:focus:ring-main-500 min-h-[100px] bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
    />
  ) : (
    <p
      onClick={onEdit}
      className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 p-3 rounded min-h-[60px] transition-colors"
    >
      {value || (
        <span className="text-gray-400 dark:text-gray-500">
          클릭하여 설명 추가
        </span>
      )}
    </p>
  );
}

function MemoField({
  value,
  isEditing,
  onEdit,
  onChange,
  onBlur,
  onCancel,
}: any) {
  if (isEditing) {
    return (
      <textarea
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        onKeyDown={(e) => {
          if (e.key === "Escape") onCancel();
        }}
        autoFocus
        className="w-full px-3 py-2 border border-yellow-300 dark:border-yellow-700/50 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:focus:ring-yellow-500 min-h-20 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
      />
    );
  }

  return value ? (
    <div
      onClick={onEdit}
      className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700/50 rounded-lg p-4 cursor-pointer hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
    >
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
        {value}
      </p>
    </div>
  ) : (
    <p
      onClick={onEdit}
      className="text-gray-400 dark:text-gray-500 cursor-pointer hover:bg-yellow-50 dark:hover:bg-yellow-900/20 p-4 border border-dashed border-yellow-200 dark:border-yellow-700/50 rounded-lg transition-colors"
    >
      클릭하여 메모 추가
    </p>
  );
}

function ActionButtons({ hasChanges, onCancel, onSave, onDelete }: any) {
  return (
    <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
      {/* 삭제 */}
      <Button btnType="form_s" variant="warning" onClick={onDelete}>
        삭제
      </Button>

      {/* 취소/저장 */}
      {hasChanges && (
        <div className="flex gap-3">
          <Button btnType="basic" variant="basic" onClick={onCancel}>
            취소
          </Button>
          <Button btnType="form" variant="primary" onClick={onSave}>
            저장
          </Button>
        </div>
      )}
    </div>
  );
}
