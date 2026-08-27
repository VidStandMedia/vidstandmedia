"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import OnboardingProgress from "@/components/OnboardingProgress";
import { saveCampaignBudget } from "@/app/actions/campaign";

const budgets = [
  "$50/week",
  "$100/week",
  "$200/week",
  "$500/week",
];

export default function BudgetPage() {
  const searchParams = useSearchParams();

  const fromReview =
    searchParams.get("from") === "review";

  const [selectedBudget, setSelectedBudget] =
    useState<string | null>(null);

  const [customBudget, setCustomBudget] =
    useState("");

  const [isSaving, setIsSaving] =
    useState(false);

  const customAmount = Number(customBudget);

  const validCustomBudget =
    customBudget !== "" &&
    customAmount >= 50 &&
    customAmount <= 5000;

  const selected =
    selectedBudget ||
    (validCustomBudget
      ? `$${customAmount}/week`
      : null);


  async function handleSave() {
    if (!selected || isSaving) return;

    setIsSaving(true);

    try {
      await saveCampaignBudget(selected);

      if (fromReview) {
        window.location.href =
          "/onboarding/review";
      } else {
        window.location.href =
          "/onboarding/video";
      }

    } catch (error) {
      console.error(
        "Failed to save campaign budget:",
        error
      );

      setIsSaving(false);
    }
  }


  return (
    <main className="bg-white py-24 px-6">

      <div className="mx-auto max-w-4xl">

        <OnboardingProgress
          currentStep="budget"
        />


        <h1 className="text-center text-5xl font-bold text-black">
          Choose Your Advertising Budget
        </h1>


        <p className="mt-6 text-center text-lg text-gray-700">
          Select your weekly advertising budget. You can adjust your campaign
          spending before your promotion launches.
        </p>


        {/* Preset Budgets */}

        <div className="mt-14 grid gap-6">

          {budgets.map((budget) => (

            <button
              key={budget}
              type="button"
              onClick={() => {
                setSelectedBudget(budget);
                setCustomBudget("");
              }}
              className={`rounded-2xl border p-8 text-center text-2xl font-bold text-black transition ${
                selectedBudget === budget
                  ? "border-green-600 bg-green-50 shadow-lg"
                  : "border-gray-300 hover:border-green-600 hover:bg-green-50"
              }`}
            >
              {budget}
            </button>

          ))}

        </div>


        {/* Custom Budget */}

        <div className="mt-10 rounded-2xl border border-gray-300 p-8">

          <h2 className="text-center text-2xl font-bold text-black">
            Select Custom Price
          </h2>


          <p className="mt-3 text-center text-gray-700">
            Enter a weekly budget between $50 and $5,000.
          </p>


          <div className="mt-6 flex justify-center">

            <div className="flex items-center rounded-xl border border-gray-300 px-4">

              <span className="text-xl text-black">
                $
              </span>


              <input
                type="number"
                value={customBudget}
                onChange={(e) => {
                  setCustomBudget(
                    e.target.value
                  );
                  setSelectedBudget(null);
                }}
                placeholder="Weekly budget"
                className="w-48 px-3 py-3 text-lg text-black outline-none"
                min="50"
                max="5000"
              />


              <span className="text-lg text-black">
                /week
              </span>

            </div>

          </div>


          {customBudget !== "" &&
            !validCustomBudget && (

            <p className="mt-4 text-center text-red-600">
              Please enter a weekly budget between $50 and $5,000.
            </p>

          )}

        </div>


        {/* Navigation */}

        <div className="mt-14 flex justify-between">


          <Link
  href={fromReview ? "/onboarding/review" : "/onboarding/goals"}
  className="rounded-xl border border-gray-300 px-8 py-4 font-semibold text-black hover:bg-gray-100"
>
  Back
</Link>


          <button
            type="button"
            disabled={!selected || isSaving}
            onClick={handleSave}
            className={`rounded-xl px-10 py-4 font-semibold transition ${
              selected && !isSaving
                ? "bg-red-600 text-white hover:bg-red-700"
                : "cursor-not-allowed bg-gray-300 text-white"
            }`}
          >
            {isSaving
              ? "Saving..."
              : fromReview
                ? "Back to Review"
                : "Continue"}
          </button>


        </div>


      </div>

    </main>
  );
}