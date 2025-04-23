import { Module } from '@nestjs/common';
import { PatreonService } from './application/patreon.service';
import { PatreonController } from './infrastructure/patreon.controller';
import { SchemasModule } from '@/src/repository/db/schemas.module';

@Module({
  controllers: [PatreonController],
  providers: [PatreonService],
  imports: [SchemasModule]
})
export class PatreonModule { }
