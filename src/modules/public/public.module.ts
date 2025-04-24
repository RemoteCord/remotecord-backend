import { Module } from "@nestjs/common";
import { PublicController } from "./infrastructure/public.controller";
import { PublicService } from "./application/public.service";
import { SchemasModule } from "@/src/repository/db/schemas.module";

@Module({
  controllers: [PublicController],
  providers: [PublicService],
  imports: [SchemasModule],
  exports: [PublicService],
})
export class PublicModule { }
