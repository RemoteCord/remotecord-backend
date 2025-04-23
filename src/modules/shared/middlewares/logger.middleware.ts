import { Injectable, NestMiddleware } from '@nestjs/common';
import type { FastifyRequest, FastifyReply, } from 'fastify';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: FastifyRequest, res: FastifyReply, next: () => void) {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${req.ip}`);
        next();
    }
}