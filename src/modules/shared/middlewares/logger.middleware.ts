import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import type { FastifyRequest, FastifyReply, } from 'fastify';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    private logger = new Logger("LoggerMiddleware");
    use(req: FastifyRequest, res: FastifyReply, next: () => void) {
        this.logger.debug(` ${req.method} ${req.url} ${req.ip}`);
        next();
    }
}