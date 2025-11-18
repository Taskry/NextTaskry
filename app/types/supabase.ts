export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      tasks: {
        Row: {
          id: string;
          kanban_board_id: string;
          title: string;
          description?: string;
          status: string;
          priority: string;
          assigned_to?: string;
          started_at?: string;
          ended_at?: string;
          memo?: string;
          subtasks?: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          kanban_board_id: string;
          title: string;
          description?: string;
          status: string;
          priority: string;
          assigned_to?: string;
          started_at?: string;
          ended_at?: string;
          memo?: string;
          subtasks?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          kanban_board_id?: string;
          title?: string;
          description?: string;
          status?: string;
          priority?: string;
          assigned_to?: string;
          started_at?: string;
          ended_at?: string;
          memo?: string;
          subtasks?: Json;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
