import { IsNotEmpty, IsString } from "class-validator";

export class ActivateControllerDto {
  @IsString()
  @IsNotEmpty()
  controllerid!: string;
}
