import { FileMetadata } from "@/src/modules/client/domain/file.repository";
import { IsNotEmpty, IsString } from "class-validator";

export class DecodeTokenDto {
  @IsString()
  @IsNotEmpty()
  token!: string;
}

export class UploadCallbackDto {
  @IsString()
  @IsNotEmpty()
  fileurl!: string;
  @IsString()
  @IsNotEmpty()
  clientid!: string;

  metadata!: FileMetadata;
}
