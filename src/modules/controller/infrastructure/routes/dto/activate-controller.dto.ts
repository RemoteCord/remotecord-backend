import { IsNotEmpty, IsString } from "class-validator";

export class ActivateControllerDto {
  @IsString()
  @IsNotEmpty()
  picture!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;
}
