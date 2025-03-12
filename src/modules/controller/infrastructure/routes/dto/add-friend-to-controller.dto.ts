import { IsNotEmpty, IsString } from "class-validator";

export class AddFriendToControllerDto {
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
