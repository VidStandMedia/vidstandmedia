import { getCampaign } from "@/app/actions/campaign";
import PaymentClient from "./PaymentClient";

export default async function PaymentPage() {
  const campaign = await getCampaign();

  return <PaymentClient campaign={campaign} />;
}
