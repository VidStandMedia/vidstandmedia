import { Suspense } from "react";
import GoalsClient from "./GoalsClient";

export default function GoalsPage() {
  return (
    <Suspense fallback={<div className="bg-white py-24 px-6" />}>
      <GoalsClient />
    </Suspense>
  );
}