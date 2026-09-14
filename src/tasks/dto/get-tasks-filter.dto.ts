import { TaskStatus } from "../task.model.js";

export class GetTasksFilterDto{

    status?: TaskStatus;
    search?: string;
}