
import { NextResponse } from "next/server";
import Stripe from "stripe";

import {
  getCampaign,
  saveCampaignPayment,
} from "@/app/actions/campaign";

export async function POST() {
  try {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    const priceId = process.env.STRIPE_MANAGEMENT_PRICE_ID;

    if (!secretKey) {
      return NextResponse.json(
        { error: "STRIPE_SECRET_KEY is not configured." },
        { status: 500 }
      );
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "STRIPE_MANAGEMENT_PRICE_ID is not configured." },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secretKey);

    // Read the campaign from Prisma, not the old iron-session.
    const campaign = await getCampaign();

    /*
     * Validate the saved campaign before creating checkout.
     */

    if (!campaign.channel.id) {
      return NextResponse.json(
        { error: "You must connect your YouTube channel first." },
        { status: 400 }
      );
    }

    if (!campaign.goal?.trim()) {
      return NextResponse.json(
        { error: "You must select a promotion goal first." },
        { status: 400 }
      );
    }

    if (!campaign.budget?.trim()) {
      return NextResponse.json(
        { error: "You must select an advertising budget first." },
        { status: 400 }
      );
    }

    if (!campaign.video.id) {
      return NextResponse.json(
        { error: "You must select a YouTube video first." },
        { status: 400 }
      );
    }

    if (!campaign.audience.country) {
      return NextResponse.json(
        { error: "You must select a target country first." },
        { status: 400 }
      );
    }

    if (!campaign.audience.language) {
      return NextResponse.json(
        { error: "You must select a target language first." },
        { status: 400 }
      );
    }

    if (!campaign.agreement.termsAccepted) {
      return NextResponse.json(
        { error: "You must accept the Terms of Service." },
        { status: 400 }
      );
    }

    if (!campaign.agreement.privacyAccepted) {
      return NextResponse.json(
        { error: "You must accept the Privacy Policy." },
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
     * Stripe charges only the VidStandMedia management fee.
     * Google Ads bills the customer separately for advertising.
     */

    const customerEmail = campaign.channel.email || undefined;

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const checkoutSession =
      await stripe.checkout.sessions.create({
        mode: "subscription",

        managed_payments: {
          enabled: false,
        },

        ...(customerEmail
          ? { customer_email: customerEmail }
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

        cancel_url: `${appUrl}/onboarding/payment`,

        metadata: {
          campaignGoal: campaign.goal,
          campaignBudget: campaign.budget,
          youtubeChannelId: campaign.channel.id,
          youtubeVideoId: campaign.video.id,
          googleAdsCustomerId:
            campaign.googleAds.customerId || "",
        },

        subscription_data: {
          metadata: {
            youtubeChannelId: campaign.channel.id,
            youtubeVideoId: campaign.video.id,
            googleAdsCustomerId:
              campaign.googleAds.customerId || "",
          },
        },
      });

    if (!checkoutSession.url) {
      return NextResponse.json(
        { error: "Stripe did not return a checkout URL." },
        { status: 500 }
      );
    }

    // Save checkout details to the Prisma database.
    await saveCampaignPayment({
      managementFee: campaign.payment.managementFee || 99,
      managementPlan:
        campaign.payment.managementPlan || "monthly",
      stripeCheckoutSessionId: checkoutSession.id,
      stripeCustomerId:
        campaign.payment.stripeCustomerId || "",
      stripeSubscriptionId:
        campaign.payment.stripeSubscriptionId || "",
      paymentStatus: "checkout_created",
      paidAt: campaign.payment.paidAt || "",
    });

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
