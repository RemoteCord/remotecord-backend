import { IsNotEmpty, IsString } from "class-validator";

export class FileUploadorDto {
  @IsString()
  @IsNotEmpty()
  tokenFile!: string;
}
