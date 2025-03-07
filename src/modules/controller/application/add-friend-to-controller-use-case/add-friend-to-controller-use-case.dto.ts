import { IsNotEmpty, IsString } from "class-validator";

export class AddFriendToControllerDto {
  controllerid!: string;

  clientid!: string;
}
