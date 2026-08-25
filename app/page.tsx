export default function Home() {
  return (
    <main className="bg-white text-black">

      {/* HERO SECTION */}
      <section className="flex min-h-[80vh] items-center justify-center px-6">
        <div className="mx-auto max-w-4xl text-center">

          <h1 className="mt-10 text-3xl font-extrabold tracking-tight md:text-5xl">
            Welcome to VidStandMedia!
          </h1>

          <p className="mx-auto mt-4 max-w-3xl text-lg text-gray-600 md:text-xl">
            We are a digital advertising agency and web platform focused on
            helping YouTube creators get more views on their videos through
            professionally managed Google Ads campaigns.

          </p>

          <h2 className="mt-10 text-2xl font-bold tracking-tight md:text-3xl">
            Get the views your videos deserve!
          </h2>


          <div className="mt-8">
            <a
              href="/login"
              className="inline-block rounded-xl bg-red-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-red-700"
            >
              Sign up with your Google Account
            </a>
          </div>

          <p className="mt-4 text-sm text-gray-500">
            Start your first campaign in minutes.
          </p>

        </div>
      </section>


      {/* GOOGLE ADS CAMPAIGN MANAGEMENT */}
      <section className="bg-gray-100 px-6 py-24">
        <div className="mx-auto max-w-5xl">

          <h2 className="text-center text-3xl font-bold text-black md:text-5xl">
            Google Ads Campaign Management
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-center text-lg text-gray-600">
            VidStandMedia helps YouTube creators promote their videos through
            professionally managed Google Ads campaigns.
          </p>

          <div className="mt-12 space-y-8">

            {/* Professional Campaign Management */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-black">
                Professional Campaign Management
              </h3>

              <p className="mt-4 leading-8 text-gray-600">
                VidStandMedia provides campaign setup, configuration,
                management, optimization, monitoring, and reporting services
                for YouTube advertising campaigns. We help clients use Google
                Ads to promote their videos to audiences that may be interested
                in their content.
              </p>
            </div>


            {/* Client-Owned Google Ads Accounts */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-black">
                Client-Owned Google Ads Accounts
              </h3>

              <p className="mt-4 leading-8 text-gray-600">
                Clients retain ownership and control of their Google Ads
                accounts. VidStandMedia provides campaign management services
                through authorized access to the client's advertising account.
                Clients remain responsible for their Google Ads account and
                advertising payment method.
              </p>
            </div>


            {/* Google Ads API */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-black">
                Google Ads API
              </h3>

              <p className="mt-4 leading-8 text-gray-600">
                When authorized by the client, VidStandMedia uses Google's
                advertising platform and Google Ads API to support campaign
                management and reporting. API-supported activities may include
                creating and managing advertising campaigns, configuring
                campaign settings, monitoring campaign performance, retrieving
                advertising information, and supporting campaign reporting.
              </p>
            </div>


            {/* Advertising Budget and Management Fees */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-black">
                Advertising Budget and Management Fees
              </h3>

              <p className="mt-4 leading-8 text-gray-600">
                Clients pay Google directly for their advertising costs through
                their Google Ads account. VidStandMedia does not collect or
                hold the client's Google Ads advertising budget. VidStandMedia
                charges a separate management fee for providing campaign
                management and optimization services.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* WHAT YOUR YOUTUBE AD WILL LOOK LIKE */}
      <section className="bg-black px-6 py-24 text-white">
        <div className="mx-auto max-w-7xl">

          <h2 className="text-center text-3xl font-bold md:text-5xl">
            What your YouTube ad will look like!
          </h2>

          <p className="mx-auto mt-6 max-w-4xl text-center text-lg text-gray-300">
            Your ad can appear in YouTube Search, on the Home feed, or
            alongside other relevant videos. We use your chosen audience,
            interests, location, and budget to help connect your content with
            viewers who are more likely to watch and discover your channel.
          </p>


          {/* YouTube Ad Examples */}
          <div className="mt-16 grid gap-8 md:grid-cols-3">

            {/* Image 1 */}
            <div>
              <h3 className="mb-4 text-center text-xl font-semibold">
                YouTube Search Results
              </h3>

              <div className="overflow-hidden rounded-xl">
                <img
                  src="/youtube-search-results.png"
                  alt="Example of a YouTube Search Results advertisement"
                  className="aspect-square w-full object-cover"
                />
              </div>
            </div>


            {/* Image 2 */}
            <div>
              <h3 className="mb-4 text-center text-xl font-semibold">
                YouTube Home Feed
              </h3>

              <div className="overflow-hidden rounded-xl">
                <img
                  src="/youtube-home-feed.png"
                  alt="Example of a YouTube Home Feed advertisement"
                  className="aspect-square w-full object-cover"
                />
              </div>
            </div>


            {/* Image 3 */}
            <div>
              <h3 className="mb-4 text-center text-xl font-semibold">
                Suggested Videos
              </h3>

              <div className="overflow-hidden rounded-xl">
                <img
                  src="/youtube-suggested-videos.png"
                  alt="Example of a Suggested Videos advertisement on YouTube"
                  className="aspect-square w-full object-cover"
                />
              </div>
            </div>

          </div>


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


      {/* HOW VIDSTANDMEDIA WORKS */}
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
            managed Google Ads campaigns. Sign in with your Google Account,
            choose your video and campaign settings, and let VidStandMedia
            handle the advertising management from setup through ongoing
            optimization.
          </p>


          <div className="mt-16 grid gap-8 md:grid-cols-2">

            {/* Step 1 */}
            <div className="rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-black">
                1. Sign In
              </h3>

              <p className="mt-4 text-gray-600">
                Securely connect your Google Account so VidStandMedia can
                connect your YouTube channel and retrieve the information
                needed for your campaign.
              </p>
            </div>


            {/* Step 2 */}
            <div className="rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-black">
                2. Choose Your Campaign
              </h3>

              <p className="mt-4 text-gray-600">
                Select the video you want to promote, choose your campaign goal
                and advertising budget, and tell us about the audience you want
                to reach.
              </p>
            </div>


            {/* Step 3 */}
            <div className="rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-black">
                3. We Launch Your Ads
              </h3>

              <p className="mt-4 text-gray-600">
                VidStandMedia sets up and manages your Google Ads campaign.
                Your video can appear across YouTube in places such as Search,
                the Home feed, and alongside relevant videos.
              </p>
            </div>


            {/* Step 4 */}
            <div className="rounded-2xl border border-gray-200 p-8 shadow-sm">
              <h3 className="text-2xl font-bold text-black">
                4. Track Your Campaign
              </h3>

              <p className="mt-4 text-gray-600">
                We monitor your campaign and manage its performance while you
                continue creating content. Your advertising budget remains
                under your control through your Google Ads account.
              </p>
            </div>

          </div>

        </div>
      </section>


      {/* WHY CHOOSE VIDSTANDMEDIA */}
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


            <div className="rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold">
                ✓ Official Google Advertising Platform
              </h3>

              <p className="mt-3 text-gray-300">
                Every campaign is created and managed using Google's official
                advertising platform for YouTube video promotion.
              </p>
            </div>


            <div className="rounded-xl border border-gray-700 p-6">
              <h3 className="text-xl font-semibold">
                ✓ Policy-Focused Management
              </h3>

              <p className="mt-3 text-gray-300">
                Our campaigns are designed with Google's advertising policies
                and YouTube's Terms of Service in mind.
              </p>
            </div>


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