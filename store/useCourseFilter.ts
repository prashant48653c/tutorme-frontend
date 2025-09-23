import { create } from 'zustand'

interface FilterState {
  // Filter values
  categories: string[]
  targetSem: string[]
  language: string[]
  courseDepth: string[]
  duration: string[]
  searchQuery: string
  
  // Actions
  setCategories: (categories: string[]) => void
  setTargetSem: (targetSem: string[]) => void
  setLanguage: (language: string[]) => void
  setCourseDepth: (courseDepth: string[]) => void
  setDuration: (duration: string[]) => void
  setSearchQuery: (searchQuery: string) => void
  clearAllFilters: () => void
  
  // Computed getter for all filters
  getAllFilters: () => {
    categories: string[]
    targetSem: string[]
    language: string[]
    courseDepth: string[]
    duration: string[]
    searchQuery: string
  }
}

export const useFilterStore = create<FilterState>((set, get) => ({
  // Initial state
  categories: [],
  targetSem: [],
  language: [],
  courseDepth: [],
  duration: [],
  searchQuery: '',
  
  // Actions
  setCategories: (categories) => set({ categories }),
  setTargetSem: (targetSem) => set({ targetSem }),
  setLanguage: (language) => set({ language }),
  setCourseDepth: (courseDepth) => set({ courseDepth }),
  setDuration: (duration) => set({ duration }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  
  clearAllFilters: () => set({
    categories: [],
    targetSem: [],
    language: [],
    courseDepth: [],
    duration: [],
    searchQuery: ''
  }),
  
  // Computed getter
  getAllFilters: () => {
    const state = get()
    return {
      categories: state.categories,
      targetSem: state.targetSem,
      language: state.language,
      courseDepth: state.courseDepth,
      duration: state.duration,
      searchQuery: state.searchQuery
    }
  }
}))