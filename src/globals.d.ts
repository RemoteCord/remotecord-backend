declare namespace Storage {
  interface MultipartFile {
    buffer: Buffer;
    filename: string;
    size: number;
    mimetype: string;
    fieldname: string;
  }
}

declare module "fastify" {
  interface FastifyRequest {
    protocol: any;
    url: string;
    hostname: string;
    ip: string;
    method: string;
    headers: Record<"identifier" | string, any>;
    storedFiles: Record<string, Storage.MultipartFile[]>;
    body: unknown;
  }
}

declare module "redis-commander" {
  export type RedisKey = RedisCategories;
}

namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
  }
}
