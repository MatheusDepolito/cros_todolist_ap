export type TaskEntity = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  user_id: string;
  parent_task_id: string | null;
  created_at: Date;
  updated_at: Date;
  subTasks?: TaskEntity[];
};
