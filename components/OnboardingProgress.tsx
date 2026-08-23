type Step =
  | "login"
  | "google-ads"
  | "manager-access"
  | "business-information"
  | "goals"
  | "budget"
  | "video"
  | "audience"
  | "review"
  | "agreement"
  | "payment";

const steps: {
  id: Step;
  label: string;
}[] = [
  { id: "login", label: "Login" },
  { id: "google-ads", label: "Google Ads Setup" },
  { id: "manager-access", label: "Manager Access" },
  { id: "business-information", label: "Business Information" },
  { id: "goals", label: "Goals" },
  { id: "budget", label: "Budget" },
  { id: "video", label: "Video" },
  { id: "audience", label: "Audience" },
  { id: "review", label: "Review" },
  { id: "agreement", label: "Service Agreement" },
  { id: "payment", label: "Payment" },
];

export default function OnboardingProgress({
  currentStep,
}: {
  currentStep: Step;
}) {
  const currentIndex = steps.findIndex(
    (step) => step.id === currentStep
  );

  return (
    <div className="mb-16">
      <h2 className="text-center text-3xl font-bold text-black">
        Campaign Setup
      </h2>

      <div className="mt-10 flex items-center justify-center">
        {steps.map((step, index) => {
          const complete = index < currentIndex;
          const current = index === currentIndex;

          return (
            <div
              key={step.id}
              className="flex items-center"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${
                    complete
                      ? "bg-green-600 text-white"
                      : current
                      ? "bg-red-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {complete ? "✓" : index + 1}
                </div>

                <p className="mt-2 text-sm font-medium text-black">
                  {step.label}
                </p>
              </div>

              {index !== steps.length - 1 && (
                <div className="mx-4 h-1 w-12 bg-gray-300"></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}