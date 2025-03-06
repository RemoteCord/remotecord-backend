import { Configuration } from "@/src/config/env.enum";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { LoggerService } from "../../shared/providers";
import { ClientDataEncryptUseCase } from "../../ws-client/application/client-data-encrypt.use-case";
import { UserRepository } from "@/src/repository/user/user.repository";

@Injectable()
export class SupabaseRepository {
  private supabaseClient: SupabaseClient | undefined;

  constructor(
    private readonly configService: ConfigService,
    private logger: LoggerService,
    private readonly clientEncrypt: ClientDataEncryptUseCase,
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

  async generateClient(token: string) {
    if (!this.supabaseClient) return;
    const { data, error } = await this.supabaseClient.auth.getUser(token);
    //   console.log('data:', data);
    if (error) throw error;

    const { user } = data;
    this.logger.info("User:", JSON.stringify(user));

    const encryptToken = this.clientEncrypt.encrypt(user.id);

    await this.userRepository.createUser({
      id: user.id,
      email: user.email!,
      avatar: user.user_metadata.avatar_url,
      name: user.user_metadata.full_name,
    });

    this.logger.info("Encrypted token:", encryptToken);
    return encryptToken;
  }
}
