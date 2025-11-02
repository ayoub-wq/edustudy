import type { Part } from '@google/genai';

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  fileUrl: string;
}

export interface StudyGroup {
  id: string;
  name: string;
  courseCode: string;
  members: number;
  capacity: number;
}

export interface Student {
  id:string;
  name: string;
  major: string;
  courses: string[];
  avatarUrl: string;
  isConnected?: boolean;
}

export type View = 'courses' | 'groups' | 'partners' | 'assistant';

export interface ChatMessage {
  role: 'user' | 'model';
  parts: Part[];
  file?: {
    name: string;
    type: string;
  }
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}
