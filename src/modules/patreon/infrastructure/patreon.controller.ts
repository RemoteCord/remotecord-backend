import { Body, Controller, Logger, Post, Query, Req, UnauthorizedException } from '@nestjs/common';
import { PatreonService } from '../application/patreon.service';
import type { FastifyRequest } from 'fastify';
import type { PatreonWebhookResponse } from '../types/patreon-webhook';

const secretValue = "0210412042"
type PatreonEvents = "members:delete" | "members:create"


@Controller('patreon')
export class PatreonController {
  private logger = new Logger("PatreonController");
  constructor(private readonly patreonService: PatreonService) { }

  @Post("subscription")
  async handleSubscription(@Body() body: PatreonWebhookResponse, @Query("secret") secret: string, @Req() req: FastifyRequest) {
    if (secret !== secretValue) throw new UnauthorizedException("invalid secret");
    const event = req.headers["x-patreon-event"] as PatreonEvents;

    if (event === "members:create") {
      this.logger.log("Received subscription create event from Patreon");

    } else if (event === "members:delete") {
      this.logger.log("Received subscription delete event from Patreon");

    } else {
      this.logger.log("Received unknown event from Patreon", event);
      throw new UnauthorizedException("invalid event type");

    }


    // console.log(JSON.stringify(body,), req.headers)

  }

}
