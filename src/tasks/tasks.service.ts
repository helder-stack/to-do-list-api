import { HttpException, Injectable } from "@nestjs/common";
import CreateTaskDTO from "./DTOs/CreateTask.dto";
import UpdateTaskDTO from "./DTOs/UpdateTask.dto";
import Tasks from "./entities/Tasks.entity";

@Injectable()
export default class TasksService{
    
    find(userId: number){
        return Tasks.find({where: {userId}})
    }

    async findOne(userId: number, taskId: number){
        const task = await Tasks.findOne({where: {userId, id: taskId}})
        if(!task){
            throw new HttpException("Task not found", 404)
            return
        }
        return task
    }

    async create(taskDTO: CreateTaskDTO, userId: number){
        const task = this.mount(taskDTO, userId)
        try{
            await Tasks.save(task)
        }catch(e){
            throw new HttpException("Internal server Error", 500)
        }
    }

    async update(taskId: number, taskDTO: UpdateTaskDTO, userId: number){
        const task = this.mount(taskDTO, userId)
        await this.validateExistenceOfTask(taskId, userId)
        try{
            await Tasks.update({id: taskId}, task)
        }catch(e){
            throw new HttpException("Internal server error", 500)
        }
    }

    mount(taskDTO: CreateTaskDTO | UpdateTaskDTO, userId: number){
        const task = new Tasks()
        task.userId = userId
        task.title = taskDTO.title
        task.description = taskDTO.description
        task.status = taskDTO.status
        return task
    }

    async delete(taskId: number, userId: number){
        await this.validateExistenceOfTask(taskId, userId)
        try{
            await Tasks.delete({id: taskId})
        }catch(e){
            throw new HttpException("Internal server error", 500)
        }
    }

    async validateExistenceOfTask(taskId: number, userId: number){
        const findTask = await Tasks.findOne({where: {id: taskId, userId}})
        if(!findTask){
            throw new HttpException("Task not found", 404)
            return
        }
    }
}