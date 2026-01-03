
import React from 'react';

export enum UserRole {
  GUEST = 'guest',
  ADMIN = 'admin',
  TEACHER = 'teacher',
  STUDENT = 'student',
  PARENT = 'parent',
  ACCOUNTANT = 'accountant'
}

export enum StudentType {
  INSTITUTIONAL = 'institutional',
  INDEPENDENT = 'independent'
}

export enum AnnouncementStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum AnnouncementType {
  ANNOUNCEMENT = 'announcement',
  EVENT = 'event'
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  status: AnnouncementStatus;
  date: string;
  authorRole: UserRole;
  authorId: string;
  authorName: string;
  assignedTeacherId?: string; // لربط المنشور بمعلم معين
  mediaUrl?: string;
  mediaType?: 'image' | 'pdf' | 'video';
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  username: string;
  role: UserRole;
  studentType?: StudentType;
  assignedTeacherId?: string; // للطالب: من هو معلمه؟
  aiQuestionsCount: number;
  lastUsedDate?: string;
}

export enum QuestionType {
  TRUE_FALSE = 'true_false',
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  SHORT_ESSAY = 'short_essay',
  IMAGE_HOTSPOT = 'image_hotspot'
}

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: { id: string; text: string }[];
  correctAnswer?: string | string[];
  correctPoint?: { x: number; y: number };
  imageUrl?: string;
  points: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  teacherId: string;
  status: AnnouncementStatus;
  durationMinutes: number;
  questions: Question[];
  createdAt: string;
}
