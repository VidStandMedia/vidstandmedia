import { Suspense } from "react";
import BudgetClient from "./BudgetClient";

export default function BudgetPage() {
  return (
    <Suspense fallback={<div className="bg-white py-24 px-6" />}>
      <BudgetClient />
    </Suspense>
  );
}