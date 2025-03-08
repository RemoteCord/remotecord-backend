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
    headers: any;
    storedFiles: Record<string, Storage.MultipartFile[]>;
    body: unknown;
  }
}

namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
  }
}
