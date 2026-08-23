import "server-only";

import { prisma } from "@/lib/prisma";
import type { Campaign } from "@/lib/session/campaign";

type SaveCampaignInput = {
  userId: string;
  campaign: Campaign;
};

export async function saveCampaignToDatabase({
  userId,
  campaign,
}: SaveCampaignInput) {
  return prisma.campaign.upsert({
    where: {
      id: campaign.id,
    },

    create: {
      id: campaign.id,
      userId,

      goal: campaign.goal,
      budget: campaign.budget,

      channel: {
        create: {
          youtubeChannelId: campaign.channel.id,
          title: campaign.channel.title,
          thumbnail: campaign.channel.thumbnail,
          email: campaign.channel.email,
        },
      },

      googleAds: {
        create: {
          hasAccount: campaign.googleAds.hasAccount,
          customerId: campaign.googleAds.customerId,
          accountName: campaign.googleAds.accountName,
          currency: campaign.googleAds.currency,
          timeZone: campaign.googleAds.timeZone,
          verified: campaign.googleAds.verified,
          managerInvitationSent:
            campaign.googleAds.managerInvitationSent,
          managerAccessAccepted:
            campaign.googleAds.managerAccessAccepted,
        },
      },

      business: {
        create: {
          companyName: campaign.business.companyName,
          website: campaign.business.website,
          category: campaign.business.category,
          timeZone: campaign.business.timeZone,
        },
      },

      video: {
        create: {
          youtubeVideoId: campaign.video.id,
          title: campaign.video.title,
          thumbnail: campaign.video.thumbnail,
          publishedAt: campaign.video.publishedAt,
          viewCount: campaign.video.viewCount,
          duration: campaign.video.duration,
          privacyStatus: campaign.video.privacyStatus,
        },
      },

      audience: {
        create: {
          country: campaign.audience.country,
          language: campaign.audience.language,
          gender: campaign.audience.gender,
          ageGroups: campaign.audience.ageGroups,
          interests: campaign.audience.interests,
        },
      },

      agreement: {
        create: {
          termsAccepted: campaign.agreement.termsAccepted,
          privacyAccepted: campaign.agreement.privacyAccepted,
          advertisingAuthorized:
            campaign.agreement.advertisingAuthorized,
          acceptedAt: campaign.agreement.acceptedAt
            ? new Date(campaign.agreement.acceptedAt)
            : null,
        },
      },

      payment: {
        create: {
          managementFee: campaign.payment.managementFee,
          managementPlan: campaign.payment.managementPlan,
          stripeCheckoutSessionId:
            campaign.payment.stripeCheckoutSessionId || null,
          stripeCustomerId:
            campaign.payment.stripeCustomerId || null,
          stripeSubscriptionId:
            campaign.payment.stripeSubscriptionId || null,
          paymentStatus: campaign.payment.paymentStatus,
          paidAt: campaign.payment.paidAt
            ? new Date(campaign.payment.paidAt)
            : null,
        },
      },
    },

    update: {
      goal: campaign.goal,
      budget: campaign.budget,

      channel: {
        upsert: {
          create: {
            youtubeChannelId: campaign.channel.id,
            title: campaign.channel.title,
            thumbnail: campaign.channel.thumbnail,
            email: campaign.channel.email,
          },
          update: {
            youtubeChannelId: campaign.channel.id,
            title: campaign.channel.title,
            thumbnail: campaign.channel.thumbnail,
            email: campaign.channel.email,
          },
        },
      },

      googleAds: {
        upsert: {
          create: {
            hasAccount: campaign.googleAds.hasAccount,
            customerId: campaign.googleAds.customerId,
            accountName: campaign.googleAds.accountName,
            currency: campaign.googleAds.currency,
            timeZone: campaign.googleAds.timeZone,
            verified: campaign.googleAds.verified,
            managerInvitationSent:
              campaign.googleAds.managerInvitationSent,
            managerAccessAccepted:
              campaign.googleAds.managerAccessAccepted,
          },
          update: {
            hasAccount: campaign.googleAds.hasAccount,
            customerId: campaign.googleAds.customerId,
            accountName: campaign.googleAds.accountName,
            currency: campaign.googleAds.currency,
            timeZone: campaign.googleAds.timeZone,
            verified: campaign.googleAds.verified,
            managerInvitationSent:
              campaign.googleAds.managerInvitationSent,
            managerAccessAccepted:
              campaign.googleAds.managerAccessAccepted,
          },
        },
      },

      business: {
        upsert: {
          create: {
            companyName: campaign.business.companyName,
            website: campaign.business.website,
            category: campaign.business.category,
            timeZone: campaign.business.timeZone,
          },
          update: {
            companyName: campaign.business.companyName,
            website: campaign.business.website,
            category: campaign.business.category,
            timeZone: campaign.business.timeZone,
          },
        },
      },

      video: {
        upsert: {
          create: {
            youtubeVideoId: campaign.video.id,
            title: campaign.video.title,
            thumbnail: campaign.video.thumbnail,
            publishedAt: campaign.video.publishedAt,
            viewCount: campaign.video.viewCount,
            duration: campaign.video.duration,
            privacyStatus: campaign.video.privacyStatus,
          },
          update: {
            youtubeVideoId: campaign.video.id,
            title: campaign.video.title,
            thumbnail: campaign.video.thumbnail,
            publishedAt: campaign.video.publishedAt,
            viewCount: campaign.video.viewCount,
            duration: campaign.video.duration,
            privacyStatus: campaign.video.privacyStatus,
          },
        },
      },

      audience: {
        upsert: {
          create: {
            country: campaign.audience.country,
            language: campaign.audience.language,
            gender: campaign.audience.gender,
            ageGroups: campaign.audience.ageGroups,
            interests: campaign.audience.interests,
          },
          update: {
            country: campaign.audience.country,
            language: campaign.audience.language,
            gender: campaign.audience.gender,
            ageGroups: campaign.audience.ageGroups,
            interests: campaign.audience.interests,
          },
        },
      },

      agreement: {
        upsert: {
          create: {
            termsAccepted: campaign.agreement.termsAccepted,
            privacyAccepted: campaign.agreement.privacyAccepted,
            advertisingAuthorized:
              campaign.agreement.advertisingAuthorized,
            acceptedAt: campaign.agreement.acceptedAt
              ? new Date(campaign.agreement.acceptedAt)
              : null,
          },
          update: {
            termsAccepted: campaign.agreement.termsAccepted,
            privacyAccepted: campaign.agreement.privacyAccepted,
            advertisingAuthorized:
              campaign.agreement.advertisingAuthorized,
            acceptedAt: campaign.agreement.acceptedAt
              ? new Date(campaign.agreement.acceptedAt)
              : null,
          },
        },
      },

      payment: {
        upsert: {
          create: {
            managementFee: campaign.payment.managementFee,
            managementPlan: campaign.payment.managementPlan,
            stripeCheckoutSessionId:
              campaign.payment.stripeCheckoutSessionId || null,
            stripeCustomerId:
              campaign.payment.stripeCustomerId || null,
            stripeSubscriptionId:
              campaign.payment.stripeSubscriptionId || null,
            paymentStatus: campaign.payment.paymentStatus,
            paidAt: campaign.payment.paidAt
              ? new Date(campaign.payment.paidAt)
              : null,
          },
          update: {
            managementFee: campaign.payment.managementFee,
            managementPlan: campaign.payment.managementPlan,
            stripeCheckoutSessionId:
              campaign.payment.stripeCheckoutSessionId || null,
            stripeCustomerId:
              campaign.payment.stripeCustomerId || null,
            stripeSubscriptionId:
              campaign.payment.stripeSubscriptionId || null,
            paymentStatus: campaign.payment.paymentStatus,
            paidAt: campaign.payment.paidAt
              ? new Date(campaign.payment.paidAt)
              : null,
          },
        },
      },
    },
  });
}