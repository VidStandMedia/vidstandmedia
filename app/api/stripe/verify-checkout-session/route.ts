import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getCampaignSession } from "@/lib/session/campaign";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const sessionId = body?.sessionId;

    if (
      typeof sessionId !== "string" ||
      !sessionId.startsWith("cs_")
    ) {
      return NextResponse.json(
        {
          error: "A valid Stripe Checkout Session ID is required.",
        },
        { status: 400 }
      );
    }

    const checkoutSession =
      await stripe.checkout.sessions.retrieve(
        sessionId,
        {
          expand: ["subscription"],
        }
      );

    /*
     * Verify that Stripe considers the Checkout
     * Session successfully completed.
     */
    if (checkoutSession.status !== "complete") {
      return NextResponse.json(
        {
          error: "Stripe Checkout has not been completed.",
        },
        { status: 400 }
      );
    }

    if (checkoutSession.payment_status !== "paid") {
      return NextResponse.json(
        {
          error: "Stripe has not confirmed payment yet.",
        },
        { status: 400 }
      );
    }

    /*
     * Retrieve the current campaign session.
     */
    const campaignSession =
      await getCampaignSession();

    const campaign = campaignSession.campaign;

    /*
     * Get the Stripe Customer ID.
     */
    let stripeCustomerId = "";

    if (
      typeof checkoutSession.customer ===
      "string"
    ) {
      stripeCustomerId =
        checkoutSession.customer;
    }

    /*
     * Get the Stripe Subscription ID.
     */
    let stripeSubscriptionId = "";

    if (
      typeof checkoutSession.subscription ===
      "string"
    ) {
      stripeSubscriptionId =
        checkoutSession.subscription;
    } else if (
      checkoutSession.subscription &&
      typeof checkoutSession.subscription ===
        "object"
    ) {
      stripeSubscriptionId =
        checkoutSession.subscription.id;
    }

    /*
     * Save the successful payment information
     * into the campaign session.
     */
    campaign.payment.stripeCheckoutSessionId =
      checkoutSession.id;

    campaign.payment.stripeCustomerId =
      stripeCustomerId;

    campaign.payment.stripeSubscriptionId =
      stripeSubscriptionId;

    campaign.payment.paymentStatus =
      "paid";

    campaign.payment.paidAt =
      new Date().toISOString();

    await campaignSession.save();

    return NextResponse.json({
      success: true,

      payment: {
        checkoutSessionId:
          checkoutSession.id,

        stripeCustomerId,

        stripeSubscriptionId,

        paymentStatus: "paid",
      },
    });
  } catch (error) {
    console.error(
      "Stripe checkout verification failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to verify Stripe checkout session.",
      },
      { status: 500 }
    );
  }
}