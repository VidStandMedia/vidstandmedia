import { getCampaign } from "@/app/actions/campaign";

import BusinessInformationClient from "./BusinessInformationClient";

export default async function BusinessInformationPage() {
  const campaign = await getCampaign();

  return (
    <BusinessInformationClient
      initialBusiness={campaign.business}
    />
  );
}