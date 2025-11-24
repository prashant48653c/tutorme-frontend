"use client";

import React, { useEffect, useState } from "react";
import { ChevronUp, ChevronDown, Plus, Upload, FileText, X, Edit } from "lucide-react";
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";
import { useGlobalCourseStore } from "@/store/useGlobalCourseStore";
import api from "@/hooks/axios";
import toast from "react-hot-toast";
import { Assignment } from "@/types/course";
import { useCourseStore } from "@/store/useCourseStore";

// FRONTEND-ONLY TYPE 👇
type LocalAssignment = Assignment & {
  localId: number;
  pdfFile?: File | null;
  existingPdfUrl?: string;
};

// Modal Component for Editing Single Assignment
const EditAssignmentModal = ({
  assignment,
  isOpen,
  onClose,
  onSave,
}: {
  assignment: LocalAssignment;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedAssignment: LocalAssignment) => void;
}) => {
  const [editedAssignment, setEditedAssignment] = useState<LocalAssignment>(assignment);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setEditedAssignment(assignment);
  }, [assignment]);

  const handlePdfChange = (file: File | null) => {
    if (file && file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }
    if (file && file.size > 10 * 1024 * 1024) {
      toast.error("PDF file size should be less than 10MB");
      return;
    }
    setEditedAssignment((prev) => ({ ...prev, pdfFile: file }));
  };

  const handleUpdate = async () => {
    setIsUpdating(true);
    try {
      await onSave(editedAssignment);
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
          <h2 className="text-xl font-bold text-gray-900">Edit Assignment</h2>
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
              Assignment Title
            </label>
            <input
              type="text"
              value={editedAssignment.title || ""}
              onChange={(e) =>
                setEditedAssignment((prev) => ({
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
              Assignment Description
            </label>
            <div className="shadow-md">
              <SimpleEditor
                value={editedAssignment.description || ""}
                onChange={(value) =>
                  setEditedAssignment((prev) => ({
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
              Upload PDF Assignment
            </label>
            {editedAssignment.pdfFile || editedAssignment.existingPdfUrl ? (
              <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-300 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-red-500" />
                  <span className="text-sm text-gray-700">
                    {editedAssignment.pdfFile
                      ? editedAssignment.pdfFile.name
                      : editedAssignment.existingPdfUrl?.split("/").pop() ||
                        "Uploaded PDF"}
                  </span>
                </div>
                <button
                  onClick={() =>
                    setEditedAssignment((prev) => ({
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
            {isUpdating ? "Updating..." : "Update Assignment"}
          </button>
        </div>
      </div>
    </div>
  );
};

const AssignmentManagement = () => {
  const course = useGlobalCourseStore((state) => state.course);
  const exclusiveCourse = useCourseStore((state) => state.courseDetails);
  const setCourse = useGlobalCourseStore((state) => state.setCourse);

  const [assignments, setAssignments] = useState<LocalAssignment[]>([]);
  const [expandedAssignments, setExpandedAssignments] = useState<
    Record<number, boolean>
  >({});
  const [localCounter, setLocalCounter] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<LocalAssignment | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (course?.assignment?.length) {
      const prepared = course.assignment.map((assign) => ({
        ...assign,
        localId: assign.id!,
        existingPdfUrl: assign.pdf,
      }));

      setAssignments(prepared);

      const exp: Record<number, boolean> = {};
      prepared.forEach((a) => (exp[a.localId] = true));
      setExpandedAssignments(exp);

      const maxId = Math.max(...prepared.map((a) => a.localId), 0);
      setLocalCounter(maxId);
    } else {
      const localId = 1;
      setLocalCounter(1);

      setAssignments([
        {
          localId,
          title: "Assignment 1",
          description: "",
          courseId: exclusiveCourse?.id || 0,
        },
      ]);
      setExpandedAssignments({ [localId]: true });
    }
  }, [course, exclusiveCourse?.id]);

  const toggleAssignment = (localId: number) => {
    setExpandedAssignments((prev) => ({
      ...prev,
      [localId]: !prev[localId],
    }));
  };

  const addAssignment = () => {
    const newLocalId = localCounter + 1;
    setLocalCounter(newLocalId);

    const newAssignment: LocalAssignment = {
      localId: newLocalId,
      title: `Assignment ${assignments.length + 1}`,
      description: "",
      courseId: exclusiveCourse?.id || 0,
    };

    setAssignments((prev) => [...prev, newAssignment]);
    setExpandedAssignments((prev) => ({ ...prev, [newLocalId]: true }));
  };

  const updateAssignment = (
    localId: number,
    field: keyof Assignment,
    value: string
  ) => {
    setAssignments((prev) =>
      prev.map((assign) =>
        assign.localId === localId ? { ...assign, [field]: value } : assign
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

    setAssignments((prev) =>
      prev.map((assign) =>
        assign.localId === localId ? { ...assign, pdfFile: file } : assign
      )
    );
  };

  const removePdf = (localId: number) => {
    setAssignments((prev) =>
      prev.map((assign) =>
        assign.localId === localId
          ? { ...assign, pdfFile: null, existingPdfUrl: undefined }
          : assign
      )
    );
  };

  const courseId = exclusiveCourse?.id;

  // Save all assignments (for initial creation)
  const handleAssignmentUpload = async () => {
    setIsUploading(true);

    try {
      const formData = new FormData();

      // Add all PDF files with indexed names
      assignments.forEach((assignment, index) => {
        if (assignment.pdfFile) {
          formData.append(`pdf_${index}`, assignment.pdfFile);
        }
      });

      // Prepare assignments data
      const assignmentsData = assignments.map((a, index) => ({
        ...(a.id ? { id: a.id } : {}),
        title: a.title,
        description: a.description,
        courseId: exclusiveCourse?.id,
        pdfIndex: a.pdfFile ? index : undefined,
        ...(a.existingPdfUrl && !a.pdfFile ? { pdf: a.existingPdfUrl } : {}),
      }));

      formData.append("assignment", JSON.stringify(assignmentsData));

      const res = await api.post(`/course/assignment/${courseId}`, formData);

      setCourse(res.data.data);
      toast.success("Assignments saved!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to save assignments");
    } finally {
      setIsUploading(false);
    }
  };

  // Update single assignment
  const handleSingleAssignmentUpdate = async (
    updatedAssignment: LocalAssignment
  ) => {
    try {
      const formData = new FormData();

      // Add PDF if there's a new file
      if (updatedAssignment.pdfFile) {
        formData.append("pdf", updatedAssignment.pdfFile);
      }

      // Prepare assignment data
      const assignmentData = {
        id: updatedAssignment.id,
        title: updatedAssignment.title,
        description: updatedAssignment.description,
        courseId: exclusiveCourse?.id,
        ...(updatedAssignment.existingPdfUrl && !updatedAssignment.pdfFile
          ? { pdf: updatedAssignment.existingPdfUrl }
          : {}),
      };

      formData.append("assignment", JSON.stringify(assignmentData));

      const res = await api.put(
        `/course/assignment/${courseId}/${updatedAssignment.id}`,
        formData
      );

      setCourse(res.data.data);

      // Update local state
      setAssignments((prev) =>
        prev.map((a) =>
          a.localId === updatedAssignment.localId
            ? { ...updatedAssignment, existingPdfUrl: res.data.data.assignment?.pdf }
            : a
        )
      );

      toast.success("Assignment updated!");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update assignment");
      throw err;
    }
  };

  const openEditModal = (assignment: LocalAssignment) => {
    setEditingAssignment(assignment);
    setIsModalOpen(true);
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Assignments</h1>

      {assignments.map((assignment) => (
        <div
          key={assignment.localId}
          className="bg-white rounded-xl border-2 border-teal-200 p-6 shadow-sm mb-4"
        >
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3 flex-1 cursor-pointer"
              onClick={() => toggleAssignment(assignment.localId)}
            >
              <h3 className="text-lg font-medium text-gray-900">
                {assignment.title}
              </h3>
              {expandedAssignments[assignment.localId] ? (
                <ChevronUp className="h-5 w-5 text-teal-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-teal-500" />
              )}
            </div>

            {/* Edit Icon - only show if assignment has an ID (already saved) */}
            {assignment.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openEditModal(assignment);
                }}
                className="p-2 hover:bg-teal-50 rounded-lg transition-colors"
                title="Edit Assignment"
              >
                <Edit className="h-5 w-5 text-teal-600" />
              </button>
            )}
          </div>

          {expandedAssignments[assignment.localId] && (
            <div className="mt-6 py-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Title
                </label>
                <input
                  type="text"
                  value={assignment.title || ""}
                  onChange={(e) =>
                    updateAssignment(assignment.localId, "title", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assignment Description
                </label>
                <div className="shadow-md">
                  <SimpleEditor
                    value={assignment.description || ""}
                    onChange={(value) =>
                      updateAssignment(assignment.localId, "description", value)
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload PDF Assignment
                </label>

                {assignment.pdfFile || assignment.existingPdfUrl ? (
                  <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-300 rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-red-500" />
                      <span className="text-sm text-gray-700">
                        {assignment.pdfFile
                          ? assignment.pdfFile.name
                          : assignment.existingPdfUrl?.split("/").pop() ||
                            "Uploaded PDF"}
                      </span>
                      {assignment.pdfFile && (
                        <span className="text-xs text-gray-500">
                          ({(assignment.pdfFile.size / 1024).toFixed(2)} KB)
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removePdf(assignment.localId)}
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
                          assignment.localId,
                          e.target.files?.[0] || null
                        )
                      }
                      className="hidden"
                      id={`pdf-upload-${assignment.localId}`}
                    />
                    <label
                      htmlFor={`pdf-upload-${assignment.localId}`}
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
        onClick={addAssignment}
        className="w-full bg-white border-2 border-dashed border-teal-300 rounded-xl p-6 text-center hover:border-teal-400 hover:bg-teal-50 transition-colors group"
      >
        <div className="flex items-center justify-center gap-2 text-teal-500 group-hover:text-teal-600">
          <Plus className="h-5 w-5" />
          <span className="font-medium">Add Assignment</span>
        </div>
      </button>

      <div className="flex gap-4 pt-6">
        <button
          onClick={handleAssignmentUpload}
          disabled={isUploading}
          className="flex-1 bg-teal-500 text-white py-4 px-8 rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUploading ? "Saving..." : "Save All Assignments"}
        </button>
        <button className="flex-1 bg-white border border-gray-300 text-gray-700 py-4 px-8 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Send for Approval
        </button>
      </div>

      {/* Edit Modal */}
      {editingAssignment && (
        <EditAssignmentModal
          assignment={editingAssignment}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingAssignment(null);
          }}
          onSave={handleSingleAssignmentUpdate}
        />
      )}
    </>
  );
};

export default AssignmentManagement;