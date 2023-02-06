import TasksStatusEnum from "../enums/TasksStatus.enum";

export default class CreateTaskDTO{
    userId: number;
    title: string;
    description: string;
    status: TasksStatusEnum
}