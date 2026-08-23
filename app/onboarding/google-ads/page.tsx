import {
  getCampaignSession,
} from "@/lib/session/campaign";

import GoogleAdsClient from "./GoogleAdsClient";


export default async function GoogleAdsPage() {

  const session = await getCampaignSession();

  return (
    <GoogleAdsClient
      initialGoogleAds={
        session.campaign.googleAds
      }
    />
  );
}