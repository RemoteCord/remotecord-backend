import { Controller, Get, Post, Req } from "@nestjs/common";
import { StripeService } from "./stripe.service";
import type { FastifyRequest } from "fastify";

@Controller("stripe")
export class StripeController {
  constructor(private stripeService: StripeService) {}

  @Get("products")
  async getProducts() {
    return await this.stripeService.getProducts();
  }

  @Get("customers")
  async getCustomers() {
    return await this.stripeService.getCustomers();
  }
  @Post("events")
  async handleEvents(@Req() request: FastifyRequest) {
    console.log("Received a new event", request.body);
  }
}
