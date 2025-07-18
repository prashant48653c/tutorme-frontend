'use client'
import React, { useEffect, useState } from 'react';
import { ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { SimpleEditor } from '../tiptap-templates/simple/simple-editor';
import { useGlobalCourseStore } from '@/store/useGlobalCourseStore';
import api from '@/hooks/axios';
import toast from 'react-hot-toast';
import { Assignment, Resource } from '@/types/course';

const AssignmentManagement = () => {
  const course = useGlobalCourseStore(state => state.course);
 
  const [expandedResources, setExpandedResources] = useState<Record<number, boolean>>({});
  const [resources, setResources] = useState<Assignment[]>([]);

  // Setup initial resources based on course
  useEffect(() => {
    if (course?.assignment && course.assignment.length > 0) {
      setResources(course.assignment);
      const expansionState: Record<number, boolean> = {};
      course.assignment.forEach((res) => {
        if (res.id !== undefined) {
          expansionState[res.id] = true;
        }
      });
      setExpandedResources(expansionState);
    } else {
      // Initialize with one blank resource if none exist
      setResources([{ title: 'Assignment 1', description: '', courseId: course?.id || 0 }]);
      setExpandedResources({ 0: true });
    }
  }, [course]);

  const toggleResource = (id: number) => {
    setExpandedResources(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const addResource = () => {
    const newId = Date.now(); // temp unique id
    const newResource: Assignment = {
      title: `Assignment ${resources.length + 1}`,
      description: '',
      courseId: course?.id || 0,
      
    };
    setResources(prev => [...prev, newResource]);
    setExpandedResources(prev => ({ ...prev, [newId]: true }));
  };

  const updateResource = (id: number, field: keyof Assignment, value: string) => {
    setResources(prev =>
      prev.map(resource =>
        resource.id === id ? { ...resource, [field]: value } : resource
      )
    );
  };
console.log(resources)
const handleResourceUpload = async () => {
   const payload = resources.map(({ id, title, description, courseId }) => {
    return id
      ? { id, title, description, courseId } // existing resource
      : { title, description, courseId };   // new resource (no id)
  });
console.log(payload,"Pay")
  try {    
      const res = await api.post(`/course/assignment/${course?.id}`, payload);

    console.log("Created assignment:", res.data);
  } catch (err) {
    console.error("Error creating assignment:", err);
  }
};

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Resources</h1>

      {resources.map(resource => (
        <div
          key={resource.id}
          className="bg-white rounded-xl border-2 border-teal-200 p-6 shadow-sm mb-4"
        >
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleResource(resource.id!)}
          >
            <h3 className="text-lg font-medium text-gray-900">{resource.title}</h3>
            {expandedResources[resource.id!] ? (
              <ChevronUp className="h-5 w-5 text-teal-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-teal-500" />
            )}
          </div>

          {expandedResources[resource.id!] && (
            <div className="mt-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Title
                </label>
                <input
                  type="text"
                  value={resource.title || ''}
                  onChange={e =>
                    updateResource(resource.id!, 'title', e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Description
                </label>
                <div className="shadow-md">
                  <SimpleEditor />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={addResource}
        className="w-full bg-white border-2 border-dashed border-teal-300 rounded-xl p-6 text-center hover:border-teal-400 hover:bg-teal-50 transition-colors group"
      >
        <div className="flex items-center justify-center gap-2 text-teal-500 group-hover:text-teal-600">
          <Plus className="h-5 w-5" />
          <span className="font-medium">Add Resource</span>
        </div>
      </button>

      <div className="flex gap-4 pt-6">
        <button
          onClick={handleResourceUpload}
          className="flex-1 bg-teal-500 text-white py-4 px-8 rounded-lg font-medium hover:bg-teal-600 transition-colors"
        >
          Save Draft
        </button>
        <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-4 px-8 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Send for Approval
        </button>
      </div>
    </>
  );
};

export default AssignmentManagement;
