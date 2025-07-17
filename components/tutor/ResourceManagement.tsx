'use client'
import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Plus } from 'lucide-react';
import { SimpleEditor } from '../tiptap-templates/simple/simple-editor';

type Resource = {
  id: string;
  title: string;
  description: string;
};
const ResourceManagement = () => {
    
    
      // Resource
      const [expandedResources, setExpandedResources] = useState<Record<string, boolean>>({
        'resource-1': true,
      });
    
      const [resources, setResources] = useState<Resource[]>([
        { id: 'resource-1', title: 'Resource 1', description: '' },
      
      ]);
    
      const toggleResource = (id: string) => {
        setExpandedResources((prev) => ({
          ...prev,
          [id]: !prev[id],
        }));
      };
    
      const addResource = () => {
        const newId = `resource-${resources.length + 1}`;
        setResources((prev) => [
          ...prev,
          { id: newId, title: `Resource ${resources.length + 1}`, description: '' },
        ]);
        setExpandedResources((prev) => ({
          ...prev,
          [newId]: true,
        }));
      };
    
      const updateResource = (
        id: string,
        field: keyof Resource,
        value: string
      ) => {
        setResources((prev) =>
          prev.map((resource) =>
            resource.id === id ? { ...resource, [field]: value } : resource
          )
        );
      };
    
   return (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">resources</h1>

            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-xl border-2 border-teal-200 p-6 shadow-sm mb-4"
              >
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => toggleResource(resource.id)}
                >
                  <h3 className="text-lg font-medium text-gray-900">
                    {resource.title}
                  </h3>
                  {expandedResources[resource.id] ? (
                    <ChevronUp className="h-5 w-5 text-teal-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-teal-500" />
                  )}
                </div>

                {expandedResources[resource.id] && (
                  <div className="mt-6 py-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resource Title
                      </label>
                      <input
                        type="text"
                        value={resource.title}
                        onChange={(e) =>
                          updateResource(resource.id, 'title', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resource Description
                      </label>
                      {/* <textarea
                        value={resource.description}
                        onChange={(e) =>
                          updateResource(resource.id, 'description', e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none min-h-32"
                      /> */}
                      <div className='shadow-md'>
                      <SimpleEditor/>

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
          </>
        );
}

export default ResourceManagement