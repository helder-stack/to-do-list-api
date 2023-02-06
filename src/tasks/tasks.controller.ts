import { Body, Controller, Delete, Get, Param, Patch, Post, Req } from "@nestjs/common";
import CreateTaskDTO from "./DTOs/CreateTask.dto";
import UpdateTaskDTO from "./DTOs/UpdateTask.dto";
import TasksService from "./tasks.service";

@Controller("task")
export default class TasksController{
    constructor(
        private readonly service: TasksService
    ){}

    @Get('/')
    findTasks(@Req() req){
        return this.service.find(req.user.id)
    }

    @Get('/:id')
    findTask(@Param("id") id: number, @Req() req){
        return this.service.findOne(req.user.id, id)
    }

    @Post("/create")
    create(@Body() body: CreateTaskDTO, @Req() req){
        return this.service.create(body, req.user.id)
    }

    @Patch("/:id")
    update(@Body() body: UpdateTaskDTO, @Param('id') id: number, @Req() req){
        return this.service.update(id, body, req.user.id)
    }

    @Delete("/:id")
    delete(@Param('id') id: number, @Req() req){
        return this.service.delete(id, req.user.id)
    }

}