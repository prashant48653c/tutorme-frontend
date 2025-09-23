"use client";
import { useState, useEffect } from "react";
import type React from "react";

import { Filter, SlidersHorizontal, X } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useFilterStore } from "@/store/useCourseFilter"; // Adjust path as needed

interface FilterItem {
  id: string;
  label: string;
  count?: number;
  checked: boolean;
}

interface FilterSectionProps {
  title: string;
  data: FilterItem[];
  showClearAll?: boolean;
  onItemChange: (id: string, checked: boolean) => void;
  onClearAll?: () => void;
}

function FilterSection({
  title,
  data,
  showClearAll,
  onItemChange,
  onClearAll,
}: FilterSectionProps) {
  return (
    <SidebarGroup>
      <div className="flex items-center justify-between">
        <SidebarGroupLabel className="text-teal-600  font-medium text-md mb-1">
          {title}
        </SidebarGroupLabel>
        {showClearAll && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-teal-600 hover:text-teal-700"
            onClick={onClearAll}
          >
            Clear All Filters
          </Button>
        )}
      </div>
      <SidebarGroupContent className="space-y-2">
        {data.map((item) => (
          <div key={item.id} className="flex items-center space-x-2">
            <Checkbox
              id={item.id}
              checked={item.checked}
              onCheckedChange={(checked) =>
                onItemChange(item.id, checked as boolean)
              }
              className="data-[state=checked]:bg-black data-[state=checked]:border-black"
            />
            <Label
              htmlFor={item.id}
              className="flex-1 text-sm font-normal cursor-pointer"
            >
              {item.label}
            </Label>
            {item.count !== undefined && (
              <span className="text-xs text-gray-500 ml-auto">
                {item.count}
              </span>
            )}
          </div>
        ))}
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function CourseFilterSidebar() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(true);
  
  const {
    categories,
    targetSem,
    language,
    courseDepth,
    duration,
    setCategories,
    setTargetSem,
    setLanguage,
    setCourseDepth,
    setDuration,
    clearAllFilters,
    getAllFilters,
  } = useFilterStore();

  const [courseFilters, setCourseFilters] = useState<FilterItem[]>([
    { id: "General", label: "General", checked: false },
    { id: "BSC.CSIT", label: "Information Technology", checked: false },
    { id: "BICTE", label: "Computer Science", checked: false },
    { id: "BBA", label: "Data Science", checked: false },
  ]);

  const [semesterFilters, setSemesterFilters] = useState<FilterItem[]>([
    { id: "first", label: "First", count: 387, checked: false },
    { id: "second", label: "Second", count: 0, checked: false },
    { id: "third", label: "Third", count: 906, checked: false },
    { id: "fourth", label: "Fourth", count: 0, checked: false },
    { id: "fifth", label: "Fifth", count: 906, checked: false },
    { id: "sixth", label: "Sixth", count: 0, checked: false },
    { id: "seventh", label: "Seventh", count: 906, checked: false },
    { id: "eighth", label: "Eighth", count: 906, checked: false },
  ]);

  const [languageFilters, setLanguageFilters] = useState<FilterItem[]>([
    { id: "english", label: "English", count: 387, checked: false },
    { id: "nepali", label: "Nepali", count: 906, checked: false },
  ]);

  const [levelFilters, setLevelFilters] = useState<FilterItem[]>([
    { id: "beginner", label: "Beginner", count: 387, checked: false },
    { id: "intermediate", label: "Intermediate", count: 129, checked: false },
    { id: "advanced", label: "Advanced", count: 906, checked: false },
  ]);

  const [durationFilters, setDurationFilters] = useState<FilterItem[]>([
    {
      id: "less-than-2hrs",
      label: "Less than 2 hrs",
      count: 387,
      checked: false,
    },
    { id: "2-3hrs", label: "2-3 hrs", count: 129, checked: false },
    { id: "1-3months", label: "1-3 Months", count: 906, checked: false },
    { id: "3-6months", label: "3-6 Months", count: 906, checked: false },
    { id: "4-6months", label: "4-6 Months", count: 906, checked: false },
  ]);

  // Sync local filter states with Zustand store on mount
  useEffect(() => {
    // Update local states based on Zustand store
    setCourseFilters((prev) =>
      prev.map((item) => ({
        ...item,
        checked: categories.includes(item.label),
      }))
    );

    setSemesterFilters((prev) =>
      prev.map((item) => {
        const semesterMap: any = {
          First: "ONE",
          Second: "TWO",
          Third: "THREE",
          Fourth: "FOUR",
          Fifth: "FIVE",
          Sixth: "SIX",
          Seventh: "SEVEN",
          Eighth: "EIGHT",
        };

        return {
          ...item,
          checked: targetSem.includes(semesterMap[item.label]),
        };
      })
    );

    setLanguageFilters((prev) =>
      prev.map((item) => ({
        ...item,
        checked: language.includes(item.label),
      }))
    );

    setLevelFilters((prev) =>
      prev.map((item) => ({
        ...item,
        checked: courseDepth.includes(item.label.toLowerCase()),
      }))
    );

    setDurationFilters((prev) =>
      prev.map((item) => {
        const durationMap: any = {
          "Less than 2 hrs": "less than 2 hour",
          "2-3 hrs": "2-3 hour",
          "1-3 Months": "1-3 months",
          "3-6 Months": "3-6 months",
          "4-6 Months": "4-6 months",
        };
        return {
          ...item,
          checked: duration.includes(durationMap[item.label] || item.label),
        };
      })
    );
  }, [categories, targetSem, language, courseDepth, duration]);

  const handleCourseFilterChange = (id: string, checked: boolean) => {
    setCourseFilters((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked } : item))
    );

    const updatedCategories = courseFilters
      .map((item) => (item.id === id ? { ...item, checked } : item))
      .filter((item) => item.checked)
      .map((item) => item.label);

    setCategories(updatedCategories);
  };

  const handleSemesterFilterChange = (id: string, checked: boolean) => {
    setSemesterFilters((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked } : item))
    );

    const updatedSemesters = semesterFilters
      .map((item) => (item.id === id ? { ...item, checked } : item))
      .filter((item) => item.checked)
      .map((item) => {
        const semesterMap: any = {
          First: 1,
          Second: 2,
          Third: 3,
          Fourth: 4,
          Fifth: 5,
          Sixth: 6,
          Seventh: 7,
          Eighth: 8,
        };
        return semesterMap[item.label];
      });

    setTargetSem(updatedSemesters);
  };

  const handleLanguageFilterChange = (id: string, checked: boolean) => {
    setLanguageFilters((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked } : item))
    );

    const updatedLanguages = languageFilters
      .map((item) => (item.id === id ? { ...item, checked } : item))
      .filter((item) => item.checked)
      .map((item) => item.label);

    setLanguage(updatedLanguages);
  };

  const handleLevelFilterChange = (id: string, checked: boolean) => {
    setLevelFilters((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked } : item))
    );

    const updatedLevels = levelFilters
      .map((item) => (item.id === id ? { ...item, checked } : item))
      .filter((item) => item.checked)
      .map((item) => item.label.toLowerCase());

    setCourseDepth(updatedLevels);
  };

  const handleDurationFilterChange = (id: string, checked: boolean) => {
    setDurationFilters((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked } : item))
    );

    const updatedDurations = durationFilters
      .map((item) => (item.id === id ? { ...item, checked } : item))
      .filter((item) => item.checked)
      .map((item) => {
        const durationMap: any = {
          "Less than 2 hrs": "less than 2 hour",
          "2-3 hrs": "2-3 hour",
          "1-3 Months": "1-3 months",
          "3-6 Months": "3-6 months",
          "4-6 Months": "4-6 months",
        };
        return durationMap[item.label] || item.label;
      });

    setDuration(updatedDurations);
  };

  const handleClearAllFilters = () => {
    clearAllFilters();
    setCourseFilters((prev) =>
      prev.map((item) => ({ ...item, checked: false }))
    );
    setSemesterFilters((prev) =>
      prev.map((item) => ({ ...item, checked: false }))
    );
    setLanguageFilters((prev) =>
      prev.map((item) => ({ ...item, checked: false }))
    );
    setLevelFilters((prev) =>
      prev.map((item) => ({ ...item, checked: false }))
    );
    setDurationFilters((prev) =>
      prev.map((item) => ({ ...item, checked: false }))
    );
  };

  const getActiveFilters = () => {
    const allFilters = getAllFilters();
    console.log("All filters from Zustand:", allFilters);
    return allFilters;
  };

  const SidebarContent = () => (
    <div className="w-full pr-3">
      <div className="">
        <Button
          variant="outline"
          size="sm"
          className="justify-start border border-green-400 px-5 gap-2 bg-transparent w-full"
          onClick={getActiveFilters}
        >
          Filter
          <SlidersHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-4 space-y-6">
        <FilterSection
          title="Course"
          data={courseFilters}
          showClearAll
          onItemChange={handleCourseFilterChange}
          onClearAll={handleClearAllFilters}
        />

        <FilterSection
          title="Semester"
          data={semesterFilters}
          onItemChange={handleSemesterFilterChange}
        />

        <FilterSection
          title="Language"
          data={languageFilters}
          onItemChange={handleLanguageFilterChange}
        />

        <FilterSection
          title="Level"
          data={levelFilters}
          onItemChange={handleLevelFilterChange}
        />

        <FilterSection
          title="Duration"
          data={durationFilters}
          onItemChange={handleDurationFilterChange}
        />
      </div>

      {/* Optional: Display current filter state for debugging */}
      <div className="p-4 border-t">
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-600">
            Debug: Current Filter State
          </summary>
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(getAllFilters(), null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64">
        <SidebarContent />
      </div>

      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsMobileFilterOpen(true)}
        className="md:hidden fixed bottom-6 left-6 z-40 bg-teal-500 hover:bg-teal-600 text-white p-3 rounded-full shadow-lg"
      >
        <SlidersHorizontal className="h-5 w-5" />
      </button>

      {/* Mobile Overlay */}
      {isMobileFilterOpen && (
        <div 
          className="md:hidden fixed inset-0 z-50 bg-black bg-opacity-50" 
          onClick={() => setIsMobileFilterOpen(false)} 
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`md:hidden fixed left-0 top-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ${
        isMobileFilterOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-semibold">Filters</h2>
          <button
            onClick={() => setIsMobileFilterOpen(false)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="overflow-y-auto h-full pb-20">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}