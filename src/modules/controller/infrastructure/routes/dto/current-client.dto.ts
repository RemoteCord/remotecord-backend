import { IsNotEmpty, IsString } from "class-validator";

export class SelectCurrentClientDto {
  @IsString()
  @IsNotEmpty()
  clientid!: string;
}
