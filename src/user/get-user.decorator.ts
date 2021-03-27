import { createParamDecorator } from "@nestjs/common";
import { User } from "./user.entity";

export const getuser = createParamDecorator(
    (data, req): User => {
        const user = req.args[0].user;
        return user;
    }
)