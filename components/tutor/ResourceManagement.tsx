"use client";

import React, { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, Plus, Upload, FileText, X, Edit, Save } from "lucide-react";
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";
import { useGlobalCourseStore } from "@/store/useGlobalCourseStore";
import api from "@/hooks/axios";
import toast from "react-hot-toast";
import { Resource } from "@/types/course";
import { useCourseStore } from "@/store/useCourseStore";

// FRONTEND-ONLY TYPE 👇
type LocalResource = Resource & {
  localId: number;
  pdfFile?: File | null;
  existingPdfUrl?: string;
};

// Modal Component for Editing Single Resource
const EditResourceModal = ({
  resource,
  isOpen,
  onClose,
  onSave,
}: {
  resource: LocalResource;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedResource: LocalResource) => void;
}) => {
  const [editedResource, setEditedResource] = useState<LocalResource>(resource);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setEditedResource(resource);
  }, [resource]);

  const handlePdfChange = (file: File | null) => {
    if (file && file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error("PDF file size should be less than 10MB");
      return;
    }
    setEditedResource((prev) => ({ ...prev, pdfFile: file }));
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onSave(editedResource);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Edit Resource</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resource Title
            </label>
            <input
              type="text"
              value={editedResource.title || ""}
              onChange={(e) =>
                setEditedResource((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resource Description
            </label>
            <div className="shadow-md">
              <SimpleEditor
                value={editedResource.description || ""}
                onChange={(value) =>
                  setEditedResource((prev) => ({
                    ...prev,
                    description: value,
                  }))
                }
              />
            </div>
          </div>

          {/* PDF Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload PDF Resource
            </label>
            {editedResource.pdfFile || editedResource.existingPdfUrl ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-300 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-gray-700">
                    {editedResource.pdfFile
                      ? editedResource.pdfFile.name
                      : editedResource.existingPdfUrl?.split("/").pop() ||
                        "Uploaded PDF"}
                  </span>
                </div>
                <button
                  onClick={() =>
                    setEditedResource((prev) => ({
                      ...prev,
                      pdfFile: null,
                      existingPdfUrl: undefined,
                    }))
                  }
                  className="p-1 hover:bg-gray-200 rounded-full"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) =>
                    handlePdfChange(e.target.files?.[0] || null)
                  }
                  className="hidden"
                  id="modal-pdf-upload"
                />
                <label
                  htmlFor="modal-pdf-upload"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors"
                >
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Click to upload PDF (Max 10MB)
                  </span>
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="flex-1 px-4 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:opacity-50"
          >
            {isUpdating ? "Updating..." : "Update Resource"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ResourceManagement = () => {
  const course = useGlobalCourseStore((state) => state.course);
  const exclusiveCourse = useCourseStore((state) => state.courseDetails);



  const setCourse = useGlobalCourseStore((state) => state.setCourse);
console.log(course)
  const [resources, setResources] = useState<LocalResource[]>([]);
  const [expandedResources, setExpandedResources] = useState<
    Record<number, boolean>
  >({});
  const [localCounter, setLocalCounter] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [editingResource, setEditingResource] = useState<LocalResource | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (course?.resource?.length) {
      const prepared = course.resource.map((res) => ({
        ...res,
        localId: res.id!,
        existingPdfUrl: res.pdf,
      }));

      setResources(prepared);

      const exp: Record<number, boolean> = {};
      prepared.forEach((r) => (exp[r.localId] = true));
      setExpandedResources(exp);

      const maxId = Math.max(...prepared.map((r) => r.localId), 0);
      setLocalCounter(maxId);
    } else {
      const localId = 1;
      setLocalCounter(1);

      setResources([
        {
          localId,
          title: "Resource 1",
          description: "",
          courseId: exclusiveCourse?.id || 0,
        },
      ]);
      setExpandedResources({ [localId]: true });
    }
  }, [course]);

  const toggleResource = (localId: number) => {
    setExpandedResources((prev) => ({
      ...prev,
      [localId]: !prev[localId],
    }));
  };

  const addResource = () => {
    const newLocalId = localCounter + 1;
    setLocalCounter(newLocalId);

    const newResource: LocalResource = {
      localId: newLocalId,
      title: `Resource ${resources.length + 1}`,
      description: "",
      courseId: exclusiveCourse?.id || 0,
    };

    setResources((prev) => [...prev, newResource]);
    setExpandedResources((prev) => ({ ...prev, [newLocalId]: true }));
  };

  const updateResource = (
    localId: number,
    field: keyof Resource,
    value: string
  ) => {
    setResources((prev) =>
      prev.map((res) =>
        res.localId === localId ? { ...res, [field]: value } : res
      )
    );
  };

  const handlePdfUpload = (localId: number, file: File | null) => {
    if (file && file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    if (file && file.size > 10 * 1024 * 1024) {
      toast.error("PDF file size should be less than 10MB");
      return;
    }

    setResources((prev) =>
      prev.map((res) =>
        res.localId === localId ? { ...res, pdfFile: file } : res
      )
    );
  };

  const removePdf = (localId: number) => {
    setResources((prev) =>
      prev.map((res) =>
        res.localId === localId
          ? { ...res, pdfFile: null, existingPdfUrl: undefined }
          : res
      )
    );
  };
const courseId = exclusiveCourse?.id ;
  // Save all resources (for initial creation)
  const handleResourceUpload = async () => {
    setIsUploading(true);

    try {
      const formData = new FormData();

      // Add all PDF files with indexed names
      resources.forEach((resource, index) => {
        if (resource.pdfFile) {
          formData.append(`pdf_${index}`, resource.pdfFile);
        }
      });

      // Prepare resources data
      const resourcesData = resources.map((r, index) => ({
        ...(r.id ? { id: r.id } : {}),
        title: r.title,
        description: r.description,
        courseId: exclusiveCourse?.id,
        pdfIndex: r.pdfFile ? index : undefined,
        ...(r.existingPdfUrl && !r.pdfFile ? { pdf: r.existingPdfUrl } : {}),
      }));

      formData.append("resources", JSON.stringify(resourcesData));
console.log(course?.id)

      const res = await api.post(`/course/resource/${courseId}`, formData);

      setCourse(res.data.data);
      toast.success("Resources saved!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save resources");
    } finally {
      setIsUploading(false);
    }
  };

  // Update single resource
  const handleSingleResourceUpdate = async (
    updatedResource: LocalResource
  ) => {
    try {
      const formData = new FormData();

      // Add PDF if there's a new file
      if (updatedResource.pdfFile) {
        formData.append("pdf", updatedResource.pdfFile);
      }

      // Prepare resource data
      const resourceData = {
        id: updatedResource.id,
        title: updatedResource.title,
        description: updatedResource.description,
        courseId: exclusiveCourse?.id,
        ...(updatedResource.existingPdfUrl && !updatedResource.pdfFile
          ? { pdf: updatedResource.existingPdfUrl }
          : {}),
      };

      formData.append("resource", JSON.stringify(resourceData));
console.log(course?.id)
      const res = await api.put(
        `/course/resource/${courseId}/${updatedResource.id}`,
        formData,
         
      );

      setCourse(res.data.data);
      
      // Update local state
      setResources((prev) =>
        prev.map((r) =>
          r.localId === updatedResource.localId
            ? { ...updatedResource, existingPdfUrl: res.data.data.resource?.pdf }
            : r
        )
      );
      
      toast.success("Resource updated!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update resource");
      throw err;
    }
  };

  const openEditModal = (resource: LocalResource) => {
    setEditingResource(resource);
    setIsModalOpen(true);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Resources</h1>

      {resources.map((resource) => (
        <div
          key={resource.localId}
          className="bg-white rounded-xl border-2 border-teal-200 p-6 shadow-sm mb-4"
        >
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 flex-1 cursor-pointer"
              onClick={() => toggleResource(resource.localId)}
            >
              <h3 className="text-lg font-medium text-gray-900">
                {resource.title}
              </h3>
              {expandedResources[resource.localId] ? (
                <ChevronUp className="h-5 w-5 text-teal-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-teal-500" />
              )}
            </div>

            {/* Edit Icon - only show if resource has an ID (already saved) */}
            {resource.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(resource);
                }}
                className="p-2 hover:bg-teal-50 rounded-lg transition-colors"
                title="Edit Resource"
              >
                <Edit className="h-5 w-5 text-teal-600" />
              </button>
            )}
          </div>

          {expandedResources[resource.localId] && (
            <div className="mt-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Title
                </label>
                <input
                  type="text"
                  value={resource.title || ""}
                  onChange={(e) =>
                    updateResource(resource.localId, "title", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Resource Description
                </label>
                <div className="shadow-md">
                  <SimpleEditor
                    value={resource.description || ""}
                    onChange={(value) =>
                      updateResource(resource.localId, "description", value)
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload PDF Resource
                </label>

                {resource.pdfFile || resource.existingPdfUrl ? (
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-300 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-red-500" />
                      <span className="text-sm text-gray-700">
                        {resource.pdfFile
                          ? resource.pdfFile.name
                          : resource.existingPdfUrl?.split("/").pop() ||
                            "Uploaded PDF"}
                      </span>
                      {resource.pdfFile && (
                        <span className="text-xs text-gray-500">
                          ({(resource.pdfFile.size / 1024).toFixed(2)} KB)
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removePdf(resource.localId)}
                      className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={(e) =>
                        handlePdfUpload(
                          resource.localId,
                          e.target.files?.[0] || null
                        )
                      }
                      className="hidden"
                      id={`pdf-upload-${resource.localId}`}
                    />
                    <label
                      htmlFor={`pdf-upload-${resource.localId}`}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors"
                    >
                      <Upload className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Click to upload PDF (Max 10MB)
                      </span>
                    </label>
                  </div>
                )}
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
          disabled={isUploading}
          className="flex-1 bg-teal-500 text-white py-4 px-8 rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? "Saving..." : "Save All Resources"}
        </button>
        <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-4 px-8 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Send for Approval
        </button>
      </div>

      {/* Edit Modal */}
      {editingResource && (
        <EditResourceModal
          resource={editingResource}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingResource(null);
          }}
          onSave={handleSingleResourceUpdate}
        />
      )}
    </>
  );
};

export default ResourceManagement;