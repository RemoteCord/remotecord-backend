import { BadRequestException, Controller, Get, Param, Res } from "@nestjs/common";
import { PublicService } from "../application/public.service";
import type { DownloadAppResponse, PlatformsKeys } from "../types/download";
import type { FastifyReply } from "fastify";
import { Readable } from "stream";

@Controller("public")
export class PublicController {
  constructor(private readonly publicService: PublicService) { }

  @Get("stats")
  async getStats() {
    const data = await this.publicService.getStats();
    return data
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

  @Get("download")
  async getDownloadLinks() {
    return await this.publicService.getDownloadEndpoints();

  }

  @Get("download/:platform")
  async downloadAppList(@Param("platform") platform: PlatformsKeys,
    @Res({ passthrough: true }) reply: FastifyReply) {
    if (!platform) {
      return await this.publicService.getDownloadEndpoints();
    }
    console.log("platform", platform);
    const url = await this.publicService.getDownloadPlattform(platform);
    if (!url) throw new BadRequestException('Missing URL');

    try {
      const url_split = url.split('/')
      const filename = url_split[url_split.length - 1]
      console.log("url", url);
      const response = await fetch(url);

      if (!response.ok || !response.body) {
        throw new Error(`Fetch failed: ${response.status}`);
      }

      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      const contentDisposition = 'inline';

      // Set headers for Fastify response
      reply.header('Content-Type', contentType);
      reply.header('Content-Disposition', contentDisposition);
      reply.header('Content-Disposition', `attachment; filename="${filename}"`);

      // Pipe the web ReadableStream to Node.js Readable and send
      const nodeStream = Readable.fromWeb(response.body as any); // Node 18+ required

      return reply.send(nodeStream);
    } catch (err) {
      console.error(err);
      reply.status(500).send('Error streaming file');
    }
  }


}
