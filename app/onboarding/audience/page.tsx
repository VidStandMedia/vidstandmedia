import AudienceClient from "./AudienceClient";
import { getCampaign } from "@/app/actions/campaign";

export default async function AudiencePage() {
  const campaign = await getCampaign();

  return (
    <AudienceClient
      initialAudience={campaign.audience}
    />
  );
}