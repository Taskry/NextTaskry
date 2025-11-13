// app/components/task/TaskDetail.tsx
"use client";

import { useEffect, useState } from "react";
import { Task, TaskPriority, TaskStatus } from "@/app/types/kanban";
import PriorityBadge from "./PriorityBadge";
import SubtaskList from "./SubtaskList";
import Button from "../Button/Button";
import { Icon } from "../Icon/Icon";

interface TaskDetailProps {
  task: Task;
  onUpdate?: (updatedTask: Task) => void;
  onDelete?: (taskId: string) => void;
  onClose?: () => void;
}

const TaskDetail = ({ task, onUpdate, onDelete, onClose }: TaskDetailProps) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<Task>(task);

  const hasChanges = () => {
    return JSON.stringify(editedTask) !== JSON.stringify(task);
  };

  const handleSave = () => {
    if (!hasChanges()) {
      return;
    }

    const updatedTask = {
      ...editedTask,
      updated_at: new Date().toISOString(),
    };

    onUpdate?.(updatedTask);
    setEditingField(null);
  };

  const handleClose = () => {
    if (hasChanges()) {
      const confirmed = confirm("변경 사항이 있습니다. 저장하시겠습니까?");
      if (confirmed) {
        handleSave();
      } else {
        setEditedTask(task);
      }
    }
    onClose?.();
  };

  useEffect(() => {
    return () => {};
  }, []);

  const handleDelete = () => {
    if (!confirm("정말 이 작업을 삭제하시겠습니까?")) return;

    // Mock: API 호출 없이 바로 삭제
    onDelete?.(task.id);
  };

  return (
    <div className="space-y-6">
      {/* 헤더 - 닫기/삭제 버튼 */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Icon type="clock" size={16} color="#9CA3AF" />
          <span>
            생성일: {new Date(task.created_at).toLocaleDateString("ko-KR")}
          </span>
        </div>
        <div className="flex">
          <Button
            variant="lightRed100"
            size="sm"
            textColor="white"
            onClick={handleDelete}
          >
            삭제
          </Button>
        </div>
      </div>

      {/* 제목 */}
      <div onClick={() => editingField !== "title" && setEditingField("title")}>
        {editingField === "title" ? (
          <input
            type="text"
            value={editedTask.title}
            onChange={(e) =>
              setEditedTask({ ...editedTask, title: e.target.value })
            }
            onBlur={() => setEditingField(null)}
            onKeyDown={(e) => {
              if (e.key === "Enter") setEditingField(null);
              if (e.key === "Escape") {
                setEditedTask(task);
                setEditingField(null);
              }
            }}
            autoFocus
            className="text-2xl font-bold text-gray-800 w-full border-b-2 border-main-300 focus:outline-none pb-2"
          />
        ) : (
          <h2 className="text-2xl font-bold text-gray-800 cursor-pointer hover:text-main-500 transition-colors flex items-center gap-2">
            <Icon type="edit" size={20} color="#6B7280" />
            {task.title}
          </h2>
        )}
      </div>

      {/* 상태 & 우선순위 */}
      <div className="grid grid-cols-2 gap-4">
        <div
          onClick={() => editingField !== "status" && setEditingField("status")}
        >
          <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
            <Icon type="progressAlert" size={16} color="#6B7280" />
            상태
          </h3>
          {editingField === "status" ? (
            <select
              value={editedTask.status}
              onChange={(e) => {
                setEditedTask({
                  ...editedTask,
                  status: e.target.value as TaskStatus,
                });
              }}
              onBlur={() => setEditingField(null)}
              autoFocus
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300"
            >
              <option value="todo">할 일</option>
              <option value="inprogress">진행 중</option>
              <option value="done">완료</option>
            </select>
          ) : (
            <div className="flex">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium cursor-pointer hover:opacity-80 transition-opacity ${
                  task.status === "todo"
                    ? "bg-gray-100 text-gray-700"
                    : task.status === "inprogress"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-green-100 text-green-700"
                }`}
              >
                {task.status === "todo"
                  ? "할 일"
                  : task.status === "inprogress"
                  ? "진행 중"
                  : "완료"}
              </span>
            </div>
          )}
        </div>

        <div
          onClick={() =>
            editingField !== "priority" && setEditingField("priority")
          }
        >
          <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
            <Icon type="alertTriangle" size={16} color="#6B7280" />
            우선순위
          </h3>
          {editingField === "priority" ? (
            <select
              value={editedTask.priority || "normal"}
              onChange={(e) => {
                setEditedTask({
                  ...editedTask,
                  priority: e.target.value as TaskPriority,
                });
              }}
              onBlur={() => setEditingField(null)}
              autoFocus
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300"
            >
              <option value="low">낮음</option>
              <option value="normal">보통</option>
              <option value="high">높음</option>
            </select>
          ) : (
            <div className="cursor-pointer hover:opacity-80 transition-opacity">
              {task.priority ? (
                <PriorityBadge priority={task.priority} />
              ) : (
                <span className="text-gray-400 text-sm">미설정</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 설명 */}
      <div
        onClick={() =>
          editingField !== "description" && setEditingField("description")
        }
      >
        <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
          <Icon type="description" size={16} color="#6B7280" />
          설명
        </h3>
        {editingField === "description" ? (
          <textarea
            value={editedTask.description || ""}
            onChange={(e) =>
              setEditedTask({ ...editedTask, description: e.target.value })
            }
            onBlur={() => setEditingField(null)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setEditedTask(task);
                setEditingField(null);
              }
            }}
            autoFocus
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300 min-h-[100px]"
            placeholder="설명을 입력하세요"
          />
        ) : (
          <p className="text-gray-700 whitespace-pre-wrap cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors min-h-10">
            {task.description || "클릭하여 설명 추가"}
          </p>
        )}
      </div>

      {/* 담당자 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
          <Icon type="userCircle" size={16} color="#6B7280" />
          담당자
        </h3>
        {editingField === "assigned_to" ? (
          <div className="space-y-2">
            <div className="relative">
              <Icon
                type="search"
                size={18}
                color="#9CA3AF"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
              />
              <input
                type="text"
                value={editedTask.assigned_to || ""}
                onChange={(e) =>
                  setEditedTask({ ...editedTask, assigned_to: e.target.value })
                }
                onBlur={() => setEditingField(null)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setEditingField(null);
                  if (e.key === "Escape") {
                    setEditedTask(task);
                    setEditingField(null);
                  }
                }}
                autoFocus
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300"
                placeholder="팀원 이름 검색..."
              />
            </div>
            {/* 팀원 목록 */}
            {editedTask.assigned_to && (
              <div className="border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                {[
                  "김철수",
                  "이영희",
                  "박민수",
                  "최지원",
                  "정수현",
                  "강민지",
                  "윤대현",
                  "송하늘",
                  "임서연",
                ]
                  .filter((name) =>
                    name
                      .toLowerCase()
                      .includes(editedTask.assigned_to?.toLowerCase() || "")
                  )
                  .map((name) => (
                    <div
                      key={name}
                      onClick={() => {
                        setEditedTask({ ...editedTask, assigned_to: name });
                        setEditingField(null);
                      }}
                      className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 cursor-pointer transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-main-200 flex items-center justify-center">
                        <span className="text-sm font-medium text-main-600">
                          {name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="text-sm text-gray-700">{name}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        ) : task.assigned_to ? (
          <div
            onClick={() => setEditingField("assigned_to")}
            className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-main-200 flex items-center justify-center">
              <span className="text-sm font-medium text-main-600">
                {task.assigned_to.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-gray-700">{task.assigned_to}</span>
          </div>
        ) : (
          <p
            onClick={() => setEditingField("assigned_to")}
            className="text-gray-400 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
          >
            클릭하여 담당자 추가
          </p>
        )}
      </div>

      {/* 날짜 정보 */}
      <div className="grid grid-cols-2 gap-4">
        <div
          onClick={() =>
            editingField !== "started_at" && setEditingField("started_at")
          }
        >
          <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
            <Icon type="calendarPlus" size={16} color="#6B7280" />
            시작일
          </h3>
          {editingField === "started_at" ? (
            <input
              type="date"
              value={editedTask.started_at || ""}
              onChange={(e) =>
                setEditedTask({ ...editedTask, started_at: e.target.value })
              }
              onBlur={() => setEditingField(null)}
              autoFocus
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300"
            />
          ) : (
            <p className="text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
              {task.started_at
                ? new Date(task.started_at).toLocaleDateString("ko-KR")
                : "클릭하여 시작일 설정"}
            </p>
          )}
        </div>

        <div
          onClick={() =>
            editingField !== "ended_at" && setEditingField("ended_at")
          }
        >
          <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
            <Icon type="calendarCheck" size={16} color="#6B7280" />
            마감일
          </h3>
          {editingField === "ended_at" ? (
            <input
              type="date"
              value={editedTask.ended_at || ""}
              onChange={(e) =>
                setEditedTask({ ...editedTask, ended_at: e.target.value })
              }
              onBlur={() => setEditingField(null)}
              autoFocus
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-300"
            />
          ) : (
            <p className="text-gray-700 cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors">
              {task.ended_at
                ? new Date(task.ended_at).toLocaleDateString("ko-KR")
                : "클릭하여 마감일 설정"}
            </p>
          )}
        </div>
      </div>

      {/* 하위 할 일 */}
      <div>
        <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
          <Icon type="checkList" size={16} color="#6B7280" />
          하위 할 일
        </h3>
        <SubtaskList
          subtasks={editedTask.subtasks || []}
          editable={true}
          onUpdate={(updatedSubtasks) =>
            setEditedTask({ ...editedTask, subtasks: updatedSubtasks })
          }
        />
      </div>

      {/* 메모 */}
      <div onClick={() => editingField !== "memo" && setEditingField("memo")}>
        <h3 className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
          <Icon type="notes" size={16} color="#6B7280" />
          메모
        </h3>
        {editingField === "memo" ? (
          <textarea
            value={editedTask.memo || ""}
            onChange={(e) =>
              setEditedTask({ ...editedTask, memo: e.target.value })
            }
            onBlur={() => setEditingField(null)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setEditedTask(task);
                setEditingField(null);
              }
            }}
            autoFocus
            className="w-full px-3 py-2 border border-yellow-300 bg-yellow-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 min-h-20"
            placeholder="메모를 입력하세요"
          />
        ) : task.memo ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 cursor-pointer hover:bg-yellow-100 transition-colors">
            <p className="text-gray-700 whitespace-pre-wrap">{task.memo}</p>
          </div>
        ) : (
          <p className="text-gray-400 cursor-pointer hover:bg-yellow-50 p-4 border border-dashed border-yellow-200 rounded-lg transition-colors">
            클릭하여 메모 추가
          </p>
        )}
      </div>

      {/* 저장 버튼 */}
      {hasChanges() && (
        <div className="flex gap-3 pt-4 border-t">
          <Button
            variant="basic"
            size="base"
            onClick={() => setEditedTask(task)}
          >
            취소
          </Button>
          <Button
            variant="bgMain300"
            size="base"
            textColor="white"
            onClick={handleSave}
          >
            저장
          </Button>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
