import { Injectable } from "@nestjs/common";
import { FileRequest } from "../../ws-client/types/tasks.type";
import { Cron } from "@nestjs/schedule";
import { LoggerService } from "../../shared/providers";
import { diffSeconds } from "@formkit/tempo";
import { ConfigService } from "@nestjs/config";
import { Configuration } from "@/src/config/env.enum";

type FileResult = {
  file: FileRequest;
  timestamp: string;
  controllerid: string;
};

type FileMap = Map<string, FileResult>;

@Injectable()
export class FileRepository {
  files = new Map() as FileMap;

  filesToken = new Map() as Map<string, string>;

  constructor(
    private readonly logger: LoggerService,
    private readonly configService: ConfigService,
  ) {}

  @Cron("0 * * * * *") // Every minute at second 0
  handleCronJobsFiles() {
    const fileDuration = this.configService.get<number>(
      Configuration.FILES_DURATION,
      60,
    );

    this.logger.info("Running files cronjob");
    const now = new Date().toISOString();
    this.files.entries().forEach(([key, value]) => {
      const diff = diffSeconds(now, value.timestamp);
      console.log(key, value, diff);
      if (diff > fileDuration) {
        this.deleteFile(key);
      }
    });
  }
  async addFile(token: string, controllerid: string, data: FileRequest) {
    if (this.files.has(token)) {
      this.files.delete(token);
    }

    const date = new Date().toISOString();

    // console.log(token, data);
    this.files.set(token, {
      file: data,
      controllerid,
      timestamp: date,
    });

    // console.log(this.files);
  }

  getFile(token: string) {
    // console.log(this.files);
    const file = this.files.get(token);

    if (!file) {
      throw new Error("File not found");
    }

    this.filesToken.delete(token);

    return file;
  }

  async deleteFile(token: string) {
    this.files.delete(token);
  }

  addTokenForFile(clientid: string, token: string) {
    this.filesToken.set(clientid, token);
  }

  getTokenForFile(clientid: string) {
    const token = this.filesToken.get(clientid);
    console.log(token);
    return token;
  }
}
