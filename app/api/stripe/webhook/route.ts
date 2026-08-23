import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getCampaignSession } from "@/lib/session/campaign";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

export async function POST(request: Request) {
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error(
      "STRIPE_WEBHOOK_SECRET is not configured."
    );

    return NextResponse.json(
      {
        error:
          "Stripe webhook secret is not configured.",
      },
      { status: 500 }
    );
  }

  /*
   * Stripe requires the raw request body for
   * webhook signature verification.
   */
  const payload = await request.text();

  const signature =
    request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      {
        error:
          "Missing Stripe webhook signature.",
      },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error(
      "Stripe webhook signature verification failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Invalid Stripe webhook signature.",
      },
      { status: 400 }
    );
  }

  try {
    /*
     * Handle the Stripe events that matter for the
     * VidStandMedia campaign management subscription.
     */
    switch (event.type) {
      /*
       * Checkout has successfully completed.
       *
       * This is useful as an additional server-side
       * confirmation that the customer completed checkout.
       */
      case "checkout.session.completed": {
        const checkoutSession =
          event.data.object as Stripe.Checkout.Session;

        const campaignSession =
          await getCampaignSession();

        const campaign =
          campaignSession.campaign;

        campaign.payment.stripeCheckoutSessionId =
          checkoutSession.id;

        /*
         * Save the Stripe Customer ID.
         */
        if (
          typeof checkoutSession.customer ===
          "string"
        ) {
          campaign.payment.stripeCustomerId =
            checkoutSession.customer;
        }

        /*
         * Save the Stripe Subscription ID.
         */
        if (
          typeof checkoutSession.subscription ===
          "string"
        ) {
          campaign.payment.stripeSubscriptionId =
            checkoutSession.subscription;
        }

        /*
         * A completed subscription checkout means
         * Stripe has successfully completed checkout.
         */
        if (
          checkoutSession.payment_status ===
          "paid"
        ) {
          campaign.payment.paymentStatus =
            "paid";

          if (!campaign.payment.paidAt) {
            campaign.payment.paidAt =
              new Date().toISOString();
          }
        }

        await campaignSession.save();

        console.log(
          "Stripe checkout.session.completed:",
          checkoutSession.id
        );

        break;
      }

      /*
       * Stripe creates/updates the recurring
       * subscription.
       */
      case "customer.subscription.created": {
        const subscription =
          event.data.object as Stripe.Subscription;

        const campaignSession =
          await getCampaignSession();

        const campaign =
          campaignSession.campaign;

        campaign.payment.stripeSubscriptionId =
          subscription.id;

        if (
          typeof subscription.customer ===
          "string"
        ) {
          campaign.payment.stripeCustomerId =
            subscription.customer;
        }

        /*
         * Stripe subscription statuses include:
         *
         * active
         * trialing
         * past_due
         * canceled
         * unpaid
         * incomplete
         * incomplete_expired
         */
        if (
          subscription.status === "active" ||
          subscription.status === "trialing"
        ) {
          campaign.payment.paymentStatus =
            "active";
        }

        await campaignSession.save();

        console.log(
          "Stripe subscription created:",
          subscription.id,
          subscription.status
        );

        break;
      }

      /*
       * Handle changes to an existing subscription.
       */
      case "customer.subscription.updated": {
        const subscription =
          event.data.object as Stripe.Subscription;

        const campaignSession =
          await getCampaignSession();

        const campaign =
          campaignSession.campaign;

        campaign.payment.stripeSubscriptionId =
          subscription.id;

        if (
          typeof subscription.customer ===
          "string"
        ) {
          campaign.payment.stripeCustomerId =
            subscription.customer;
        }

        switch (subscription.status) {
          case "active":
          case "trialing":
            campaign.payment.paymentStatus =
              "active";
            break;

          case "past_due":
            campaign.payment.paymentStatus =
              "past_due";
            break;

          case "unpaid":
            campaign.payment.paymentStatus =
              "unpaid";
            break;

          case "canceled":
            campaign.payment.paymentStatus =
              "canceled";
            break;

          case "incomplete":
            campaign.payment.paymentStatus =
              "incomplete";
            break;

          case "incomplete_expired":
            campaign.payment.paymentStatus =
              "incomplete_expired";
            break;
        }

        await campaignSession.save();

        console.log(
          "Stripe subscription updated:",
          subscription.id,
          subscription.status
        );

        break;
      }

      /*
       * The recurring subscription has been canceled.
       */
      case "customer.subscription.deleted": {
        const subscription =
          event.data.object as Stripe.Subscription;

        const campaignSession =
          await getCampaignSession();

        const campaign =
          campaignSession.campaign;

        campaign.payment.stripeSubscriptionId =
          subscription.id;

        if (
          typeof subscription.customer ===
          "string"
        ) {
          campaign.payment.stripeCustomerId =
            subscription.customer;
        }

        campaign.payment.paymentStatus =
          "canceled";

        await campaignSession.save();

        console.log(
          "Stripe subscription canceled:",
          subscription.id
        );

        break;
      }

      /*
       * A recurring invoice was successfully paid.
       */
      case "invoice.paid": {
        const invoice =
          event.data.object as Stripe.Invoice;

        const campaignSession =
          await getCampaignSession();

        const campaign =
          campaignSession.campaign;

        /*
         * Newer Stripe SDK versions do not expose
         * invoice.subscription directly on the
         * Stripe.Invoice TypeScript type.
         *
         * Read it safely from the webhook object.
         */
        const invoiceData =
          invoice as Stripe.Invoice & {
            subscription?: string | null;
          };

        if (
          typeof invoiceData.subscription ===
          "string"
        ) {
          campaign.payment.stripeSubscriptionId =
            invoiceData.subscription;
        }

        if (
          typeof invoice.customer ===
          "string"
        ) {
          campaign.payment.stripeCustomerId =
            invoice.customer;
        }

        campaign.payment.paymentStatus =
          "active";

        await campaignSession.save();

        console.log(
          "Stripe invoice paid:",
          invoice.id
        );

        break;
      }

      /*
       * A recurring invoice payment failed.
       */
      case "invoice.payment_failed": {
        const invoice =
          event.data.object as Stripe.Invoice;

        const campaignSession =
          await getCampaignSession();

        const campaign =
          campaignSession.campaign;

        /*
         * Newer Stripe SDK versions do not expose
         * invoice.subscription directly on the
         * Stripe.Invoice TypeScript type.
         *
         * Read it safely from the webhook object.
         */
        const invoiceData =
          invoice as Stripe.Invoice & {
            subscription?: string | null;
          };

        if (
          typeof invoiceData.subscription ===
          "string"
        ) {
          campaign.payment.stripeSubscriptionId =
            invoiceData.subscription;
        }

        if (
          typeof invoice.customer ===
          "string"
        ) {
          campaign.payment.stripeCustomerId =
            invoice.customer;
        }

        campaign.payment.paymentStatus =
          "payment_failed";

        await campaignSession.save();

        console.log(
          "Stripe invoice payment failed:",
          invoice.id
        );

        break;
      }

      /*
       * We intentionally ignore events that are not
       * relevant to the campaign management subscription.
       */
      default: {
        console.log(
          "Unhandled Stripe webhook event:",
          event.type
        );
      }
    }

    return NextResponse.json({
      received: true,
    });
  } catch (error) {
    console.error(
      "Stripe webhook processing failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to process Stripe webhook.",
      },
      { status: 500 }
    );
  }
}