import { Configuration } from "@/src/config/env.enum";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient, User } from "@supabase/supabase-js";
import { LoggerService } from "../../shared/providers";
import { ClientDataEncryptUseCase } from "../application/client-data-encrypt.use-case";
import { UserRepository } from "@/src/repository/db/user/user.repository";

@Injectable()
export class SupabaseRepository {
  private supabaseClient: SupabaseClient | undefined;

  constructor(
    private readonly configService: ConfigService,
    private logger: LoggerService,
    private readonly userRepository: UserRepository,
  ) {
    const SUPABASE_URL = this.configService.get<string>(
      Configuration.SUPABASE_URL,
    )!;
    const SUPABASE_KEY = this.configService.get<string>(
      Configuration.SUPABASE_KEY,
    )!;

    this.supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        flowType: "pkce",
      },
    });
  }

  async getClientDataFromSupabase(token: string) {
    try {
      if (!this.supabaseClient)
        throw new Error("Supabase client not initialized");
      const { data, error } = await this.supabaseClient.auth.getUser(token);
      //   console.log('data:', data);
      if (error) throw error;

      const { user } = data;
      this.logger.info("User:", JSON.stringify(user));

      return user;
    } catch (error) {
      // console.error("Error getting user data from Supabase:", error);
      throw new Error("Error getting user data from Supabase");
    }
  }
}
