// store/courseStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export type SubHeading = {
  id: number
  title: string
  video?: string
  subtitle?: string
  description?:string
}

export type SubTitle = {
  id: number
  title: string
  video?: string
  subtitle?: string
  description?:string
  subHeadings: SubHeading[]
}

export type Chapter = {
  id: number
  title: string
  video?: string
  subtitle?: string
  description?:string
  subChapters: SubTitle[]
}

export type CourseDetails = {
 id?: number;
  title?: string;
  description?: string;
  tags: string[];
  price?: number;
  courseStatus?: string;
  duration: string;
  durationUnit:string;
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
}

type CourseStore = {
  // State
  courseDetails: CourseDetails
  chapters: Chapter[]
  openChapters: Record<string, boolean>
  opensubChapters: Record<string, boolean>
  isLoading: boolean
  isSaving: boolean
  isDraftSaved: boolean

  // Actions
  setLoading: (loading: boolean) => void
  setSaving: (saving: boolean) => void
  setDraftSaved: (saved: boolean) => void
  updateCourseDetails: (details: Partial<CourseDetails>) => void
  
  // Chapter actions
  addChapter: () => void
  deleteChapter: (id: string) => void
  updatetitle: (id: string, name: string) => void
  toggleChapter: (id: string) => void
  
  // SubTitle actions
  addSubTitle: (id: string) => void
  deleteSubTitle: (subId: string) => void
  updateSubTitleName: (subId: string, name: string) => void
  toggleSubTitle: (subId: string) => void
  
  // SubHeading actions
  addSubHeading: (subId: string) => void
  deleteSubHeading: (subHeadId: string) => void
  updateSubHeadingName: (subHeadId: string, name: string) => void
  
  // Drag and drop
  reorderChapters: (startIndex: number, endIndex: number) => void
  reordersubChapters: (id: string, startIndex: number, endIndex: number) => void
  reorderSubHeadings: (subId: string, startIndex: number, endIndex: number) => void
  
  // Persistence
  
  setChapters: (chapters: Chapter[]) => void

  saveDraft: () => Promise<void>
  loadDraft: () => void
  
  // Reset
  reset: () => void
}

