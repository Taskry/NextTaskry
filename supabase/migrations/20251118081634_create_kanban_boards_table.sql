-- KanbanBoard 테이블 생성
CREATE TABLE IF NOT EXISTS kanban_boards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  project_id TEXT NOT NULL,
  columns TEXT NOT NULL DEFAULT 'todo,inprogress,done',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- updated_at 자동 업데이트 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_kanban_boards_updated_at
  BEFORE UPDATE ON kanban_boards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();