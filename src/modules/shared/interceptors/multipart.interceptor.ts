import { Observable } from "rxjs";
import {
  CallHandler,
  ExecutionContext,
  HttpException,
  HttpStatus,
  mixin,
  NestInterceptor,
  Type,
} from "@nestjs/common";
import * as fastify from "fastify";
import { MultipartValue } from "@fastify/multipart";
import {
  getFileFromPart,
  MultipartOptions,
  validateFile,
} from "@/src/utils/file.util";

export function MultipartInterceptor(
  options: MultipartOptions = {},
): Type<NestInterceptor> {
  class MixinInterceptor implements NestInterceptor {
    async intercept(
      context: ExecutionContext,
      next: CallHandler,
    ): Promise<Observable<any>> {
      const req = context.switchToHttp().getRequest<fastify.FastifyRequest>();
      console.log("req");
      if (!req.isMultipart()) {
        console.error("The request should be a form-data");
        throw new HttpException(
          { message: "The request should be a form-data", statusCode: 400 },
          HttpStatus.BAD_REQUEST,
        );
      }

      const files: Record<string, any[]> = {};
      const body: Record<string, any> = {};

      try {
        for await (const part of req.parts()) {
          if (part.type !== "file") {
            body[part.fieldname] = (part as MultipartValue).value;
            continue;
          }

          console.log("part", part);

          const file = await getFileFromPart(part);

          const validationResult = validateFile(file, options);

          if (validationResult) {
            throw new HttpException(
              { message: validationResult, statusCode: 422 },
              HttpStatus.UNPROCESSABLE_ENTITY,
            );
          }

          files[part.fieldname] = files[part.fieldname] || [];
          files[part.fieldname].push(file);
        }

        req.storedFiles = files;
        req.body = body;
      } catch (error) {
        console.error("Error processing files", error);
        throw new HttpException(
          {
            message: "Error processing files",
            error: error instanceof Error ? error.message : "Unknown error",
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return next.handle();
    }
  }

  return mixin(MixinInterceptor);
}
