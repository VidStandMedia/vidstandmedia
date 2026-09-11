import { getCampaign } from "@/app/actions/campaign";

import GoogleAdsClient from "./GoogleAdsClient";

export default async function GoogleAdsPage() {
  const campaign = await getCampaign();

  return (
    <GoogleAdsClient
      initialGoogleAds={campaign.googleAds}
    />
  );
}
