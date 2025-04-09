import { DynamicModule, forwardRef, Module } from "@nestjs/common";
import { StripeController } from "./stripe.controller";
import { StripeService } from "./stripe.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { WebhookController } from "./stripe-webhook.controller";
import { CheckoutController } from "./stripe-checkout.controller";
import { AuthModule } from "../auth/auth.module";
import { SchemasModule } from "@/src/repository/db/schemas.module";

@Module({
  imports: [AuthModule, SchemasModule],
})
export class StripeModule {
  static forRootAsync(): DynamicModule {
    return {
      module: StripeModule,
      controllers: [StripeController, WebhookController, CheckoutController],
      imports: [ConfigModule.forRoot(), AuthModule, SchemasModule],
      providers: [
        StripeService,
        {
          provide: "STRIPE_API_KEY",
          useFactory: async (configService: ConfigService) =>
            configService.get("STRIPE_API_KEY"),
          inject: [ConfigService],
        },
      ],
    };
  }
}
