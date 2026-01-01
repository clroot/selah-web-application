export const LookbackPrayerTopicStatus = {
  PRAYING: "PRAYING",
  ANSWERED: "ANSWERED",
} as const;

export type LookbackPrayerTopicStatus =
  (typeof LookbackPrayerTopicStatus)[keyof typeof LookbackPrayerTopicStatus];

export interface LookbackPrayerTopic {
  id: string;
  title: string;
  status: LookbackPrayerTopicStatus;
  answeredAt: string | null;
  reflection: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LookbackResponse {
  prayerTopic: LookbackPrayerTopic;
  selectedAt: string;
  daysSinceCreated: number;
}

export interface DecryptedLookbackResponse {
  prayerTopic: LookbackPrayerTopic;
  selectedAt: string;
  daysSinceCreated: number;
}
