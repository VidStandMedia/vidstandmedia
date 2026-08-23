-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "goal" TEXT NOT NULL,
    "budget" TEXT NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignChannel" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "youtubeChannelId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "CampaignChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignGoogleAds" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "hasAccount" BOOLEAN,
    "customerId" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL,
    "managerInvitationSent" BOOLEAN NOT NULL,
    "managerAccessAccepted" BOOLEAN NOT NULL,

    CONSTRAINT "CampaignGoogleAds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignBusiness" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "website" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,

    CONSTRAINT "CampaignBusiness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignVideo" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "youtubeVideoId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "publishedAt" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL,
    "duration" TEXT NOT NULL,
    "privacyStatus" TEXT NOT NULL,

    CONSTRAINT "CampaignVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignAudience" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "ageGroups" TEXT[],
    "interests" TEXT[],

    CONSTRAINT "CampaignAudience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignAgreement" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "termsAccepted" BOOLEAN NOT NULL,
    "privacyAccepted" BOOLEAN NOT NULL,
    "advertisingAuthorized" BOOLEAN NOT NULL,
    "acceptedAt" TIMESTAMP(3),

    CONSTRAINT "CampaignAgreement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CampaignPayment" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "managementFee" DECIMAL(10,2) NOT NULL,
    "managementPlan" TEXT NOT NULL,
    "stripeCheckoutSessionId" TEXT,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "paymentStatus" TEXT NOT NULL,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CampaignPayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Campaign_userId_idx" ON "Campaign"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignChannel_campaignId_key" ON "CampaignChannel"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignGoogleAds_campaignId_key" ON "CampaignGoogleAds"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignBusiness_campaignId_key" ON "CampaignBusiness"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignVideo_campaignId_key" ON "CampaignVideo"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignAudience_campaignId_key" ON "CampaignAudience"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignAgreement_campaignId_key" ON "CampaignAgreement"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "CampaignPayment_campaignId_key" ON "CampaignPayment"("campaignId");

-- CreateIndex
CREATE INDEX "CampaignPayment_stripeCustomerId_idx" ON "CampaignPayment"("stripeCustomerId");

-- CreateIndex
CREATE INDEX "CampaignPayment_stripeSubscriptionId_idx" ON "CampaignPayment"("stripeSubscriptionId");

-- CreateIndex
CREATE INDEX "CampaignPayment_stripeCheckoutSessionId_idx" ON "CampaignPayment"("stripeCheckoutSessionId");

-- AddForeignKey
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignChannel" ADD CONSTRAINT "CampaignChannel_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignGoogleAds" ADD CONSTRAINT "CampaignGoogleAds_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignBusiness" ADD CONSTRAINT "CampaignBusiness_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignVideo" ADD CONSTRAINT "CampaignVideo_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignAudience" ADD CONSTRAINT "CampaignAudience_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignAgreement" ADD CONSTRAINT "CampaignAgreement_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CampaignPayment" ADD CONSTRAINT "CampaignPayment_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;
