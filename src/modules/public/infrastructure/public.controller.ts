import { Controller, Get } from "@nestjs/common";
import { PublicService } from "../application/public.service";

@Controller("public")
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get("stats")
  async getStats() {
    return await this.publicService.getWsConnections();
  }

  @Get("info")
  getInfo() {
    return {
      status: "ok",
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      version: process.version,
      platform: process.platform,
      arch: process.arch,
    };
  }
}
