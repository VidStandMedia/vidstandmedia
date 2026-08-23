import {
  getCampaignSession,
} from "@/lib/session/campaign";

import BusinessInformationClient from "./BusinessInformationClient";

export default async function BusinessInformationPage() {
  const session = await getCampaignSession();

  return (
    <BusinessInformationClient
      initialBusiness={
        session.campaign.business
      }
    />
  );
}