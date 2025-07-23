import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Education {
  id: number;
  tutorProfileId: number;
  qualification: string;
  institutionName: string;
  timePeriod: string;
  certificationUrl: string;
  type: string;
}

interface EducationStore {
  education: Education[];
  setEducation: (education: Education) => void;
}

const useEducationStore = create<EducationStore>()(
  persist(
    (set, get) => ({
      education: [],
      setEducation: (education) => {
        const existing = get().education;
        const updated = [...existing.filter(e => e.id !== education.id), education];
        set({ education: updated });
      },
    }),
    {
      name: "education-storage", // localStorage key
    }
  )
);

export default useEducationStore;
