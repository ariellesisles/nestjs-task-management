import { TaskStatus } from "../task-status.enum.js"

export class UpdateTaskDto {
    id: string;
    status: TaskStatus;
}
