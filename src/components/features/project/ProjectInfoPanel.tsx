/**
 * 프로젝트 정보 사이드 패널
 *
 * 표시 내용:
 * - 프로젝트 기본 정보 (이름, 설명, 기간)
 * - 프로젝트 타임라인 진행률
 * - 작업 현황 통계
 * - 주의 사항 (지연, 오늘 마감, 임박)
 * - 팀원 목록
 */

"use client";

import { useEffect, useState, useMemo } from "react";
import { format, differenceInDays, addDays } from "date-fns";
import { ko } from "date-fns/locale";
import {
  X,
  Calendar,
  Users,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Circle,
  PlayCircle,
  Info,
  Crown,
} from "lucide-react";
import { Task } from "@/types/kanban";

interface ProjectMember {
  user_id: string;
  role: string;
  users: {
    user_id: string;
    user_name: string;
    email: string;
    profile_image?: string;
  };
}

interface ProjectInfoPanelProps {
  projectId: string;
  projectName: string;
  projectDescription?: string;
  projectStartDate?: string;
  projectEndDate?: string;
  tasks: Task[];
  onClose: () => void;
}

export default function ProjectInfoPanel({
  projectId,
  projectName,
  projectDescription,
  projectStartDate,
  projectEndDate,
  tasks,
  onClose,
}: ProjectInfoPanelProps) {
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);

  // 팀원 정보 로드
  useEffect(() => {
    const fetchMembers = async () => {
      if (!projectId) return;

      setIsLoadingMembers(true);
      try {
        const response = await fetch(
          `/api/projectMembers/forAssignment?projectId=${projectId}`
        );
        if (response.ok) {
          const result = await response.json();
          setMembers(result.data || []);
        }
      } catch (error) {
        console.error("팀원 조회 실패:", error);
      } finally {
        setIsLoadingMembers(false);
      }
    };

    fetchMembers();
  }, [projectId]);

  // 프로젝트 타임라인 계산
  const timeline = useMemo(() => {
    if (!projectStartDate || !projectEndDate) return null;

    const start = new Date(projectStartDate);
    const end = new Date(projectEndDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalDays = differenceInDays(end, start) + 1;
    const elapsedDays = differenceInDays(today, start) + 1;
    const remainingDays = differenceInDays(end, today);

    // 진행률 (0~100%)
    let progressPercent = Math.round((elapsedDays / totalDays) * 100);
    progressPercent = Math.max(0, Math.min(100, progressPercent));

    // 상태 판단
    let status: "before" | "active" | "warning" | "ended";
    if (today < start) {
      status = "before";
    } else if (today > end) {
      status = "ended";
    } else if (remainingDays <= 3) {
      status = "warning";
    } else {
      status = "active";
    }

    return {
      totalDays,
      elapsedDays: Math.max(0, elapsedDays),
      remainingDays,
      progressPercent,
      status,
      startStr: format(start, "M월 d일", { locale: ko }),
      endStr: format(end, "M월 d일", { locale: ko }),
    };
  }, [projectStartDate, projectEndDate]);

  // 작업 통계 계산
  const stats = useMemo(() => {
    const now = new Date();
    const today = format(now, "yyyy-MM-dd");
    const threeDaysLater = format(addDays(now, 3), "yyyy-MM-dd");

    const todo = tasks.filter((t) => t.status === "todo").length;
    const inprogress = tasks.filter((t) => t.status === "inprogress").length;
    const done = tasks.filter((t) => t.status === "done").length;
    const total = tasks.length;

    // 지연
    const overdue = tasks.filter((t) => {
      if (t.status === "done" || !t.ended_at) return false;
      const endDate = t.ended_at.split("T")[0];
      if (endDate < today) return true;
      if (endDate === today && t.use_time && t.end_time) {
        const [hours, minutes] = t.end_time.split(":").map(Number);
        const deadline = new Date();
        deadline.setHours(hours, minutes, 0, 0);
        return now > deadline;
      }
      return false;
    }).length;

    // 오늘 마감
    const todayDue = tasks.filter((t) => {
      if (t.status === "done" || !t.ended_at) return false;
      const endDate = t.ended_at.split("T")[0];
      return endDate === today;
    }).length;

    // D-3 이내 (오늘 제외)
    const upcoming = tasks.filter((t) => {
      if (t.status === "done" || !t.ended_at) return false;
      const endDate = t.ended_at.split("T")[0];
      return endDate > today && endDate <= threeDaysLater;
    }).length;

    const completionRate = total > 0 ? Math.round((done / total) * 100) : 0;

    return {
      todo,
      inprogress,
      done,
      total,
      overdue,
      todayDue,
      upcoming,
      completionRate,
    };
  }, [tasks]);

  return (
    <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
      {/* 헤더 - 칸반 헤더와 동일한 색상 */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-500 bg-main-200 dark:bg-main-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Info size={18} className="text-white" />
          <h3 className="font-semibold text-white">프로젝트 정보</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/20 rounded transition-colors"
        >
          <X size={18} className="text-white" />
        </button>
      </div>

      {/* 컨텐츠 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* 프로젝트 기본 정보 */}
        <section>
          <h4 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-1">
            {projectName}
          </h4>
          {projectDescription && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {projectDescription}
            </p>
          )}
        </section>

        {/* 프로젝트 기간 & 타임라인 */}
        {timeline && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <Calendar size={16} />
              <span>프로젝트 기간</span>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 space-y-3">
              {/* 날짜 표시 */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {timeline.startStr}
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {timeline.status === "before" && (
                    <span className="text-blue-500">
                      시작까지 D-{Math.abs(timeline.elapsedDays)}
                    </span>
                  )}
                  {timeline.status === "active" && (
                    <span className="text-main-500">
                      D-{timeline.remainingDays}
                    </span>
                  )}
                  {timeline.status === "warning" && (
                    <span className="text-orange-500">
                      ⚠️ D-{timeline.remainingDays}
                    </span>
                  )}
                  {timeline.status === "ended" && (
                    <span className="text-red-500">종료됨</span>
                  )}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {timeline.endStr}
                </span>
              </div>

              {/* 타임라인 바 */}
              <div className="relative">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      timeline.status === "ended"
                        ? "bg-red-500"
                        : timeline.status === "warning"
                        ? "bg-orange-500"
                        : "bg-main-500"
                    }`}
                    style={{ width: `${timeline.progressPercent}%` }}
                  />
                </div>
                {/* 오늘 마커 */}
                {timeline.status !== "before" &&
                  timeline.status !== "ended" && (
                    <div
                      className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-main-500 rounded-full shadow"
                      style={{
                        left: `${timeline.progressPercent}%`,
                        marginLeft: "-6px",
                      }}
                    />
                  )}
              </div>

              {/* 기간 정보 */}
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>총 {timeline.totalDays}일</span>
                <span>{timeline.progressPercent}% 경과</span>
              </div>
            </div>
          </section>
        )}

        {/* 작업 현황 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <CheckCircle2 size={16} />
            <span>작업 현황</span>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3 space-y-3">
            {/* 상태별 개수 */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 text-xs mb-1">
                  <Circle size={10} />
                  할일
                </div>
                <div className="text-lg font-bold text-gray-700 dark:text-gray-200">
                  {stats.todo}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                <div className="flex items-center justify-center gap-1 text-blue-500 text-xs mb-1">
                  <PlayCircle size={10} />
                  진행중
                </div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {stats.inprogress}
                </div>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-2">
                <div className="flex items-center justify-center gap-1 text-green-500 text-xs mb-1">
                  <CheckCircle2 size={10} />
                  완료
                </div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {stats.done}
                </div>
              </div>
            </div>

            {/* 완료율 바 */}
            <div>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                <span>완료율</span>
                <span className="font-medium">{stats.completionRate}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all duration-300"
                  style={{ width: `${stats.completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* 주의 사항 */}
        {(stats.overdue > 0 || stats.todayDue > 0 || stats.upcoming > 0) && (
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              <AlertTriangle size={16} />
              <span>주의 사항</span>
            </div>

            <div className="space-y-2">
              {stats.overdue > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span>지연된 작업</span>
                  <span className="ml-auto font-bold">{stats.overdue}개</span>
                </div>
              )}
              {stats.todayDue > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg text-sm">
                  <AlertTriangle size={14} />
                  <span>오늘 마감</span>
                  <span className="ml-auto font-bold">{stats.todayDue}개</span>
                </div>
              )}
              {stats.upcoming > 0 && (
                <div className="flex items-center gap-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 rounded-lg text-sm">
                  <Clock size={14} />
                  <span>D-3 이내</span>
                  <span className="ml-auto font-bold">{stats.upcoming}개</span>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 팀원 */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            <Users size={16} />
            <span>팀원</span>
            <span className="text-gray-400 dark:text-gray-500">
              ({members.length}명)
            </span>
          </div>

          <div className="space-y-2">
            {isLoadingMembers ? (
              <div className="text-sm text-gray-400 dark:text-gray-500 py-2">
                로딩 중...
              </div>
            ) : members.length > 0 ? (
              members.map((member) => (
                <div
                  key={member.user_id}
                  className="flex items-center gap-3 px-3 py-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg"
                >
                  {/* 아바타 */}
                  <div className="w-8 h-8 rounded-full bg-main-100 dark:bg-main-900/50 flex items-center justify-center text-main-600 dark:text-main-400 font-medium text-sm">
                    {member.users.user_name?.charAt(0) || "?"}
                  </div>
                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate">
                        {member.users.user_name}
                      </span>
                      {member.role === "leader" && (
                        <Crown size={12} className="text-yellow-500" />
                      )}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {member.users.email}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-400 dark:text-gray-500 py-2">
                팀원이 없습니다
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
