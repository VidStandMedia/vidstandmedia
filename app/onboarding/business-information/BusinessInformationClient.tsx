"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import OnboardingProgress from "@/components/OnboardingProgress";
import { saveCampaignBusiness } from "@/app/actions/campaign";

type BusinessInformationClientProps = {
  initialBusiness: {
    companyName: string;
    website: string;
    category: string;
    timeZone: string;
  };
};

export default function BusinessInformationClient({
  initialBusiness,
}: BusinessInformationClientProps) {
  const router = useRouter();

  const [companyName, setCompanyName] = useState(
    initialBusiness.companyName
  );

  const [website, setWebsite] = useState(
    initialBusiness.website
  );

  const [category, setCategory] = useState(
    initialBusiness.category
  );

  const [timeZone, setTimeZone] = useState(
    initialBusiness.timeZone
  );

  const [loading, setLoading] = useState(false);

  async function handleContinue() {
    if (
      companyName.trim() === "" ||
      website.trim() === "" ||
      category.trim() === "" ||
      timeZone.trim() === ""
    ) {
      return;
    }

    setLoading(true);

    try {
      await saveCampaignBusiness({
        companyName: companyName.trim(),
        website: website.trim(),
        category: category.trim(),
        timeZone: timeZone.trim(),
      });

      router.push("/onboarding/goals");
    } catch (error) {
      console.error(
        "Failed to save business information:",
        error
      );

      setLoading(false);
    }
  }

  return (
    <main className="bg-white py-24 px-6">
      <div className="mx-auto max-w-4xl">

        <OnboardingProgress
          currentStep="business-information"
        />

        <h1 className="mt-10 text-center text-5xl font-bold text-black">
          Business Information
        </h1>

        <p className="mt-6 text-center text-lg text-gray-700">
          Tell us a little about your business so we can
          understand your company and build the right
          advertising campaign for you.
        </p>

        <div className="mt-14 rounded-2xl border border-gray-300 bg-white p-8 shadow-sm">

          <div className="space-y-8">

            {/* Company Name */}

            <div>
              <label
                htmlFor="companyName"
                className="block text-lg font-semibold text-black"
              >
                Company Name
              </label>

              <p className="mt-2 text-sm text-gray-600">
                Enter the name of your business or organization.
              </p>

              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) =>
                  setCompanyName(e.target.value)
                }
                placeholder="Your Company Name"
                autoComplete="organization"
                className="mt-4 w-full rounded-xl border border-gray-300 px-5 py-4 text-black outline-none focus:border-red-600"
              />
            </div>

            {/* Website */}

            <div>
              <label
                htmlFor="website"
                className="block text-lg font-semibold text-black"
              >
                Business Website
              </label>

              <p className="mt-2 text-sm text-gray-600">
                Enter the website customers use to learn
                more about your business.
              </p>

              <input
                id="website"
                type="url"
                value={website}
                onChange={(e) =>
                  setWebsite(e.target.value)
                }
                placeholder="https://www.example.com"
                autoComplete="url"
                className="mt-4 w-full rounded-xl border border-gray-300 px-5 py-4 text-black outline-none focus:border-red-600"
              />
            </div>

            {/* Category */}

            <div>
              <label
                htmlFor="category"
                className="block text-lg font-semibold text-black"
              >
                Business Category
              </label>

              <p className="mt-2 text-sm text-gray-600">
                What type of business or organization do you operate?
              </p>

              <input
                id="category"
                type="text"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                placeholder="e.g. Healthcare, Retail, Education"
                className="mt-4 w-full rounded-xl border border-gray-300 px-5 py-4 text-black outline-none focus:border-red-600"
              />
            </div>

            {/* Time Zone */}

            <div>
              <label
                htmlFor="timeZone"
                className="block text-lg font-semibold text-black"
              >
                Business Time Zone
              </label>

              <p className="mt-2 text-sm text-gray-600">
                Select the time zone your business operates in.
              </p>

              <select
                id="timeZone"
                value={timeZone}
                onChange={(e) =>
                  setTimeZone(e.target.value)
                }
                className="mt-4 w-full rounded-xl border border-gray-300 bg-white px-5 py-4 text-black outline-none focus:border-red-600"
              >
                <option value="">
                  Select a time zone
                </option>

                <option value="America/New_York">
                  Eastern Time
                </option>

                <option value="America/Chicago">
                  Central Time
                </option>

                <option value="America/Denver">
                  Mountain Time
                </option>

                <option value="America/Los_Angeles">
                  Pacific Time
                </option>

                <option value="America/Anchorage">
                  Alaska Time
                </option>

                <option value="Pacific/Honolulu">
                  Hawaii Time
                </option>
              </select>
            </div>

          </div>

          {/* Navigation */}

          <div className="mt-14 flex justify-between">

            <Link
              href="/onboarding/manager-access"
              className="rounded-xl border border-gray-300 px-8 py-4 font-semibold text-black transition hover:bg-gray-100"
            >
              Back
            </Link>

            <button
              type="button"
              onClick={handleContinue}
              disabled={
                loading ||
                companyName.trim() === "" ||
                website.trim() === "" ||
                category.trim() === "" ||
                timeZone.trim() === ""
              }
              className="rounded-xl bg-red-600 px-10 py-4 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Saving..." : "Continue"}
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}