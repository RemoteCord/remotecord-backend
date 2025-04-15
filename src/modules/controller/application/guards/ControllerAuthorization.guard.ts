import { Configuration } from "@/src/config/env.enum";
import { CanActivate, Injectable, Logger, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { FastifyRequest } from "fastify";

@Injectable()
export class ControllerAuthorizationGuard implements CanActivate {
    private logger = new Logger("ControllerAuthorizationGuard");
    constructor(private readonly configService: ConfigService) { }

    async canActivate(context: any): Promise<boolean> {
        const request: FastifyRequest = context.switchToHttp().getRequest();


        const token = request.headers["authorization"];

        if (!token) throw new UnauthorizedException()


        const secret = this.configService.get(Configuration.SECRET)
        console.log("token", token, secret);

        if (!token === secret) throw new UnauthorizedException()

        this.logger.log("Passed ControllerAuthorizationGuard");

        return true
    }
}