import ReviewClient from "./ReviewClient";
import { getCampaign } from "@/app/actions/campaign";

export default async function ReviewPage() {

  const campaign = await getCampaign();

  return (
    <ReviewClient campaign={campaign} />
  );

}