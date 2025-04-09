import { CustomersRepository } from "@/src/repository/db/customers/customers.repository";
import { SubscriptionsRepository } from "@/src/repository/db/subscriptions/subscriptions.repository";
import { Inject, Injectable } from "@nestjs/common";
import Stripe from "stripe";

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly customersRepository: CustomersRepository,
    private readonly subscriptionsRepository: SubscriptionsRepository,
    @Inject("STRIPE_API_KEY") private readonly apiKey: string,
  ) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: "2025-03-31.basil", // Use whatever API latest version
    });
  }

  async getSubscriptionFromUser(email: string) {
    const customer = await this.customersRepository.getCustomerByEmail(email);
    if (!customer) {
      return null;
    }
    const subscription =
      await this.subscriptionsRepository.getSubscriptionByCustomerId(
        customer.customerid,
      );
    return subscription;
  }

  async cancelSubscription(email: string) {
    const customer = await this.customersRepository.getCustomerByEmail(email);
    if (!customer) {
      return null;
    }
    const subscription =
      await this.subscriptionsRepository.getSubscriptionByCustomerId(
        customer.customerid,
      );
    if (!subscription) {
      return null;
    }
    const stripeSubscription = await this.stripe.subscriptions.cancel(
      subscription.subscriptionid,
    );

    await this.subscriptionsRepository.deleteSubscriptionById(
      subscription.subscriptionid,
    );
    return stripeSubscription;
  }

  async getProducts(): Promise<Stripe.Product[]> {
    const products = await this.stripe.products.list();
    return products.data;
  }

  async getCustomers() {
    const customers = await this.stripe.customers.list({});
    return customers.data;
  }
}
