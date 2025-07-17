import { type Timestamp } from 'firebase/firestore';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface Content {
  id: string;
  title: string;
  body: string;
  pillar: 'Memory' | 'Attention' | 'Reasoning' | 'Creativity' | 'Wellness';
  createdAt: Timestamp;
  imageUrl?: string;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  scores: {
    memory: number;
    attention: number;
    reasoning: number;
  };
  feedback: string;
  recommendations: string;
  createdAt: Timestamp;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL: string | null;
  content: string;
  likes: string[]; // Array of user IDs
  commentCount: number;
  createdAt: Timestamp;
}

export interface Comment {
  id: string;
  userId: string;
  userDisplayName: string;
  userPhotoURL: string | null;
  content: string;
  createdAt: Timestamp;
}
