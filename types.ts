
export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}

export interface Session {
  access_token: string;
  user: User;
}

export interface ChatMessage {
  id: string;

  message: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

export interface HealthLog {
  id: string;
  userId: string;
  cameraResult: string; // Simplified for this version
  aiFeedback: string;
  createdAt: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
        reviewSnippets?: {
            uri: string;
            text: string;
            author: string;
        }[];
    }
  };
}
