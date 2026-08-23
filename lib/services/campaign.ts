import {
  Campaign,
  CampaignSession,
  emptyCampaign,
} from "@/lib/session/campaign";

export function getCampaign(
  session: CampaignSession
): Campaign {
  if (!session.campaign) {
    session.campaign = structuredClone(emptyCampaign);
  }

  return session.campaign;
}

export async function saveCampaign(
  session: CampaignSession
) {
  await (session as any).save();
}

export async function resetCampaign(
  session: CampaignSession
) {
  session.campaign = structuredClone(emptyCampaign);

  await saveCampaign(session);
}

export async function updateCampaign(
  session: CampaignSession,
  updates: Partial<Campaign>
) {
  if (!session.campaign) {
    session.campaign = structuredClone(emptyCampaign);
  }

  session.campaign = {
    ...session.campaign,
    ...updates,
  };

  await saveCampaign(session);

  return session.campaign;
}
export async function updateGoal(
  session: CampaignSession,
  goal: string
) {
  return updateCampaign(session, {
    goal,
  });
}

export async function updateBudget(
  session: CampaignSession,
  budget: string
) {
  return updateCampaign(session, {
    budget,
  });
}

export async function updateGoogleAds(
  session: CampaignSession,
  googleAds: Campaign["googleAds"]
) {
  return updateCampaign(session, {
    googleAds,
  });
}

export async function updateBusiness(
  session: CampaignSession,
  business: Campaign["business"]
) {
  return updateCampaign(session, {
    business,
  });
}

export async function updateChannel(
  session: CampaignSession,
  channel: Campaign["channel"]
) {
  return updateCampaign(session, {
    channel,
  });
}

export async function updateVideo(
  session: CampaignSession,
  video: Campaign["video"]
) {
  return updateCampaign(session, {
    video,
  });
}
export async function updateAudience(
  session: CampaignSession,
  audience: Campaign["audience"]
) {
  return updateCampaign(session, {
    audience,
  });
}

export async function updateAgreement(
  session: CampaignSession,
  agreement: Campaign["agreement"]
) {
  return updateCampaign(session, {
    agreement,
  });
}

export async function updatePayment(
  session: CampaignSession,
  payment: Campaign["payment"]
) {
  return updateCampaign(session, {
    payment,
  });
}

export function isCampaignReady(
  campaign: Campaign
) {
  return (
    campaign.goal !== "" &&
    campaign.budget !== "" &&
    campaign.channel.id !== "" &&
    campaign.video.id !== "" &&
    campaign.audience.country !== "" &&
    campaign.audience.language !== "" &&
    campaign.audience.ageGroups.length > 0 &&
    campaign.audience.interests.length > 0 &&
    campaign.googleAds.customerId !== "" &&
    campaign.agreement.termsAccepted &&
    campaign.agreement.privacyAccepted &&
    campaign.agreement.advertisingAuthorized
  );
}
