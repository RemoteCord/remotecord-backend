import { Injectable } from "@nestjs/common";

import type { CreateUserDto } from "./create-user.dto";
import { SupabaseRepository } from "../../domain/supabase.repository";
import { UserRepository } from "@/src/repository/db/user/user.repository";
import { ClientPermissionRepository } from "@/src/repository/db/clientPermisions/clientPermission.repository";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly supabaseRepository: SupabaseRepository,
    private readonly userRepository: UserRepository,
    private readonly clientPermissionsRepository: ClientPermissionRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: {
    name: string;
    email: string;
    picture: string;
    clientid: string;
  }): Promise<{ status: boolean; token?: string }> {
    try {
      // const res = await this.userRepository.create(dto.token);

      // console.log(res);

      // const decoded = this.jwtService.decode(dto.token);

      // console.log("Decoded token", decoded);

      // const user = await this.supabaseRepository.getClientDataFromSupabase(
      //   dto.token,
      // );

      console.log("User data", dto);

      const token = await this.userRepository.createUser({
        id: dto.clientid,
        email: dto.email!,
        avatar: dto.picture,
        name: dto.name,
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
