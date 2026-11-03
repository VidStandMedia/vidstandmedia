-- CreateTable
CREATE TABLE "GoogleAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refreshTokenEncrypted" TEXT,
    "scope" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChannelAnalytics" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channelId" TEXT NOT NULL,
    "snapshotDate" DATE NOT NULL,
    "subscriberCount" BIGINT NOT NULL,
    "viewCount" BIGINT NOT NULL,
    "videoCount" INTEGER NOT NULL,
    "watchTimeMinutes" DOUBLE PRECISION,
    "averageViewDurationSeconds" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChannelAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "GoogleAccount_userId_key" ON "GoogleAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GoogleAccount_providerAccountId_key" ON "GoogleAccount"("providerAccountId");

-- CreateIndex
CREATE INDEX "GoogleAccount_providerAccountId_idx" ON "GoogleAccount"("providerAccountId");

-- CreateIndex
CREATE INDEX "ChannelAnalytics_userId_snapshotDate_idx" ON "ChannelAnalytics"("userId", "snapshotDate");

-- CreateIndex
CREATE INDEX "ChannelAnalytics_channelId_idx" ON "ChannelAnalytics"("channelId");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelAnalytics_channelId_snapshotDate_key" ON "ChannelAnalytics"("channelId", "snapshotDate");

-- AddForeignKey
ALTER TABLE "GoogleAccount" ADD CONSTRAINT "GoogleAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChannelAnalytics" ADD CONSTRAINT "ChannelAnalytics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
