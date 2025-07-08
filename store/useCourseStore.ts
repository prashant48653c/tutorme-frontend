import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/auth';
import { Course } from '@/types/course';


 
interface AuthState {
  course:Course & any | null;
  isLoading: boolean;
   
  setCourse: (course: Course & any| null) => void;
  setLoading: (loading: boolean) => void;
  
}

export const useCourseStore = create<AuthState>()(
  persist(
    (set) => ({
      course: null,
      isLoading: false,
      
      setCourse: (course:Course | null) =>
        set({
          course,
          
        }),
      setLoading: (isLoading) => set({ isLoading }),
     
    }),
    {
      name: 'course-storage',
      partialize: (state) => ({
        course: state.course,
         
      }),
    }
  )
);