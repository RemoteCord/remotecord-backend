import { Injectable } from "@nestjs/common";

import { CreateUserDto } from "./create-user.dto";
import { SupabaseRepository } from "../../domain/supabase.repository";

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly supabaseRepository: SupabaseRepository) {}

  async execute(
    dto: CreateUserDto,
  ): Promise<{ status: boolean; token?: string }> {
    try {
      // const res = await this.userRepository.create(dto.token);

      // console.log(res);

      const token = await this.supabaseRepository.generateClient(dto.token);
      // return { token: token };
      if (!token) throw new Error("Error generating token");
      return { status: true, token };
    } catch (error) {
      console.log(error);
      return { status: false };
    }
  }
}
