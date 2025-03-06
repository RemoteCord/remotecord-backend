import { Injectable } from "@nestjs/common";

import { UserRepository } from "../../infrastructure/user.repository";
import { CreateUserDto } from "./create-user.dto";

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(dto: CreateUserDto): Promise<{ message: string }> {
    try {
      await this.userRepository.create(dto);
      return { message: "User created" };
    } catch (error) {
      console.log(error);
      return { message: "User alreay exist" };
    }
  }
}
