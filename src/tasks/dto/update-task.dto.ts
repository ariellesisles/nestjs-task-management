import { TaskStatus } from "../task.model.js"

export class UpdateTaskDto {
    id: string;
    status: TaskStatus;
}
