import {
  Controller,
  Post,
  Body,
  Req,
  Inject,
  UseGuards,
  Get,
} from "@nestjs/common";
import type { FastifyRequest } from "fastify";
import Stripe from "stripe";
import { AuthGuard } from "../auth/infrastructure/auth.guard";
import { SubscriptionsRepository } from "@/src/repository/db/subscriptions/subscriptions.repository";
import { CustomersRepository } from "@/src/repository/db/customers/customers.repository";
import { StripeService } from "./stripe.service";

@Controller("stripe/checkout")
export class CheckoutController {
  private stripe: Stripe;

  constructor(
    @Inject("STRIPE_API_KEY") private readonly apiKey: string,
    // private readonly redisRepository: RedisRepository,
    private readonly customersRepository: CustomersRepository,
    private readonly stripeService: StripeService,
  ) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: "2025-03-31.basil", // Use whatever API latest version
    });
  }

  @UseGuards(AuthGuard)
  @Get("subscription")
  async getSubscription(@Req() req: FastifyRequest) {
    const email = req.headers["email"] as string;

    return await this.stripeService.getSubscriptionFromUser(email);
  }

  @UseGuards(AuthGuard)
  @Post("cancel")
  async cancelSubscription(@Req() req: FastifyRequest) {
    const email = req.headers["email"] as string;

    return await this.stripeService.cancelSubscription(email);
  }

  @UseGuards(AuthGuard)
  @Post()
  async createCheckoutSession(
    @Req() req: FastifyRequest,
    // @Body() { priceId }: { priceId: string },
  ) {
    const clientId = req.headers["clientid"] as string;
    const email = req.headers["email"] as string;
    // const userId = req.user.id; // Assuming `req.user` is populated by auth middleware
    // const user = await prisma.users.findUnique({
    //   where: { id: userId },
    //   select: { email: true },
    // });
    console.log("clientId", clientId);
    if (!clientId || !email) {
      throw new Error("User not found.");
    }
    // const customer = await prisma.customers.findUnique({ where: { userId } });
    let customer = await this.customersRepository.getCustomerByEmail(email);

    if (!customer) {
      const stripeCustomer = await this.stripe.customers.create({
        email,
      });

      customer = await this.customersRepository.createCustomer({
        email,
        customerid: stripeCustomer.id,
      });
    }

    //   customer = await prisma.customers.create({
    //     data: {
    //       userId,
    //       customerId: stripeCustomer.id,
    //     },
    //   });
    // }
    const session = await this.stripe.checkout.sessions.create({
      customer: customer.customerid,
      customer_update: { address: "auto" },
      line_items: [
        {
          price: "price_1RBYSzPBIvlrSznlqXpB10if", // Replace with your price ID
          quantity: 1,
        },
      ],
      mode: "subscription",
      cancel_url: `http://localhost:3007/subscribe?checkout=cancel`,
      success_url: `http://localhost:3007/subscribe?checkout=success`,
    });
    return { sessionId: session.id };
  }
}
