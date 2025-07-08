'use client'
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Plus } from 'lucide-react';

type Assignment = {
  id: string;
  title: string;
  description: string;
};

const AssignmentsUI: React.FC = () => {
  const tabs: string[] = [
    'Course Content',
    'Resources',
    'Practice Questions',
    'Assignments',
    'Class Schedule',
  ];

  const [activeTab, setActiveTab] = useState<string>('Assignments');

  const [expandedAssignments, setExpandedAssignments] = useState<Record<string, boolean>>({
    'assignment-1': true,
  });

  const [assignments, setAssignments] = useState<Assignment[]>([
    { id: 'assignment-1', title: 'Assignment 1', description: '' },
    { id: 'assignment-2', title: 'Assignment 2', description: '' },
  ]);

  const toggleAssignment = (id: string) => {
    setExpandedAssignments((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const addAssignment = () => {
    const newId = `assignment-${assignments.length + 1}`;
    setAssignments((prev) => [
      ...prev,
      { id: newId, title: `Assignment ${assignments.length + 1}`, description: '' },
    ]);
    setExpandedAssignments((prev) => ({
      ...prev,
      [newId]: true,
    }));
  };

  const updateAssignment = (
    id: string,
    field: keyof Assignment,
    value: string
  ) => {
    setAssignments((prev) =>
      prev.map((assignment) =>
        assignment.id === id ? { ...assignment, [field]: value } : assignment
      )
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Assignments':
        return (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Assignments</h1>

            {assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="bg-white rounded-xl border-2 border-teal-200 p-6 shadow-sm mb-4"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleAssignment(assignment.id)}
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    {assignment.title}
                  </h3>
                  {expandedAssignments[assignment.id] ? (
                    <ChevronUp className="h-5 w-5 text-teal-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-teal-500" />
                  )}
                </div>

                {expandedAssignments[assignment.id] && (
                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assignment Title
                      </label>
                      <input
                        type="text"
                        value={assignment.title}
                        onChange={(e) =>
                          updateAssignment(assignment.id, 'title', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assignment Description
                      </label>
                      <textarea
                        value={assignment.description}
                        onChange={(e) =>
                          updateAssignment(assignment.id, 'description', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none min-h-32"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            <button
              onClick={addAssignment}
              className="w-full bg-white border-2 border-dashed border-teal-300 rounded-xl p-6 text-center hover:border-teal-400 hover:bg-teal-50 transition-colors group"
            >
              <div className="flex items-center justify-center gap-2 text-teal-500 group-hover:text-teal-600">
                <Plus className="h-5 w-5" />
                <span className="font-medium">Add Assignment</span>
              </div>
            </button>
          </>
        );

      case 'Course Content':
        return (
          <div>
            <h1 className="text-xl font-semibold mb-4">Course Content</h1>
            <input
              type="text"
              placeholder="Enter topic title"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
        );

      case 'Resources':
        return (
          <div>
            <h1 className="text-xl font-semibold mb-4">Resources</h1>
            <input
              type="text"
              placeholder="Enter resource name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
        );

      case 'Practice Questions':
        return (
          <div>
            <h1 className="text-xl font-semibold mb-4">Practice Questions</h1>
            <textarea
              placeholder="Enter question..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg min-h-32"
            />
          </div>
        );

      case 'Class Schedule':
        return (
          <div>
            <h1 className="text-xl font-semibold mb-4">Class Schedule</h1>
            <input
              type="date"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
              activeTab === tab
                ? 'bg-teal-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {renderTabContent()}

        {/* Action Buttons */}
        <div className="flex gap-4 pt-6">
          <button className="flex-1 bg-teal-500 text-white py-4 px-8 rounded-lg font-medium hover:bg-teal-600 transition-colors">
            Save Draft
          </button>
          <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-4 px-8 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            Send for Approval
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentsUI;
