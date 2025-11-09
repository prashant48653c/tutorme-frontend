import { create } from 'zustand';
import type {
  Course,
  Resource,
  Assignment,
  Chapter,
  Question,
  CourseReview,
  TutorProfile,
} from '@/types/course'; // Update with correct path

interface CourseState {
  course: Course | null;
  setCourse: (course: Course) => void;

  resource: Resource[];
  setResource: (resource: Resource[]) => void;

  assignment: Assignment[];
  setAssignment: (assignment: Assignment[]) => void;

  chapters: Chapter[];
  setChapters: (chapters: Chapter[]) => void;

  questions: Question[];
  setQuestions: (questions: Question[]) => void;

  courseReview: CourseReview[];
  setCourseReview: (reviews: CourseReview[]) => void;

  tutor: TutorProfile | null;
  setTutor: (tutor: TutorProfile) => void;

  resetCourseState: () => void;
}

export const useGlobalCourseStore = create<CourseState>((set) => ({
  course: null,
  setCourse: (course) =>
    set({
      course,
      resource: course.resource || [],
      assignment: course.assignment || [],
      chapters: course.chapters || [],
      questions: course.questions || [],
      courseReview: course.courseReview || [],
      tutor: course.tutor || null,
    }),

  resource: [],
  setResource: (resource) => set({ resource }),

  assignment: [],
  setAssignment: (assignment) => set({ assignment }),

  chapters: [],
  setChapters: (chapters) => set({ chapters }),

  questions: [],
  setQuestions: (questions) => set({ questions }),

  courseReview: [],
  setCourseReview: (courseReview) => set({ courseReview }),

  tutor: null,
  setTutor: (tutor) => set({ tutor }),

  resetCourseState: () =>
    set({
      course: null,
      resource: [],
      assignment: [],
      chapters: [],
      questions: [],
      courseReview: [],
      tutor: null,
    }),
}));
