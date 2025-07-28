"use client"
import { useState, useEffect } from "react"
import type React from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { useTutorFilter } from "@/store/useTutorFilter" // Adjust path as needed

interface FilterItem {
  id: string
  label: string
  count?: number
  checked: boolean
}

interface FilterSectionProps {
  title: string
  data?: FilterItem[]
  showClearAll?: boolean
  onItemChange?: (id: string, checked: boolean) => void
  onClearAll?: () => void
  children?: React.ReactNode
}

function FilterSection({ title, data, showClearAll, onItemChange, onClearAll, children }: FilterSectionProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-teal-500 font-medium text-md">{title}</h3>
        {showClearAll && (
          <Button
            variant="link"
            size="sm"
            className="h-auto p-0 text-xs text-teal-500 hover:text-teal-600"
            onClick={onClearAll}
          >
            Clear All Filters
          </Button>
        )}
      </div>
      {children ? (
        children
      ) : (
        <div className="space-y-2">
          {data?.map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={item.id}
                  checked={item.checked}
                  onCheckedChange={(checked) => onItemChange?.(item.id, checked as boolean)}
                  className="data-[state=checked]:bg-black data-[state=checked]:border-black"
                />
                <Label htmlFor={item.id} className="text-sm font-normal cursor-pointer">
                  {item.label}
                </Label>
              </div>
              {item.count !== undefined && (
                <span className="text-xs text-gray-500">{item.count}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function TutorSidebar() {
  const {
    course,
    priceRange,
    language,
    rating,
    setCourse,
    setPriceRange,
    setLanguage,
    setRating,
    clearAllFilters,
    getAllFilters
  } = useTutorFilter();

  const [courseFilters, setCourseFilters] = useState<FilterItem[]>([
    { id: "business", label: "Business", checked: false },
    { id: "information-technology", label: "Information Technology", checked: false },
    { id: "computer-science", label: "Computer Science", checked: false },
    { id: "data-science", label: "Data Science", checked: false },
  ])

  const [languageFilters, setLanguageFilters] = useState<FilterItem[]>([
    { id: "english", label: "English", count: 387, checked: false },
    { id: "nepali", label: "Nepali", count: 906, checked: false },
    { id: "any", label: "Any", count: 906, checked: false },
  ])

  const [ratingFilters, setRatingFilters] = useState<FilterItem[]>([
    { id: "5-star", label: "5 Star", count: 387, checked: false },
    { id: "4-star", label: "4 Star", count: 906, checked: false },
    { id: "3-star", label: "3 Star", count: 906, checked: false },
    { id: "2-star", label: "2 Star", count: 906, checked: false },
    { id: "1-star", label: "1 Star", count: 906, checked: false },
    { id: "not-rated", label: "Not Rated", count: 906, checked: false },
  ])

  const [localPriceRange, setLocalPriceRange] = useState([priceRange.min, priceRange.max])

  // Sync local filter states with Zustand store
  useEffect(() => {
    setCourseFilters(prev => prev.map(item => ({
      ...item,
      checked: course.includes(item.label)
    })));
    
    setLanguageFilters(prev => prev.map(item => ({
      ...item,
      checked: language.includes(item.label)
    })));
    
    setRatingFilters(prev => prev.map(item => ({
      ...item,
      checked: rating.includes(item.id)
    })));

    setLocalPriceRange([priceRange.min, priceRange.max]);
  }, [course, language, rating, priceRange]);

  const handleCourseFilterChange = (id: string, checked: boolean) => {
    setCourseFilters(prev => prev.map(item => 
      item.id === id ? { ...item, checked } : item
    ));
    
    const updatedCourses = courseFilters
      .map(item => item.id === id ? { ...item, checked } : item)
      .filter(item => item.checked)
      .map(item => item.label);
    
    setCourse(updatedCourses);
  };

  const handleLanguageFilterChange = (id: string, checked: boolean) => {
    setLanguageFilters(prev => prev.map(item => 
      item.id === id ? { ...item, checked } : item
    ));
    
    const updatedLanguages = languageFilters
      .map(item => item.id === id ? { ...item, checked } : item)
      .filter(item => item.checked)
      .map(item => item.label);
    
    setLanguage(updatedLanguages);
  };

  const handleRatingFilterChange = (id: string, checked: boolean) => {
    setRatingFilters(prev => prev.map(item => 
      item.id === id ? { ...item, checked } : item
    ));
    
    const updatedRatings = ratingFilters
      .map(item => item.id === id ? { ...item, checked } : item)
      .filter(item => item.checked)
      .map(item => item.id);
    
    setRating(updatedRatings);
  };

  const handlePriceRangeChange = (values: number[]) => {
    setLocalPriceRange(values);
    setPriceRange({ min: values[0], max: values[1] });
  };

  const handleMinPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const min = parseInt(e.target.value) || 0;
    const newRange = [min, localPriceRange[1]];
    setLocalPriceRange(newRange);
    setPriceRange({ min, max: localPriceRange[1] });
  };

  const handleMaxPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const max = parseInt(e.target.value) || 3000;
    const newRange = [localPriceRange[0], max];
    setLocalPriceRange(newRange);
    setPriceRange({ min: localPriceRange[0], max });
  };

  const handleClearAllFilters = () => {
    clearAllFilters();
    setCourseFilters(prev => prev.map(item => ({ ...item, checked: false })));
    setLanguageFilters(prev => prev.map(item => ({ ...item, checked: false })));
    setRatingFilters(prev => prev.map(item => ({ ...item, checked: false })));
    setLocalPriceRange([0, 3000]);
  };

  const getActiveFilters = () => {
    const allFilters = getAllFilters();
    console.log("All tutor filters from Zustand:", allFilters);
    return allFilters;
  };

  const showMore = () => {
    console.log("Show more clicked");
  };

  return (
    <div className="w-64 p-4">
      {/* Course Filter */}
      <FilterSection
        title="Course"
        data={courseFilters}
        showClearAll
        onItemChange={handleCourseFilterChange}
        onClearAll={handleClearAllFilters}
      />

      {/* Show More Button */}
      <div className="mb-6">
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-sm text-teal-500 hover:text-teal-600"
          onClick={showMore}
        >
          Show More
        </Button>
      </div>

      {/* Price Range Filter */}
      <FilterSection title="Price">
        <div className="space-y-4">
          <Slider
            value={localPriceRange}
            onValueChange={handlePriceRangeChange}
            max={3000}
            min={0}
            step={50}
            className="w-full"
          />
          <div className="flex items-center gap-2">
            <Input
              type="number"
              value={localPriceRange[0]}
              onChange={handleMinPriceChange}
              className="w-20 h-8 text-sm"
              min={0}
              max={3000}
            />
            <span className="text-sm text-gray-500">-</span>
            <Input
              type="number"
              value={localPriceRange[1]}
              onChange={handleMaxPriceChange}
              className="w-20 h-8 text-sm"
              min={0}
              max={3000}
            />
          </div>
        </div>
      </FilterSection>

      {/* Language Filter */}
      <FilterSection
        title="Language"
        data={languageFilters}
        onItemChange={handleLanguageFilterChange}
      />

      {/* Rating Filter */}
      <FilterSection
        title="Rating"
        data={ratingFilters}
        onItemChange={handleRatingFilterChange}
      />

      {/* Debug Section */}
      <div className="border-t pt-4 mt-6">
        <details className="text-xs">
          <summary className="cursor-pointer text-gray-600">Debug: Current Filter State</summary>
          <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(getAllFilters(), null, 2)}
          </pre>
        </details>
      </div>
    </div>
  )
}