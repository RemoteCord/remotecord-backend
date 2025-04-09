import { SubscriptionsRepository } from "@/src/repository/db/subscriptions/subscriptions.repository";
import { Controller, Inject, Post, Req, Res } from "@nestjs/common";
import type { FastifyRequest, FastifyReply } from "fastify";
import Stripe from "stripe";
// import { manageSubscriptionStatusChange } from "./stripe.service";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

@Controller("stripe/webhook")
export class WebhookController {
  private stripe: Stripe;

  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
    @Inject("STRIPE_API_KEY") private readonly apiKey: string,
  ) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: "2025-03-31.basil", // Use whatever API latest version
    });
  }
  @Post()
  async handleWebhook(@Req() req: FastifyRequest, @Res() res: FastifyReply) {
    // console.log("Received a new event", req.body);
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    console.log("sig", sig, webhookSecret);

    try {
      if (!sig || !webhookSecret) {
        return res.status(400).send("Webhook secret not found.");
      }

      // Access the raw body from Fastify's request (requires @fastify/raw-body plugin)
      const rawBody = (req as any).rawBody || (req as any).body?.raw;
      console.log("rawBody", rawBody);
      if (!rawBody) {
        return res.status(400).send("Missing raw request body.");
      }

      event = this.stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
      console.log(`Webhook received: ${event.type}`);
    } catch (error) {
      console.error(
        `Webhook Error:${error instanceof Error ? error.message : String(error)}`,
      );
      return res
        .status(400)
        .send(
          `Webhook Error: ${error instanceof Error ? error.message : String(error)}`,
        );
    }

    if (relevantEvents.has(event.type)) {
      try {
        switch (event.type) {
          case "customer.subscription.created":
            const subscriptionCreated = event.data
              .object as Stripe.Subscription;

            console.log(
              `Subscription created: ${subscriptionCreated.id} for customer ${subscriptionCreated.customer}`,
            );

            await this.subscriptionsRepository.createSubscription({
              customerid: subscriptionCreated.customer as string,
              subscriptionid: subscriptionCreated.id,
            });

            break;
          case "customer.subscription.updated":
          case "customer.subscription.deleted":
            const subscription = event.data.object as Stripe.Subscription;
            // await manageSubscriptionStatusChange(
            //   subscription.id,
            //   subscription.customer as string,
            //   event.type === "customer.subscription.created",
            // );

            console.log(
              `Subscription ${event.type}: ${subscription.id} for customer ${subscription.customer}`,
            );

            break;
          case "checkout.session.completed":
            const session = event.data.object as Stripe.Checkout.Session;
            if (session.mode === "subscription") {
              const subscriptionId = session.subscription as string;
              console.log(
                `Checkout session completed for subscription: ${subscriptionId}`,
              );
              //   await manageSubscriptionStatusChange(
              //     subscriptionId,
              //     session.customer as string,
              //     true,
              //   );
            }
            break;
          default:
            console.warn(`Unhandled event type: ${event.type}`);
        }
      } catch (error) {
        console.error(
          `Webhook handler error: ${error instanceof Error ? error.message : String(error)}`,
        );
        return res.status(400).send("Webhook handler failed.");
      }
    } else {
      console.warn(`Ignored event type: ${event.type}`);
    }

    res.status(200).send({ received: true });
  }
}
