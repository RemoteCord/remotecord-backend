import { CommandsLogsRepository } from "@/src/repository/db/commands/commands-log.repository";
import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable, StreamableFile } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import Redis from "ioredis";
import type { DownloadAppResponse, DownloadValues, Platforms, PlatformsKeys, PlatformsRedis } from "../types/download";
import { createReadStream } from "fs";

@Injectable()
export class PublicService {
  constructor(
    private readonly redisRepository: RedisRepository,
    private readonly controllerRepository: ControllerRepository,
    private readonly commandsLogsRepository: CommandsLogsRepository,
  ) { }

  @Interval(10000)
  async fetchWsConnections() {
    // this.redis.hset("ws-application-id", "users", 0);
    const connections = await this.controllerRepository.getAllActiveClients();
    const clientsNum = await this.redisRepository.HLEN(["client-data"]);

    const numCommands = await this.commandsLogsRepository.countCommands();

    // console.log("wsConnections", clientsNum);
    if (!connections) {
      this.redisRepository.HSET(["stats"], {
        users: 0,
        clients: 0,
        commands: numCommands,
      });
      return;
    }

    this.redisRepository.HSET(["stats"], {
      connections: Object.keys(connections).length,
      clients: clientsNum,
      commands: numCommands,
    });
  }

  @Interval(10000)
  async fetchDownloadEndpoints() {
    try {
      const endpoints = await fetch("https://github.com/remotecord/remotecord-app/releases/latest/download/latest.json")
        .then(async (res) => await res.json()) as DownloadAppResponse;

      // console.log("endpoints", endpoints);
      const platformKeys = Object.keys(endpoints.platforms);
      const downloads = Object.entries(endpoints.platforms).reduce((acc, [key, value]) => {
        // console.log(key, value);
        acc[key] = value.url;
        return acc;
      }, {} as Record<string, string>);

      await this.redisRepository.HSET(["app"], {
        downloads: JSON.stringify(downloads),
        platforms: JSON.stringify(platformKeys),
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error fetching download endpoints", error.message);
      } else {
        console.error("Error fetching download endpoints", error);
      }
    }
  }

  async getWsConnections() {
    const stats = await this.redisRepository.HGETALL<{
      users: number;
    } | null>(["stats"]);

    if (!stats) {
      return { users: 0 };
    }

    return stats;
  }

  async getDownloadEndpoints() {
    const values = await this.redisRepository.HGETALL<{
      downloads: string;
      platforms: string;
    } | null>(["app"]);

    if (!values) {
      return { downloads: {}, plattformKeys: [] };
    }

    return {
      downloads: JSON.parse(values.downloads),
      plattformKeys: JSON.parse(values.platforms),
    };
  }

  async getDownloadPlattform(plattform: PlatformsKeys) {
    const values = await this.redisRepository.HGETALL<{
      downloads: string;
      platforms: string;
    } | null>(["app"]);

    if (!values) {
      return null;
    }

    const downloads = JSON.parse(values.downloads) as PlatformsRedis;
    const plattformKeys = JSON.parse(values.platforms) as PlatformsKeys[];

    if (!plattformKeys.includes(plattform)) {
      return null;
    }

    const valuePlatform = downloads[plattform];

    return valuePlatform
  }
}
