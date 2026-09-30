export type ContentKind = 'post' | 'project' | 'service' | 'job';

export type VerificationStatus = 'none' | 'pending' | 'verified';

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  email: string;
  headline: string;
  location: string;
}

export interface FeedItem {
  id: string;
  kind: ContentKind;
  author: UserProfile;
  createdAt: string;
  title?: string;
  body: string;
  tags: string[];
  likes: number;
  comments: number;
  verification: VerificationStatus;
  status?: 'active' | 'completed' | 'open';
}

export interface AccountRecord extends UserProfile {
  passwordHash: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  recipientId: string;
  ciphertext: string;
  iv: string;
  createdAt: string;
}

export interface MessagePreview {
  id: string;
  senderId: string;
  recipientId: string;
  body: string;
  createdAt: string;
}

