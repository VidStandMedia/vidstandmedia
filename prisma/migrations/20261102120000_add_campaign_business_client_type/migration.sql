ALTER TABLE "CampaignBusiness"
ADD COLUMN IF NOT EXISTS "clientType" TEXT NOT NULL DEFAULT 'business';