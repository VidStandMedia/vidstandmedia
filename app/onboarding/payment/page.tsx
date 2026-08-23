import { getCampaignSession } from "@/lib/session/campaign";
import PaymentClient from "./PaymentClient";

export default async function PaymentPage() {
  const session = await getCampaignSession();

  return (
    <PaymentClient
      campaign={session.campaign}
    />
  );
}
