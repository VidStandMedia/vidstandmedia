"use server";

import {
  getCampaignSession,
  CampaignAudience,
  CampaignChannel,
  CampaignGoogleAds,
  CampaignBusiness,
  CampaignVideo,
  CampaignAgreement,
  CampaignPayment,
  emptyCampaign,
} from "@/lib/session/campaign";

export async function getCampaign() {
  const session = await getCampaignSession();
  return session.campaign;
}

export async function resetCampaign() {
  const session = await getCampaignSession();

  session.campaign = structuredClone(emptyCampaign);

  await session.save();
}

export async function saveCampaignGoal(goal: string) {
  const session = await getCampaignSession();

  session.campaign.goal = goal;

  await session.save();
}

export async function saveCampaignBudget(budget: string) {
  const session = await getCampaignSession();

  session.campaign.budget = budget;

  await session.save();
}

export async function saveCampaignGoogleAds(
  googleAds: CampaignGoogleAds
) {
  const session = await getCampaignSession();

  session.campaign.googleAds = googleAds;

  await session.save();
}

export async function saveCampaignBusiness(
  business: CampaignBusiness
) {
  const session = await getCampaignSession();

  session.campaign.business = business;

  await session.save();
}
export async function saveCampaignChannel(
  channel: CampaignChannel
) {
  const session = await getCampaignSession();

  session.campaign.channel = channel;

  await session.save();
}

export async function saveCampaignVideo(
  video: CampaignVideo
) {
  const session = await getCampaignSession();

  session.campaign.video = video;

  await session.save();
}

export async function saveCampaignAudience(
  audience: CampaignAudience
) {
  const session = await getCampaignSession();

  session.campaign.audience = audience;

  await session.save();
}

export async function saveCampaignAgreement(
  agreement: CampaignAgreement
) {
  const session = await getCampaignSession();

  session.campaign.agreement = agreement;

  await session.save();
}

export async function saveCampaignPayment(
  payment: CampaignPayment
) {
  const session = await getCampaignSession();

  session.campaign.payment = payment;

  await session.save();
}