import { NextResponse } from "next/server";
import Stripe from "stripe";

import { getCampaignSession } from "@/lib/session/campaign";

export async function POST() {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_MANAGEMENT_PRICE_ID;

    if (!secretKey) {
      return NextResponse.json(
        {
          error:
            "STRIPE_SECRET_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    if (!priceId) {
      return NextResponse.json(
        {
          error:
            "STRIPE_MANAGEMENT_PRICE_ID is not configured.",
        },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);

    const session = await getCampaignSession();
    const campaign = session.campaign;

    if (!campaign) {
      return NextResponse.json(
        {
          error: "Campaign session not found.",
        },
        { status: 400 }
      );
    }

    /*
     * Make sure the client has completed the important
     * onboarding steps before sending them to Stripe.
     */

    if (!campaign.channel.id) {
      return NextResponse.json(
        {
          error:
            "You must connect your YouTube channel first.",
        },
        { status: 400 }
      );
    }

    if (!campaign.goal) {
      return NextResponse.json(
        {
          error:
            "You must select a promotion goal first.",
        },
        { status: 400 }
      );
    }

    if (!campaign.budget) {
      return NextResponse.json(
        {
          error:
            "You must select an advertising budget first.",
        },
        { status: 400 }
      );
    }

    if (!campaign.video.id) {
      return NextResponse.json(
        {
          error:
            "You must select a YouTube video first.",
        },
        { status: 400 }
      );
    }

    if (!campaign.audience.country) {
      return NextResponse.json(
        {
          error:
            "You must select a target country first.",
        },
        { status: 400 }
      );
    }

    if (!campaign.audience.language) {
      return NextResponse.json(
        {
          error:
            "You must select a target language first.",
        },
        { status: 400 }
      );
    }

    /*
     * The client must agree to the required legal terms
     * before purchasing campaign management.
     */

    if (!campaign.agreement.termsAccepted) {
      return NextResponse.json(
        {
          error:
            "You must accept the Terms of Service.",
        },
        { status: 400 }
      );
    }

    if (!campaign.agreement.privacyAccepted) {
      return NextResponse.json(
        {
          error:
            "You must accept the Privacy Policy.",
        },
        { status: 400 }
      );
    }

    if (!campaign.agreement.advertisingAuthorized) {
      return NextResponse.json(
        {
          error:
            "You must authorize VidStandMedia to manage your advertising campaigns.",
        },
        { status: 400 }
      );
    }

    /*
     * Google Ads advertising is NOT included in this
     * Stripe checkout.
     *
     * Google bills the client directly for advertising.
     *
     * Stripe only charges the VidStandMedia management fee.
     */

    const customerEmail =
      campaign.channel.email || undefined;

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
  mode: "subscription",

  managed_payments: {
    enabled: false,
  },

  ...(customerEmail
    ? {
        customer_email: customerEmail,
      }
    : {}),

        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],

        success_url:
          `${appUrl}/onboarding/payment/success` +
          "?session_id={CHECKOUT_SESSION_ID}",

        cancel_url:
          `${appUrl}/onboarding/payment`,

        metadata: {
          campaignGoal: campaign.goal,
          campaignBudget: campaign.budget,
          youtubeChannelId:
            campaign.channel.id,
          youtubeVideoId:
            campaign.video.id,
          googleAdsCustomerId:
            campaign.googleAds.customerId || "",
        },

        subscription_data: {
          metadata: {
            youtubeChannelId:
              campaign.channel.id,
            youtubeVideoId:
              campaign.video.id,
            googleAdsCustomerId:
              campaign.googleAds.customerId || "",
          },
        },
      });

    /*
     * Save the Stripe Checkout Session ID so the
     * payment can be connected to this campaign.
     */

    session.campaign.payment.stripeCheckoutSessionId =
      checkoutSession.id;

    session.campaign.payment.paymentStatus =
      "checkout_created";

    await session.save();

    if (!checkoutSession.url) {
      return NextResponse.json(
        {
          error:
            "Stripe did not return a checkout URL.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error(
      "Stripe checkout session creation failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create Stripe checkout session.",
      },
      { status: 500 }
    );
  }
}