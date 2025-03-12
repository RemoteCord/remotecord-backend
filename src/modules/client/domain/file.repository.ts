import { Injectable } from "@nestjs/common";
import { FileRequest } from "../../ws-client/types/tasks.type";
import { Cron } from "@nestjs/schedule";
import { LoggerService } from "../../shared/providers";
import { diffSeconds } from "@formkit/tempo";
import { ConfigService } from "@nestjs/config";
import { Configuration } from "@/src/config/env.enum";
import { deleteFile, getFile } from "../../shared/helpers/file.helpers";

type FileResult = {
  path: string;
  timestamp: string;
  controllerid: string;
  metadata: {
    filename: string;
    size: number;
    format: string;
  };
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

  @Cron("* * * * * *") // Every minute at second 0
  handleCronJobsFiles() {
    const fileDuration = this.configService.get<number>(
      Configuration.FILES_DURATION,
      60,
    );

    this.logger.info("Running files cronjob");
    const now = new Date().toISOString();
    this.files.entries().forEach(async ([key, value]) => {
      const diff = diffSeconds(now, value.timestamp);
      console.log(key, value, diff);
      if (diff > fileDuration) {
        const fullFile = `${key}.${value.metadata.filename.split(".")[1]}`;
        await this.deleteFile(fullFile);
        this.files.delete(key);
      }
    });
  }

  addFile(
    token: string,
    controllerid: string,
    path: string,
    metadata: {
      filename: string;
      size: number;
      format: string;
    },
  ) {
    if (this.files.has(token)) {
      this.files.delete(token);
    }

    const date = new Date().toISOString();

    // console.log(token, data);
    this.files.set(token, {
      path,
      controllerid,
      timestamp: date,
      metadata,
    });

    // console.log(this.files);
  }

  async getFile(token: string): Promise<{
    buffer: string | Buffer;
    file: FileResult;
  }> {
    // console.log(this.files);
    const file = this.files.get(token);

    if (!file) {
      throw new Error("File not found");
    }

    // console.log(file);

    this.filesToken.delete(token);

    const extFile = file.metadata.filename.split(".")[1];
    const fullFile = `${token}.${extFile}`;

    const fileBuffer = await getFile(fullFile);

    return {
      buffer: fileBuffer,
      file,
    };
  }

  async deleteFile(file: string) {
    await deleteFile(file);
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
