import { FileMetadata } from "@/src/modules/client/types/file.types";
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

export class UploadLargeCallbackDto {
  @IsString()
  @IsNotEmpty()
  fileurl!: string;
  @IsString()
  @IsNotEmpty()
  controllerid!: string;

  metadata!: FileMetadata;
}
