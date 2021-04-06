import { 
    utilities as nestWinstoModuleUtilities,
    WinstonModuleOptions 
} from "nest-winston";
import * as winston from "winston";

export const winsonConfig: WinstonModuleOptions = {
    levels: winston.config.npm.levels,
    level: 'verbose',
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.timestamp(),
                nestWinstoModuleUtilities.format.nestLike(),
            ),
        }),
        new winston.transports.File({
            level: 'verbose',
            filename: 'applcation.log',
            dirname: 'logs'
        }),
    ],
};