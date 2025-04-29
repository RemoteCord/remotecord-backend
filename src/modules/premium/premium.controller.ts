import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { PremiumService } from './premium.service';
import type { FastifyRequest } from 'fastify';
import { ConfigService } from '@nestjs/config';
import { Configuration } from '@/src/config/env.enum';

@Controller('premium')
export class PremiumController {
  constructor(private readonly premiumService: PremiumService, private readonly configService: ConfigService) { }

  @Post('checkout')
  async checkout(@Body() body: any, @Req() req: FastifyRequest) {


    console.log('checkout', body, req.headers);
    return {
      id: body.id
    }

  }

  @Get("indent")
  async getIndent(@Req() req: FastifyRequest) {

  }
}
