import { RequestMethod } from "@nestjs/common"

const routes = [
    {
        path: "/user/me",
        method: RequestMethod.PATCH
    },
    {
        path: "/user",
        method: RequestMethod.DELETE
    },
    {
        path: "/user/me",
        method: RequestMethod.GET
    },
    {
        path: "/task",
        method: RequestMethod.GET
    },
    {
        path: "/task/:id",
        method: RequestMethod.GET
    },
    {
        path: "/task/create",
        method: RequestMethod.POST
    },
    {
        path: "/task/:id",
        method: RequestMethod.PATCH
    },
    {
        path: "/task/:id",
        method: RequestMethod.DELETE
    }
]

// {
//     path: "/",
//     method: ""
// }

export default routes