const initialCourseDetails: CourseDetails = {
  
  title:"",
  duration: "",
  classDuration: 0,
  description: "",
  durationUnit:"Weeks",
  targetUniversity: "",
  targetCourse: "",
  targetSem: "",
  courseDepth: "beginner",
  thumbnail: "",
  courseStatus:"",
  tags:[""]
}

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      // Initial state
      courseDetails: initialCourseDetails,
      chapters: [],
      openChapters: {},
      opensubChapters: {}, 
      isLoading: false,
      isSaving: false,
      isDraftSaved: false,


      // Simple actions
      setLoading: (loading) => set({ isLoading: loading }),
      setSaving: (saving) => set({ isSaving: saving }),
      setDraftSaved: (saved) => set({ isDraftSaved: saved }),
      
      updateCourseDetails: (details) => 
        set((state) => ({
          courseDetails: { ...state.courseDetails, ...details }
        })),

      // Chapter actions
      
      addChapter: () => {
        const newChapter: Chapter = {
          id: Math.random() * 1000,
          title: `New Chapter ${get().chapters.length + 1}`,
          subChapters: [],
        }
        set((state) => ({
          chapters: [...state?.chapters, newChapter]
        }))
      },

      deleteChapter: (id) =>
        set((state) => ({
          chapters: state.chapters.filter(ch => ch.id.toString() !== id)
        })),

      updatetitle: (id, name) =>
        set((state) => ({
          chapters: state.chapters.map(chapter =>
            chapter.id.toString() === id
              ? { ...chapter, title: name }
              : chapter
          )
        })),

      toggleChapter: (id) =>
        set((state) => ({
          openChapters: {
            ...state.openChapters,
            [id]: !state.openChapters[id]
          }
        })),

      // SubTitle actions
      addSubTitle: (id) => {
        const newSubTitle: SubTitle = {
          id: Math.random() * 1000,
          title: "New Sub-Title",
          subHeadings: [],
        }
        set((state) => ({
          chapters: state.chapters.map(chapter =>
            chapter.id.toString() === id
              ? { ...chapter, subChapters: [...chapter.subChapters, newSubTitle] }
              : chapter
          )
        }))
      },

      deleteSubTitle: (subId) =>
        set((state) => ({
          chapters: state.chapters.map(chapter => ({
            ...chapter,
            subChapters: chapter.subChapters.filter(sub => sub.id.toString() !== subId)
          }))
        })),

      updateSubTitleName: (subId, name) =>
        set((state) => ({
          chapters: state.chapters.map(chapter => ({
            ...chapter,
            subChapters: chapter.subChapters.map(sub =>
              sub.id.toString() === subId ? { ...sub, title: name } : sub
            )
          }))
        })),

      toggleSubTitle: (subId) =>
        set((state) => ({
          opensubChapters: {
            ...state.opensubChapters,
            [subId]: !state.opensubChapters[subId]
          }
        })),

      // SubHeading actions
      addSubHeading: (subId) => {
        const newSubHeading: SubHeading = {
          id: Math.random() * 1000,
          title: "New Sub-Heading",
        }
        set((state) => ({
          chapters: state.chapters.map(chapter => ({
            ...chapter,
            subChapters: chapter.subChapters.map(sub =>
              sub.id.toString() == subId
                ? { ...sub, subHeadings: [...sub.subHeadings, newSubHeading] }
                : sub
            )
          }))
        }))
      },

      deleteSubHeading: (subHeadId) =>
        set((state) => ({
          chapters: state.chapters.map(chapter => ({
            ...chapter,
            subChapters: chapter.subChapters.map(sub => ({
              ...sub,
              subHeadings: sub.subHeadings.filter(head => head.id.toString() !== subHeadId)
            }))
          }))
        })),

      updateSubHeadingName: (subHeadId, name) =>
        set((state) => ({
          chapters: state.chapters.map(chapter => ({
            ...chapter,
            subChapters: chapter.subChapters.map(sub => ({
              ...sub,
              subHeadings: sub.subHeadings.map(head =>
                head.id.toString() === subHeadId
                  ? { ...head, title: name }
                  : head
              )
            }))
          }))
        })),

      // Drag and drop helpers
      reorderChapters: (startIndex, endIndex) => {
        const chapters = [...get().chapters]
        const [removed] = chapters.splice(startIndex, 1)
        chapters.splice(endIndex, 0, removed)
        set({ chapters })
      },

      reordersubChapters: (id, startIndex, endIndex) => {
        const chapters = get().chapters.map(chapter => {
          if (chapter.id.toString() === id) {
            const subChapters = [...chapter.subChapters]
            const [removed] = subChapters.splice(startIndex, 1)
            subChapters.splice(endIndex, 0, removed)
            return { ...chapter, subChapters }
          }
          return chapter
        })
        set({ chapters })
      },

      reorderSubHeadings: (subId, startIndex, endIndex) => {
        const chapters = get().chapters.map(chapter => ({
          ...chapter,
          subChapters: chapter.subChapters.map(sub => {
            if (sub.id.toString() === subId) {
              const subHeadings = [...sub.subHeadings]
              const [removed] = subHeadings.splice(startIndex, 1)
              subHeadings.splice(endIndex, 0, removed)
              return { ...sub, subHeadings }
            }
            return sub
          })
        }))
        set({ chapters })
      },

      // Persistence methods
      saveDraft: async () => {
        try {
          set({ isSaving: true })
          // Here you can add API call to save to backend
          // await api.saveCourse({ courseDetails: get().courseDetails, chapters: get().chapters })
          
          // For now, just simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          set({ isDraftSaved: true })
          console.log("Draft saved successfully")
        } catch (error) {
          console.error("Failed to save draft:", error)
        } finally {
          set({ isSaving: false })
        }
      },
     setChapters: (chapters:Chapter[]) => set({ chapters }),



      loadDraft: () => {
        // This method can be used to load from API if needed
        // The persist middleware will automatically load from localStorage
        console.log("Loading draft from storage")
      },

      reset: () => set({
        courseDetails: initialCourseDetails,
        chapters: [],
        openChapters: {},
        opensubChapters: {},
        isLoading: false,
        isSaving: false,
        isDraftSaved: false,
      })
    }),
    {
      name: 'course-storage', // unique name for localStorage key
      // Only persist the important data, not UI state
      partialize: (state) => ({
        courseDetails: state.courseDetails,
        chapters: state.chapters,
        isDraftSaved: state.isDraftSaved,
      }),
    }
  )
)