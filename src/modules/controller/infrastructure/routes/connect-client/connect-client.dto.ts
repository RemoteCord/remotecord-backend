import { IsNotEmpty, IsString } from "class-validator";

export class ConnectClientDto {
  @IsString()
  @IsNotEmpty()
  clientid!: string;

  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  avatar!: string;
}
