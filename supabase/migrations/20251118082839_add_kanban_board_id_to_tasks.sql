-- tasks 테이블에 kanban_board_id 필드 추가
ALTER TABLE tasks ADD COLUMN kanban_board_id TEXT;

-- 기존 데이터에 대해 기본 칸반 보드 ID 설정
-- (실제로는 각 프로젝트의 칸반 보드를 찾아서 설정해야 함)
-- 일단은 project_id와 동일하게 설정 (임시)
UPDATE tasks SET kanban_board_id = project_id WHERE kanban_board_id IS NULL;

-- kanban_board_id를 NOT NULL로 설정
ALTER TABLE tasks ALTER COLUMN kanban_board_id SET NOT NULL;