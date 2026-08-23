import "server-only";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { getIronSession, SessionOptions } from "iron-session";

export type CampaignChannel = {
  id: string;
  title: string;
  thumbnail: string;
  email: string;
};

export type CampaignGoogleAds = {
  hasAccount: boolean | null;
  customerId: string;
  accountName: string;
  currency: string;
  timeZone: string;
  verified: boolean;
  managerInvitationSent: boolean;
  managerAccessAccepted: boolean;
};

export type CampaignBusiness = {
  companyName: string;
  website: string;
  category: string;
  timeZone: string;
};

export type CampaignVideo = {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  duration: string;
  privacyStatus: string;
};

export type CampaignAudience = {
  country: string;
  language: string;
  gender: string;
  ageGroups: string[];
  interests: string[];
};

export type CampaignAgreement = {
  termsAccepted: boolean;
  privacyAccepted: boolean;
  advertisingAuthorized: boolean;
  acceptedAt: string;
};

export type CampaignPayment = {
  managementFee: number;
  managementPlan: string;

  stripeCheckoutSessionId: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;

  paymentStatus: string;
  paidAt: string;
};

export type Campaign = {
  /*
   * This corresponds to the Prisma Campaign.id.
   *
   * The campaign is still kept in the iron-session while
   * the application is being migrated to database storage.
   */
  id: string;

  goal: string;
  budget: string;

  channel: CampaignChannel;

  googleAds: CampaignGoogleAds;

  business: CampaignBusiness;

  video: CampaignVideo;

  audience: CampaignAudience;

  agreement: CampaignAgreement;

  payment: CampaignPayment;
};

/*
 * Creates a completely new campaign with fresh IDs.
 *
 * These IDs are application/database IDs.
 * Google Ads and Stripe identifiers remain empty until
 * the corresponding external services provide real IDs.
 */
function createEmptyCampaign(): Campaign {
  return {
    id: randomUUID(),

    goal: "",
    budget: "",

    channel: {
      id: randomUUID(),
      title: "",
      thumbnail: "",
      email: "",
    },

    googleAds: {
      hasAccount: null,
      customerId: "",
      accountName: "",
      currency: "",
      timeZone: "",
      verified: false,
      managerInvitationSent: false,
      managerAccessAccepted: false,
    },

    business: {
      companyName: "",
      website: "",
      category: "",
      timeZone: "",
    },

    video: {
      id: randomUUID(),
      title: "",
      thumbnail: "",
      publishedAt: "",
      viewCount: 0,
      duration: "",
      privacyStatus: "",
    },

    audience: {
      country: "",
      language: "",
      gender: "",
      ageGroups: [],
      interests: [],
    },

    agreement: {
      termsAccepted: false,
      privacyAccepted: false,
      advertisingAuthorized: false,
      acceptedAt: "",
    },

    payment: {
      managementFee: 99,
      managementPlan: "monthly",

      stripeCheckoutSessionId: "",
      stripeCustomerId: "",
      stripeSubscriptionId: "",

      paymentStatus: "",
      paidAt: "",
    },
  };
}

/*
 * Kept as an exported default/template campaign in case other
 * parts of the application import emptyCampaign.
 *
 * IMPORTANT:
 * This object is only a template. New sessions use
 * createEmptyCampaign() so each campaign receives fresh IDs.
 */
export const emptyCampaign: Campaign = createEmptyCampaign();

export type CampaignSession = {
  campaign: Campaign;
};

const sessionOptions: SessionOptions = {
  password: process.env.CAMPAIGN_SESSION_PASSWORD!,

  cookieName: "vidstandmedia-campaign",

  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export async function getCampaignSession() {
  const session = await getIronSession<CampaignSession>(
    await cookies(),
    sessionOptions
  );

  /*
   * If there is no campaign in the session,
   * initialize a completely new campaign.
   */
  if (!session.campaign) {
    session.campaign = createEmptyCampaign();

    return session;
  }

  /*
   * Merge the existing campaign with the current
   * default structure.
   *
   * This protects older sessions when new campaign
   * fields are added later.
   */
  const defaults = createEmptyCampaign();

  session.campaign = {
    ...defaults,
    ...session.campaign,

    channel: {
      ...defaults.channel,
      ...(session.campaign.channel ?? {}),
    },

    googleAds: {
      ...defaults.googleAds,
      ...(session.campaign.googleAds ?? {}),
    },

    business: {
      ...defaults.business,
      ...(session.campaign.business ?? {}),
    },

    video: {
      ...defaults.video,
      ...(session.campaign.video ?? {}),
    },

    audience: {
      ...defaults.audience,
      ...(session.campaign.audience ?? {}),

      ageGroups:
        session.campaign.audience?.ageGroups ?? [],

      interests:
        session.campaign.audience?.interests ?? [],
    },

    agreement: {
      ...defaults.agreement,
      ...(session.campaign.agreement ?? {}),
    },

    payment: {
      ...defaults.payment,
      ...(session.campaign.payment ?? {}),
    },
  };

  return session;
}