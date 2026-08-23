import { getCampaignSession } from "@/lib/session/campaign";
import AgreementClient from "./AgreementClient";

export default async function AgreementPage() {
  const session = await getCampaignSession();

  return (
    <AgreementClient
      initialAgreement={session.campaign.agreement}
    />
  );
}