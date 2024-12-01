export default interface TodoItem {
  id: number;
  content: string;
  hasCompleted: boolean;
  isEditing: boolean;
  userId?: number;
}
