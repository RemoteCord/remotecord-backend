import { IsNotEmpty, IsString } from "class-validator";

export class GetExplorerFromClientDto {
  @IsString()
  @IsNotEmpty()
  folder!: string;

  @IsString()
  @IsNotEmpty()
  relativepath!: string;
}
