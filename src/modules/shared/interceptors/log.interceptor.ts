import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { FastifyRequest } from "fastify";
import { Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { LoggerService } from "../providers";
@Injectable()
export class LogInterceptor implements NestInterceptor {
  public constructor(private readonly logger: LoggerService) {}

  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<unknown> {
    const startTime = Date.now();
    const request = context.switchToHttp().getRequest<FastifyRequest>();

    const userAgent = request.headers["user-agent"] ?? "";

    return next.handle().pipe(
      map((data: unknown) => {
        const responseStatus =
          request.method === "POST" ? HttpStatus.CREATED : HttpStatus.OK;
        this.logger.info(
          `${this.getTimeDelta(startTime)}ms ${request.ip} ${responseStatus} ${request.method} ${userAgent} ${this.getUrl(request)}`,
        );
        return data;
      }),
      catchError((err: unknown) => {
        // Log fomat inspired by the Squid docs
        // See https://docs.trafficserver.apache.org/en/6.1.x/admin-guide/monitoring/logging/log-formats.en.html
        const status = this.hasStatus(err) ? err.status : "XXX";
        this.logger.error(
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-base-to-string
          `${this.getTimeDelta(startTime)}ms ${request.ip} ${status} ${request.method} ${request} ${userAgent} ${this.getUrl(request)}`,
        );
        throw err;
      }),
    );
  }

  private getTimeDelta(startTime: number): number {
    return Date.now() - startTime;
  }

  private getUrl(request: FastifyRequest): string {
    return `${request.protocol}://${request.hostname}${request.url}`;
  }

  private hasStatus(err: unknown): err is { status: number } {
    return (
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      (err as { status: number })?.status !== undefined &&
      typeof (err as { status: number }).status === "number"
    );
  }
}
