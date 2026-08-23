export default function Home() {
  return (
    <main className="bg-white text-black">

      {/* HERO SECTION */}
      <section className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="mx-auto max-w-4xl text-center">

          {/* Main Headline */}
          <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl">
            Get the views your videos deserve!
          </h1>

          {/* Subheadline */}
          <p className="mt-6 text-lg text-gray-600 md:text-xl">
            Run professionally managed Google Ads campaigns designed to grow
            your YouTube channel and attract real viewers.
          </p>

          {/* CTA Button */}
          <div className="mt-8">
            <a
              href="/login"
              className="inline-block rounded-xl bg-red-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-red-700"
            >
              Sign in with your Google Account
            </a>
          </div>

          {/* Secondary Text */}
          <p className="mt-4 text-sm text-gray-500">
            Start your first campaign in minutes.
          </p>

        </div>
      </section>


      {/* WHAT YOUR AD WILL LOOK LIKE */}
      <section className="bg-black px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">

          <h2 className="text-center text-3xl font-bold md:text-5xl">
            What your YouTube ad will look like!
          </h2>

          <p className="mt-6 text-center text-lg text-gray-300">
            Your videos can appear across YouTube to reach viewers who are most
            likely to enjoy your content.
          </p>


          {/* YouTube Ad Examples */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">

            {/* Image 1 */}
            <div>
              <div className="overflow-hidden rounded-xl">
                <img
                  src="/youtube-search-results.png"
                  alt="YouTube Search Results"
                  className="aspect-square w-full object-cover"
                />
              </div>

              <h3 className="mt-4 text-center text-xl font-semibold">
                YouTube Search Results
              </h3>
            </div>


            {/* Image 2 */}
            <div>
              <div className="overflow-hidden rounded-xl">
                <img
                  src="/youtube-home-feed.png"
                  alt="YouTube Home Feed"
                  className="aspect-square w-full object-cover"
                />
              </div>

              <h3 className="mt-4 text-center text-xl font-semibold">
                YouTube Home Feed
              </h3>
            </div>


            {/* Image 3 */}
            <div>
              <div className="overflow-hidden rounded-xl">
                <img
                  src="/youtube-suggested-videos.png"
                  alt="Suggested Videos"
                  className="aspect-square w-full object-cover"
                />
              </div>

              <h3 className="mt-4 text-center text-xl font-semibold">
                Suggested Videos
              </h3>
            </div>

          </div>


          {/* Button */}
          <div className="mt-16 text-center">
            <a
              href="/login"
              className="inline-block rounded-xl bg-red-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-red-700"
            >
              Start My Promotion
            </a>
          </div>

        </div>
      </section>


      {/* ABOUT */}
      <section
        id="about"
        className="bg-white px-6 py-24"
      >
        <div className="mx-auto max-w-5xl">

          <h2 className="text-center text-3xl font-bold text-black md:text-5xl">
            How VidStandMedia Works
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-center text-lg text-gray-600">
            We make it easy to promote your YouTube videos with professionally
            managed Google Ads campaigns. You focus on creating great content—we
            handle the advertising.
          </p>


          <div className="mt-16 grid gap-8 md:grid-cols-2">

            {/* Step 1 */}
            <div className="rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-black">
                1. Sign In
              </h3>

              <p className="mt-4 text-gray-600">
                Sign in securely with your Google Account so we can connect your
                videos and campaign information.
              </p>
            </div>


            {/* Step 2 */}
            <div className="rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-black">
                2. Choose Your Campaign
              </h3>

              <p className="mt-4 text-gray-600">
                Select the video you want to promote, choose your budget, and
                tell us what audience you want to reach.
              </p>
            </div>


            {/* Step 3 */}
            <div className="rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-black">
                3. We Launch Your Ads
              </h3>

              <p className="mt-4 text-gray-600">
                We create and manage your Google Ads campaign using best
                practices to help your video reach viewers who are interested
                in your content.
              </p>
            </div>


            {/* Step 4 */}
            <div className="rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-black">
                4. Track Your Growth
              </h3>

              <p className="mt-4 text-gray-600">
                Watch your campaign grow while we continue managing and
                optimizing your promotion.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* TRUST SECTION */}
      <section className="bg-gray-900 px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl">

          <h2 className="text-center text-3xl font-bold md:text-4xl">
            Why Choose VidStandMedia?
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-center text-lg text-gray-300">
            We are committed to helping YouTube creators grow their channels
            through professional advertising practices and transparent campaign
            management.
          </p>


          <div className="mt-16 grid gap-6 md:grid-cols-2">

            {/* Trust Item 1 */}
            <div className="rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold">
                ✓ Professionally Managed Campaigns
              </h3>

              <p className="mt-3 text-gray-300">
                Every Google Ads campaign is carefully configured and monitored
                to help you reach viewers who are most likely to enjoy your
                content.
              </p>
            </div>


            {/* Trust Item 2 */}
            <div className="rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold">
                ✓ Official Google Advertising Platform
              </h3>

              <p className="mt-3 text-gray-300">
                Every campaign is created and managed using Google's official
                advertising platform for YouTube video promotion.
              </p>
            </div>


            {/* Trust Item 3 */}
            <div className="rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold">
                ✓ Policy-Focused Management
              </h3>

              <p className="mt-3 text-gray-300">
                Our campaigns are designed with Google's advertising policies
                and YouTube's Terms of Service in mind.
              </p>
            </div>


            {/* Trust Item 4 */}
            <div className="rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold">
                ✓ Real Viewers — Never Bots
              </h3>

              <p className="mt-3 text-gray-300">
                We promote your videos through professionally managed Google
                Ads campaigns to help you reach real YouTube users. We do not
                use bots, fake views, or artificial engagement.
              </p>
            </div>

          </div>


          {/* Final CTA */}
          <div className="mt-16 text-center">
            <a
              href="/login"
              className="inline-block rounded-xl bg-red-600 px-10 py-4 text-lg font-semibold text-white transition hover:bg-red-700"
            >
              Sign Up Now
            </a>
          </div>

        </div>
      </section>

    </main>
  );
}