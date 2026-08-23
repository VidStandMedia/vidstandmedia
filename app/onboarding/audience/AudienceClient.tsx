"use client";

import { useState } from "react";
import { saveCampaignAudience } from "@/app/actions/campaign";
import Link from "next/link";
import { useRouter } from "next/navigation";
import OnboardingProgress from "@/components/OnboardingProgress";

type AudienceClientProps = {};

const countries = [
  "United States",
  "Canada",
  "United Kingdom",
  "Australia",
  "Germany",
  "France",
  "Spain",
  "Italy",
  "Japan",
  "Brazil",
];

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Portuguese",
  "Japanese",
];

const ageGroups = [
  "18–24",
  "25–34",
  "35–44",
  "45–54",
  "55–64",
  "65+",
];

const genders = [
  "All",
  "Male",
  "Female",
];

const interests = [
  "Technology",
  "Gaming",
  "Business",
  "Finance",
  "Education",
  "Health & Fitness",
  "Travel",
  "Food",
  "Music",
  "Sports",
  "Entertainment",
  "Shopping",
  "Automotive",
  "Real Estate",
  "Pets",
];

export default function AudienceClient({}: AudienceClientProps) {
  const router = useRouter();

  const [country, setCountry] = useState("");
  const [language, setLanguage] = useState("");
  const [gender, setGender] = useState("All");

  const [selectedAges, setSelectedAges] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  function toggleAge(age: string) {
    if (selectedAges.includes(age)) {
      setSelectedAges(
        selectedAges.filter((item) => item !== age)
      );
    } else {
      setSelectedAges([
        ...selectedAges,
        age,
      ]);
    }
  }

  function toggleInterest(interest: string) {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(
        selectedInterests.filter(
          (item) => item !== interest
        )
      );
      return;
    }

    if (selectedInterests.length >= 3) {
      return;
    }

    setSelectedInterests([
      ...selectedInterests,
      interest,
    ]);
  }

  const canContinue =
    country !== "" &&
    language !== "" &&
    gender !== "" &&
    selectedAges.length > 0 &&
    selectedInterests.length > 0;

  return (
    <main className="bg-white py-24 px-6">
      <div className="mx-auto max-w-5xl">

        <OnboardingProgress currentStep="audience" />

        <h1 className="text-center text-5xl font-bold text-black">
          Choose Your Target Audience
        </h1>

        <p className="mt-6 text-center text-lg text-gray-700">
          Tell us who should see your YouTube promotion.
          We'll use this information when creating your
          Google Ads campaign.
        </p>


        {/* Country */}

        <div className="mt-12">

          <div className="mb-3 flex items-center justify-between">

            <label className="text-lg font-semibold text-black">
              Country
            </label>

            {country && (
              <span className="text-sm font-semibold text-green-600">
                ✓ Selected
              </span>
            )}

          </div>

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-5 py-4 text-black outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
          >
            <option value="">
              Select a country...
            </option>

            {countries.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}

          </select>

        </div>


        {/* Language */}

        <div className="mt-10">

          <div className="mb-3 flex items-center justify-between">

            <label className="text-lg font-semibold text-black">
              Language
            </label>

            {language && (
              <span className="text-sm font-semibold text-green-600">
                ✓ Selected
              </span>
            )}

          </div>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-xl border border-gray-300 px-5 py-4 text-black outline-none transition focus:border-green-600 focus:ring-4 focus:ring-green-100"
          >

            <option value="">
              Select a language...
            </option>

            {languages.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}

          </select>

        </div>


        {/* Age Groups */}

        <div className="mt-12">

          <h2 className="mb-6 text-lg font-semibold text-black">
            Age Groups
          </h2>

          <p className="mb-6 text-gray-700">
            Select one or more age groups you'd like to target.
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {ageGroups.map((age) => (
              <button
                key={age}
                type="button"
                onClick={() => toggleAge(age)}
                className={`rounded-2xl border p-5 text-center transition ${
                  selectedAges.includes(age)
                    ? "border-green-600 bg-green-50 shadow-lg"
                    : "border-gray-300 hover:border-green-600 hover:bg-green-50"
                }`}
              >

                <div className="text-lg font-semibold text-black">
                  {age}
                </div>

                {selectedAges.includes(age) && (
                  <div className="mt-3 text-sm font-semibold text-green-700">
                    ✓ Selected
                  </div>
                )}

              </button>
            ))}

          </div>

        </div>

                {/* Gender */}

        <div className="mt-12">

          <h2 className="mb-6 text-lg font-semibold text-black">
            Gender
          </h2>

          <p className="mb-6 text-gray-700">
            Choose which audience you'd like your ads to reach.
          </p>

          <div className="grid gap-4 md:grid-cols-3">

            {genders.map((item) => (

              <button
                key={item}
                type="button"
                onClick={() => setGender(item)}
                className={`rounded-2xl border p-6 transition ${
                  gender === item
                    ? "border-green-600 bg-green-50 shadow-lg"
                    : "border-gray-300 hover:border-green-600 hover:bg-green-50"
                }`}
              >

                <div className="text-xl font-semibold text-black">
                  {item}
                </div>

                {gender === item && (
                  <div className="mt-3 text-sm font-semibold text-green-700">
                    ✓ Selected
                  </div>
                )}

              </button>

            ))}

          </div>

        </div>


        {/* Interests */}

        <div className="mt-12">

          <h2 className="mb-6 text-lg font-semibold text-black">
            Interests
          </h2>

          <p className="mb-6 text-gray-700">
            Select up to{" "}
            <span className="font-semibold">
              3 interests
            </span>{" "}
            that best describe the audience you'd like to reach.
          </p>


          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {interests.map((interest) => {

              const isSelected =
                selectedInterests.includes(interest);

              const isDisabled =
                !isSelected &&
                selectedInterests.length >= 3;


              return (

                <button
                  key={interest}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => toggleInterest(interest)}
                  className={`rounded-2xl border p-5 text-center transition ${
                    isSelected
                      ? "border-green-600 bg-green-50 shadow-lg"
                      : isDisabled
                        ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 opacity-60"
                        : "border-gray-300 hover:border-green-600 hover:bg-green-50"
                  }`}
                >

                  <div className="text-lg font-semibold text-black">
                    {interest}
                  </div>


                  {isSelected && (

                    <div className="mt-3 text-sm font-semibold text-green-700">
                      ✓ Selected
                    </div>

                  )}

                </button>

              );

            })}

          </div>

        </div>


        {/* Audience Summary */}

        <div className="mt-14 rounded-2xl border border-gray-300 bg-gray-50 p-8">

          <h2 className="text-2xl font-bold text-black">
            Audience Summary
          </h2>


          <div className="mt-6 space-y-4">


            <p className="text-black">

              <span className="font-semibold">
                Country:
              </span>{" "}

              {country ? (

                <span className="text-black">
                  {country}
                </span>

              ) : (

                <span className="font-semibold text-red-600">
                  None selected
                </span>

              )}

            </p>



            <p className="text-black">

              <span className="font-semibold">
                Language:
              </span>{" "}

              {language ? (

                <span className="text-black">
                  {language}
                </span>

              ) : (

                <span className="font-semibold text-red-600">
                  None selected
                </span>

              )}

            </p>



            <p className="text-black">

              <span className="font-semibold">
                Gender:
              </span>{" "}

              {gender ? (

                <span className="text-black">
                  {gender}
                </span>

              ) : (

                <span className="font-semibold text-red-600">
                  None selected
                </span>

              )}

            </p>

                        <p className="text-black">

              <span className="font-semibold">
                Age Groups:
              </span>{" "}

              {selectedAges.length > 0 ? (

                <span className="text-black">
                  {selectedAges.join(", ")}
                </span>

              ) : (

                <span className="font-semibold text-red-600">
                  None selected
                </span>

              )}

            </p>



            <p className="text-black">

              <span className="font-semibold">
                Interests:
              </span>{" "}

              {selectedInterests.length > 0 ? (

                <span className="text-black">
                  {selectedInterests.join(", ")}
                </span>

              ) : (

                <span className="font-semibold text-red-600">
                  None selected
                </span>

              )}

            </p>


          </div>

        </div>


        {/* Navigation */}

        <div className="mt-14 flex justify-between">


          <Link
            href="/onboarding/video"
            className="rounded-xl border border-gray-300 px-8 py-4 font-semibold text-black transition hover:bg-gray-100"
          >
            Back
          </Link>



          <button
            type="button"
            disabled={!canContinue}
            onClick={async () => {

              if (!canContinue) return;

              await saveCampaignAudience({
                country,
                language,
                gender,
                ageGroups: selectedAges,
                interests: selectedInterests,
              });

              window.location.href = "/onboarding/review";

            }}
            className={`rounded-xl px-10 py-4 font-semibold transition ${
              canContinue
                ? "bg-red-600 text-white hover:bg-red-700"
                : "cursor-not-allowed bg-gray-300 text-white"
            }`}
          >
            Continue
          </button>


        </div>


      </div>

    </main>
  );
}