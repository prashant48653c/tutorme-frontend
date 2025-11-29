export type Status = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Course {
  id?: number;
  title?: string;
  description?: string;
  price?: number;
  tags: string[];
  courseStatus?: Status;
  duration?: string;
  durationUnit?: string;

  chapterCount?: number;
  targetUniversity?: string;
  targetCourse?: string;
  targetSem?: string;
  courseDepth?: string;
  thumbnail?: string;
  createdAt?: string; // ISO string
  updatedAt?: string;
  tutorProfileId?: number;
  isQueryClassAvailable?: boolean;
  classDuration?: number;
  startDate?: string;
  endDate?: string;

  tutor?: TutorProfile;
  chapters?: Chapter[];
  resource?: Resource[];
  questions?: Question[];
  assignment?: Assignment[];
  courseReview?: CourseReview[];
}
export interface Enrollment{
  id?:number;
  courseId?:number;
  studentProfileId?:number;
  course: Course;
}

export interface Chapter {
  id?: number;
  courseId?: number;
  title?: string;
  description?: string;
  video?: string;
  subtitle?: string;

  subChapters?: SubChapter[];
}

export interface SubChapter {
  id?: number;
 
  title?: string;
  description?: string;
  video?: string;
  subtitle?: string;

  subHeadings?: SubHeading[];
}

export interface SubHeading {
  id?: number;
  subid?: number;
  title?: string;
  description?: string;
  video?: string;
  subtitle?: string;
}

export interface Resource {
  id?: number;
  courseId?: number;
  title?: string;
  description?: string;
  pdf?:string;
}

export interface Question {
  id?: number;
  courseId?: number;
  title?: string;
  description?: string;
  pdf?:string;

}

export interface Assignment {
  id?: number;
  courseId?: number;
  title?: string;
  description?: string;
  pdf?:string;

}

export interface TutorProfile {
  id?: number;
  name?: string;
  // Add other fields as needed
}

export interface CourseReview {
  id?: number;
  courseId?: number;
  rating?: number;
  comment?: string;
  // Add other fields as needed
}




export type SessionStatus = "SCHEDULED" | "COMPLETED" | "CANCELLED"; // adjust based on your enum

export interface TimeSlot {
  day: string;
  startTime: string;  
  endTime: string;   
}

export interface Session {
  id: number;
  description: string;
  status: SessionStatus;
  language: string[];
  tutorProfileId: number;
  duration: TimeSlot[];   
  price: number;
  updatedAt:string;
 
}
