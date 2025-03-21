import { Injectable } from "@nestjs/common";

import type { CreateUserDto } from "./create-user.dto";
import { SupabaseRepository } from "../../domain/supabase.repository";
import { UserRepository } from "@/src/repository/db/user/user.repository";
import { ClientPermissionRepository } from "@/src/repository/db/clientPermisions/clientPermission.repository";

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly supabaseRepository: SupabaseRepository,
    private readonly userRepository: UserRepository,
    private readonly clientPermissionsRepository: ClientPermissionRepository,
  ) {}

  async execute(
    dto: CreateUserDto,
  ): Promise<{ status: boolean; token?: string }> {
    try {
      // const res = await this.userRepository.create(dto.token);

      // console.log(res);

      const user = await this.supabaseRepository.getClientDataFromSupabase(
        dto.token,
      );

      const token = await this.userRepository.createUser({
        id: user.id,
        email: user.email!,
        avatar: user.user_metadata.avatar_url,
        name: user.user_metadata.full_name,
      });

      console.log("User created", token);

      // await this.clientPermissionsRepository.createPermissionDocument(user.id);

      // return { token: token };
      if (!token) throw new Error("Error generating token");
      return { status: true, token };
    } catch (error) {
      console.log(error);

      return { status: false };
    }
  }
}
