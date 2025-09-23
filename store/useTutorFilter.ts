import { create } from 'zustand'

interface TutorFilterState {
  // Filter values
  course: string[]
  priceRange: {
    min: number
    max: number
  }
  language: string[]
  rating: string[]
  searchQuery: string
  
  // Actions
  setCourse: (course: string[]) => void
  setPriceRange: (priceRange: { min: number; max: number }) => void
  setLanguage: (language: string[]) => void
  setRating: (rating: string[]) => void
  setSearchQuery: (searchQuery: string) => void
  clearAllFilters: () => void
  
  // Computed getter for all filters
  getAllFilters: () => {
    course: string[]
    priceRange: { min: number; max: number }
    language: string[]
    rating: string[]
    searchQuery: string
  }
}

export const useTutorFilter = create<TutorFilterState>((set, get) => ({
  // Initial state
  course: [],
  priceRange: {
    min: 0,
    max: 3000
  },
  language: [],
  rating: [],
  searchQuery: '',
  
  // Actions
  setCourse: (course) => set({ course }),
  setPriceRange: (priceRange) => set({ priceRange }),
  setLanguage: (language) => set({ language }),
  setRating: (rating) => set({ rating }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  
  clearAllFilters: () => set({
    course: [],
    priceRange: { min: 0, max: 3000 },
    language: [],
    rating: [],
    searchQuery: ''
  }),
  
  // Computed getter
  getAllFilters: () => {
    const state = get()
    return {
      course: state.course,
      priceRange: state.priceRange,
      language: state.language,
      rating: state.rating,
      searchQuery: state.searchQuery
    }
  }
}))