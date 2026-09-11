"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

import { prisma } from "@/lib/prisma";

import {
  CampaignAudience,
  CampaignChannel,
  CampaignGoogleAds,
  CampaignBusiness,
  CampaignVideo,
  CampaignAgreement,
  CampaignPayment,
  Campaign,
} from "@/lib/session/campaign";

function parseDate(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date;
}

async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  const email = session?.user?.email;

  if (!email) {
    throw new Error("You must be signed in to manage a campaign.");
  }

  const user = await prisma.user.upsert({
    where: {
      email,
    },
    update: {
      name: session.user?.name ?? undefined,
      image: session.user?.image ?? undefined,
    },
    create: {
      email,
      name: session.user?.name ?? null,
      image: session.user?.image ?? null,
    },
  });

  return user;
}

async function getOrCreateCampaign() {
  const user = await getCurrentUser();

  let campaign = await prisma.campaign.findFirst({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (!campaign) {
    campaign = await prisma.campaign.create({
      data: {
        userId: user.id,
        goal: "",
        budget: "",
      },
    });
  }

  return campaign;
}

async function getCampaignWithRelations() {
  const user = await getCurrentUser();

  return prisma.campaign.findFirst({
    where: {
      userId: user.id,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      channel: true,
      googleAds: true,
      business: true,
      video: true,
      audience: true,
      agreement: true,
      payment: true,
    },
  });
}

function toCampaign(data: NonNullable<
  Awaited<ReturnType<typeof getCampaignWithRelations>>
>): Campaign {
  return {
    id: data.id,

    goal: data.goal,
    budget: data.budget,

    channel: {
  id: data.channel?.youtubeChannelId ?? "",
      title: data.channel?.title ?? "",
      thumbnail: data.channel?.thumbnail ?? "",
      email: data.channel?.email ?? "",
    },

    googleAds: {
      hasAccount: data.googleAds?.hasAccount ?? null,
      customerId: data.googleAds?.customerId ?? "",
      accountName: data.googleAds?.accountName ?? "",
      currency: data.googleAds?.currency ?? "",
      timeZone: data.googleAds?.timeZone ?? "",
      verified: data.googleAds?.verified ?? false,
      managerInvitationSent:
        data.googleAds?.managerInvitationSent ?? false,
      managerAccessAccepted:
        data.googleAds?.managerAccessAccepted ?? false,
    },

    business: {
  clientType:
    data.business?.clientType === "creator"
      ? "creator"
      : "business",
  companyName: data.business?.companyName ?? "",
  website: data.business?.website ?? "",
  category: data.business?.category ?? "",
  timeZone: data.business?.timeZone ?? "",
},

    video: {
  id: data.video?.youtubeVideoId ?? "",
      title: data.video?.title ?? "",
      thumbnail: data.video?.thumbnail ?? "",
      publishedAt: data.video?.publishedAt ?? "",
      viewCount: data.video?.viewCount ?? 0,
      duration: data.video?.duration ?? "",
      privacyStatus: data.video?.privacyStatus ?? "",
    },

    audience: {
      country: data.audience?.country ?? "",
      language: data.audience?.language ?? "",
      gender: data.audience?.gender ?? "",
      ageGroups: data.audience?.ageGroups ?? [],
      interests: data.audience?.interests ?? [],
    },

    agreement: {
      termsAccepted: data.agreement?.termsAccepted ?? false,
      privacyAccepted: data.agreement?.privacyAccepted ?? false,
      advertisingAuthorized:
        data.agreement?.advertisingAuthorized ?? false,
      acceptedAt: data.agreement?.acceptedAt
        ? data.agreement.acceptedAt.toISOString()
        : "",
    },

    payment: {
      managementFee: data.payment
        ? Number(data.payment.managementFee)
        : 99,
      managementPlan: data.payment?.managementPlan ?? "monthly",

      stripeCheckoutSessionId:
        data.payment?.stripeCheckoutSessionId ?? "",
      stripeCustomerId:
        data.payment?.stripeCustomerId ?? "",
      stripeSubscriptionId:
        data.payment?.stripeSubscriptionId ?? "",

      paymentStatus: data.payment?.paymentStatus ?? "",
      paidAt: data.payment?.paidAt
        ? data.payment.paidAt.toISOString()
        : "",
    },
  };
}

export async function getCampaign(): Promise<Campaign> {
  const campaign = await getCampaignWithRelations();

  if (!campaign) {
    throw new Error("Campaign could not be found.");
  }

  return toCampaign(campaign);
}

export async function resetCampaign() {
  const campaign = await getOrCreateCampaign();

  await prisma.campaign.delete({
    where: {
      id: campaign.id,
    },
  });
}

export async function saveCampaignGoal(goal: string) {
  const campaign = await getOrCreateCampaign();

  await prisma.campaign.update({
    where: {
      id: campaign.id,
    },
    data: {
      goal,
    },
  });
}

export async function saveCampaignBudget(budget: string) {
  const campaign = await getOrCreateCampaign();

  await prisma.campaign.update({
    where: {
      id: campaign.id,
    },
    data: {
      budget,
    },
  });
}

export async function saveCampaignGoogleAds(
  googleAds: CampaignGoogleAds
) {
  const campaign = await getOrCreateCampaign();

  await prisma.campaignGoogleAds.upsert({
    where: {
      campaignId: campaign.id,
    },
    update: {
      hasAccount: googleAds.hasAccount,
      customerId: googleAds.customerId,
      accountName: googleAds.accountName,
      currency: googleAds.currency,
      timeZone: googleAds.timeZone,
      verified: googleAds.verified,
      managerInvitationSent:
        googleAds.managerInvitationSent,
      managerAccessAccepted:
        googleAds.managerAccessAccepted,
    },
    create: {
      campaignId: campaign.id,
      hasAccount: googleAds.hasAccount,
      customerId: googleAds.customerId,
      accountName: googleAds.accountName,
      currency: googleAds.currency,
      timeZone: googleAds.timeZone,
      verified: googleAds.verified,
      managerInvitationSent:
        googleAds.managerInvitationSent,
      managerAccessAccepted:
        googleAds.managerAccessAccepted,
    },
  });
}

export async function saveCampaignBusiness(
  business: CampaignBusiness
) {
  const campaign = await getOrCreateCampaign();

  await prisma.campaignBusiness.upsert({
    where: {
      campaignId: campaign.id,
    },
    update: {
      clientType: business.clientType,
      companyName: business.companyName,
      website: business.website,
      category: business.category,
      timeZone: business.timeZone,
    },
    create: {
      campaignId: campaign.id,
      clientType: business.clientType,
      companyName: business.companyName,
      website: business.website,
      category: business.category,
      timeZone: business.timeZone,
    },
  });
}

export async function saveCampaignChannel(
  channel: CampaignChannel
) {
  const campaign = await getOrCreateCampaign();

  await prisma.campaignChannel.upsert({
    where: {
      campaignId: campaign.id,
    },
    update: {
      youtubeChannelId: channel.id,
      title: channel.title,
      thumbnail: channel.thumbnail,
      email: channel.email,
    },
    create: {
      campaignId: campaign.id,
      youtubeChannelId: channel.id,
      title: channel.title,
      thumbnail: channel.thumbnail,
      email: channel.email,
    },
  });
}

export async function saveCampaignVideo(
  video: CampaignVideo
) {
  const campaign = await getOrCreateCampaign();

  await prisma.campaignVideo.upsert({
    where: {
      campaignId: campaign.id,
    },
    update: {
      youtubeVideoId: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      publishedAt: video.publishedAt,
      viewCount: video.viewCount,
      duration: video.duration,
      privacyStatus: video.privacyStatus,
    },
    create: {
      campaignId: campaign.id,
      youtubeVideoId: video.id,
      title: video.title,
      thumbnail: video.thumbnail,
      publishedAt: video.publishedAt,
      viewCount: video.viewCount,
      duration: video.duration,
      privacyStatus: video.privacyStatus,
    },
  });
}

export async function saveCampaignAudience(
  audience: CampaignAudience
) {
  const campaign = await getOrCreateCampaign();

  await prisma.campaignAudience.upsert({
    where: {
      campaignId: campaign.id,
    },
    update: {
      country: audience.country,
      language: audience.language,
      gender: audience.gender,
      ageGroups: audience.ageGroups,
      interests: audience.interests,
    },
    create: {
      campaignId: campaign.id,
      country: audience.country,
      language: audience.language,
      gender: audience.gender,
      ageGroups: audience.ageGroups,
      interests: audience.interests,
    },
  });
}

export async function saveCampaignAgreement(
  agreement: CampaignAgreement
) {
  const campaign = await getOrCreateCampaign();

  await prisma.campaignAgreement.upsert({
    where: {
      campaignId: campaign.id,
    },
    update: {
      termsAccepted: agreement.termsAccepted,
      privacyAccepted: agreement.privacyAccepted,
      advertisingAuthorized:
        agreement.advertisingAuthorized,
      acceptedAt: parseDate(agreement.acceptedAt),
    },
    create: {
      campaignId: campaign.id,
      termsAccepted: agreement.termsAccepted,
      privacyAccepted: agreement.privacyAccepted,
      advertisingAuthorized:
        agreement.advertisingAuthorized,
      acceptedAt: parseDate(agreement.acceptedAt),
    },
  });
}

export async function saveCampaignPayment(
  payment: CampaignPayment
) {
  const campaign = await getOrCreateCampaign();

  await prisma.campaignPayment.upsert({
    where: {
      campaignId: campaign.id,
    },
    update: {
      managementFee: payment.managementFee,
      managementPlan: payment.managementPlan,
      stripeCheckoutSessionId:
        payment.stripeCheckoutSessionId || null,
      stripeCustomerId:
        payment.stripeCustomerId || null,
      stripeSubscriptionId:
        payment.stripeSubscriptionId || null,
      paymentStatus: payment.paymentStatus,
      paidAt: parseDate(payment.paidAt),
    },
    create: {
      campaignId: campaign.id,
      managementFee: payment.managementFee,
      managementPlan: payment.managementPlan,
      stripeCheckoutSessionId:
        payment.stripeCheckoutSessionId || null,
      stripeCustomerId:
        payment.stripeCustomerId || null,
      stripeSubscriptionId:
        payment.stripeSubscriptionId || null,
      paymentStatus: payment.paymentStatus,
      paidAt: parseDate(payment.paidAt),
    },
  });
}