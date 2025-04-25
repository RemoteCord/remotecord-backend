import { CommandsLogsRepository } from "@/src/repository/db/commands/commands-log.repository";
import { ControllerRepository } from "@/src/repository/db/controller/controller.repository";
import { RedisRepository } from "@/src/repository/redis/domain/redis.repository";
import { InjectRedis } from "@nestjs-modules/ioredis";
import { Injectable, StreamableFile } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import Redis from "ioredis";
import type { DownloadAppResponse, DownloadValues, Platforms, PlatformsKeys, PlatformsRedis } from "../types/download";
import { createReadStream } from "fs";
import { ConfigService } from "@nestjs/config";
import axios from "axios";
import { Configuration } from "@/src/config/env.enum";
import type { PosthogWebResult } from "../types/posthog";
import cluster from "cluster";

@Injectable()
export class PublicService {
  constructor(
    private readonly redisRepository: RedisRepository,
    private readonly controllerRepository: ControllerRepository,
    private readonly commandsLogsRepository: CommandsLogsRepository,
    private readonly configService: ConfigService,
  ) { }

  async fetchPosthogWebResults() {



    const posthog_project_url = this.configService.get(Configuration.POSTHOG_PROJECT_URL) as string;
    const posthog_api_key = this.configService.get(Configuration.POSTHOG_API_KEY) as string;

    const res = (await axios.post(`${posthog_project_url}/query`,
      {
        "query": {
          "kind": "WebOverviewQuery",
          "properties": [
            {
              "key": "$host",
              "value": "remotecord.app",
              "operator": "exact",
              "type": "event"
            }
          ],
          "dateRange": {
            "date_from": "all",
            "date_to": null
          },
          "sampling": {
            "enabled": false,
            "forceSamplingRate": {
              "numerator": 1,
              "denominator": 10
            }
          },
          "compareFilter": {
            "compare": true
          },
          "filterTestAccounts": false,
          "conversionGoal": null,
          "includeRevenue": true
        },
        "client_query_id": "e18d5e50-9ccc-4c49-8eeb-ee39f59f2090",
        "refresh": "blocking"
      },
      {
        headers: {
          Authorization: `Bearer ${posthog_api_key}`,
          "Content-Type": "application/json",
        }
      }
    )).data as PosthogWebResult
    const formattedResults = res.results.reduce((acc, result) => {
      acc[result.key] = result.value;

      return acc;
    }, {} as Record<string, number | null>);
    return formattedResults
  }


  @Interval(10000)
  async fetchStats(limitCluster = true) {
    if (!cluster.worker || cluster.worker.id !== 1 && limitCluster) return

    // console.log("CLUSTER", cluster.worker?.id, process.pid);
    // this.redis.hset("ws-application-id", "users", 0);
    const connections = await this.controllerRepository.getAllActiveClients();
    const clientsNum = await this.redisRepository.HLEN(["client-data"]);

    const numCommands = await this.commandsLogsRepository.countCommands();

    const posthog_web_results = await this.fetchPosthogWebResults();

    // console.log("posthog_web_results", posthog_web_results);

    // console.log("wsConnections", clientsNum);
    if (!connections) {
      this.redisRepository.HSET(["stats"], {
        users: 0,
        clients: 0,
        commands: numCommands,
        web_analytics: JSON.stringify(posthog_web_results),
      });
      return;
    }

    const data = {
      connections: Object.keys(connections).length,

      clients: clientsNum,
      commands: numCommands,
      web_analytics: posthog_web_results,
    }



    this.redisRepository.HSET(["stats"], data);

    return data
  }

  @Interval(1000000)
  async fetchDownloadEndpoints() {
    if (!cluster.worker || cluster.worker.id !== 1) return

    // console.log("CLUSTER", cluster.worker?.id, process.pid);
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
        version: endpoints.version,
        downloads: JSON.stringify(downloads),
        platforms: JSON.stringify(platformKeys),
      });
    } catch (error) {

    }
  }

  async getStats() {
    const stats = await this.redisRepository.HGETALL<{
      users: number;
      clients: number;
      commands: number;
    } | null>(["stats"]);

    if (!stats) {
      return { users: 0 };
    }

    return {
      users: stats.users,
      clients: stats.clients,
      commands: stats.commands,
    };
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
