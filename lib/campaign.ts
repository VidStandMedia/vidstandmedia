export type CampaignChannel = {
  id: string;
  title: string;
  thumbnail: string;
  email: string;
};

export type CampaignVideo = {
  id: string;
  title: string;
  thumbnail: string;
  publishedAt: string;
  viewCount: number;
  duration: string;
  privacyStatus: string;
};

export type CampaignAudience = {
  country: string;
  language: string;
  gender: string;
  ageGroups: string[];
  interests: string[];
};

export type Campaign = {
  goal: string;
  budget: string;
  channel: CampaignChannel;
  video: CampaignVideo;
  audience: CampaignAudience;
};

let campaign: Campaign = {
  goal: "",
  budget: "",

  channel: {
    id: "",
    title: "",
    thumbnail: "",
    email: "",
  },

  video: {
    id: "",
    title: "",
    thumbnail: "",
    publishedAt: "",
    viewCount: 0,
    duration: "",
    privacyStatus: "",
  },

  audience: {
    country: "",
    language: "",
    gender: "",
    ageGroups: [],
    interests: [],
  },
};

export function saveCampaignGoal(goal: string) {
  campaign.goal = goal;
}

export function saveCampaignBudget(budget: string) {
  campaign.budget = budget;
}

export function saveCampaignChannel(channel: CampaignChannel) {
  campaign.channel = channel;
}

export function saveCampaignVideo(video: CampaignVideo) {
  campaign.video = video;
}

export function saveCampaignAudience(
  audience: CampaignAudience
) {
  campaign.audience = audience;
}

export function getCampaign() {
  return campaign;
}

export function resetCampaign() {
  campaign = {
    goal: "",
    budget: "",

    channel: {
      id: "",
      title: "",
      thumbnail: "",
      email: "",
    },

    video: {
      id: "",
      title: "",
      thumbnail: "",
      publishedAt: "",
      viewCount: 0,
      duration: "",
      privacyStatus: "",
    },

    audience: {
      country: "",
      language: "",
      gender: "",
      ageGroups: [],
      interests: [],
    },
  };
}