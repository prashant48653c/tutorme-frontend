'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Calendar, Trash2, ChevronUp, ChevronDown, Upload, X, Edit } from 'lucide-react';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import api from '@/hooks/axios';

interface Blog {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
  thumbnail: string;
}

interface NewBlog {
  title: string;
  content: string;
  imageUrl: string | null;
  imageFile: File | null;
}

interface EditBlog extends Blog {
  imageUrl: string;
  imageFile: File | null;
}

interface EditBlogModalProps {
  blog: EditBlog;
  isOpen: boolean;
  onClose: () => void;
  onRefresh: () => void;
}

interface ExpandedBlogs {
  [key: number]: boolean;
}

// Edit Blog Modal Component
const EditBlogModal: React.FC<EditBlogModalProps> = ({ blog, isOpen, onClose, onRefresh }) => {
  const [editedBlog, setEditedBlog] = useState<EditBlog>(blog);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  useEffect(() => {
    setEditedBlog(blog);
  }, [blog]);

  const handleImageChange = (file: File | undefined) => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size should be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setEditedBlog((prev) => ({ 
        ...prev, 
        imageFile: file, 
        imageUrl: reader.result as string 
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    if (!editedBlog.title || !editedBlog.content) {
      alert('Please fill in all required fields');
      return;
    }

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('title', editedBlog.title);
      formData.append('content', editedBlog.content);
      
      if (editedBlog.imageFile) {
        formData.append('image', editedBlog.imageFile);
      } else {
        formData.append('thumbnail', editedBlog.thumbnail);
      }

      await api.patch(`/blog/${editedBlog.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Blog updated successfully!');
      onRefresh();
      onClose();
    } catch (error) {
      console.error('Error updating blog:', error);
      alert('Failed to update blog. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Edit Blog Post</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title
            </label>
            <input
              type="text"
              value={editedBlog.title || ""}
              onChange={(e) => setEditedBlog((prev) => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Content
            </label>
            <div className="shadow-md">
              <SimpleEditor
                value={editedBlog.content || ""}
                onChange={(value: string) => setEditedBlog((prev) => ({ ...prev, content: value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Blog Image
            </label>

            {editedBlog.imageUrl && (
              <div className="space-y-3 mb-3">
                <img
                  src={editedBlog.imageUrl}
                  alt="Blog preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-sm text-gray-500">Current image (upload new to replace)</p>
              </div>
            )}

            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageChange(e.target.files?.[0])}
                className="hidden"
                id="modal-image-upload"
              />
              <label
                htmlFor="modal-image-upload"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors"
              >
                <Upload className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {editedBlog.imageFile ? editedBlog.imageFile.name : 'Click to upload new image (Max 5MB)'}
                </span>
              </label>
            </div>
          </div>
        </div>

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
            {isUpdating ? "Updating..." : "Update Blog"}
          </button>
        </div>
      </div>
    </div>
  );
};

const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [expandedBlogs, setExpandedBlogs] = useState<ExpandedBlogs>({});
  const [newBlog, setNewBlog] = useState<NewBlog>({
    title: '',
    content: '',
    imageUrl: null,
    imageFile: null
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [editingBlog, setEditingBlog] = useState<EditBlog | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch all blogs on component mount
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const res = await api.get<{ data: Blog[] }>('/blog');
      setBlogs(res.data.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      alert('Failed to load blogs. Please refresh the page.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBlog = (id: number): void => {
    setExpandedBlogs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleImageUpload = (file: File | undefined): void => {
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Image file size should be less than 5MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewBlog((prev) => ({ 
        ...prev, 
        imageFile: file, 
        imageUrl: reader.result as string 
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeImage = (): void => {
    setNewBlog((prev) => ({ ...prev, imageFile: null, imageUrl: null }));
  };

  const handleCreateBlog = async (): Promise<void> => {
    if (!newBlog.title || !newBlog.content) {
      alert('Please fill in all required fields');
      return;
    }

    if (!newBlog.imageFile) {
      alert('Please upload an image');
      return;
    }

    setIsCreating(true);
    
    try {
      const formData = new FormData();
      formData.append('title', newBlog.title);
      formData.append('content', newBlog.content);
      formData.append('image', newBlog.imageFile);

      await api.post('/blog', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('Blog created successfully!');
      setNewBlog({ title: '', content: '', imageUrl: null, imageFile: null });
      fetchBlogs(); // Refresh the blog list
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Failed to create blog. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!window.confirm('Are you sure you want to delete this blog?')) {
      return;
    }

    try {
      await api.delete(`/blog/${id}`);
      alert('Blog deleted successfully!');
      fetchBlogs(); // Refresh the blog list
    } catch (error) {
      console.error('Error deleting blog:', error);
      alert('Failed to delete blog. Please try again.');
    }
  };

  const openEditModal = (blog: Blog): void => {
    setEditingBlog({
      ...blog,
      imageUrl: blog.thumbnail,
      imageFile: null
    });
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading blogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Blog Management</h1>

        {/* Create Blog Section */}
        <div className="bg-white overflow-y-auto rounded-xl border-2 border-teal-200 p-6 shadow-sm mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-teal-500 p-2 rounded-lg">
              <Plus className="text-white" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Create New Blog</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Title
              </label>
              <input
                type="text"
                value={newBlog.title}
                onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
                placeholder="Enter blog title..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blog Content
              </label>
              <div className="shadow-md">
                <SimpleEditor
                  value={newBlog.content}
                  onChange={(value: string) => setNewBlog({ ...newBlog, content: value })}
                />
              </div>
            </div>
 
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Blog Image *
              </label>

              {newBlog.imageUrl ? (
                <div className="space-y-3">
                  <img
                    src={newBlog.imageUrl}
                    alt="Blog preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={removeImage}
                    className="w-full px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="h-4 w-4" />
                    Remove Image
                  </button>
                </div>
              ) : (
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files?.[0])}
                    className="hidden"
                    id="new-blog-image"
                  />
                  <label
                    htmlFor="new-blog-image"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-colors"
                  >
                    <Upload className="h-5 w-5 text-gray-400" />
                    <span className="text-sm text-gray-600">Click to upload image (Max 5MB)</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={handleCreateBlog}
            disabled={isCreating}
            className="w-full mt-6 bg-teal-500 text-white py-4 px-8 rounded-lg font-medium hover:bg-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Plus size={20} />
            {isCreating ? "Creating..." : "Create Blog Post"}
          </button>
        </div>

        {/* All Blogs Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <span className="bg-gray-800 w-1 h-8 rounded-full"></span>
            All Blog Posts ({blogs.length})
          </h2>

          <div className="space-y-4">
            {blogs.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                <p className="text-gray-500 text-lg">No blog posts yet. Create your first one above!</p>
              </div>
            ) : (
              blogs.map((blog) => (
                <div
                  key={blog.id}
                  className="bg-white rounded-xl border-2 border-teal-200 p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-3 flex-1 cursor-pointer"
                      onClick={() => toggleBlog(blog.id)}
                    >
                      <h3 className="text-lg font-medium text-gray-900">{blog.title}</h3>
                      {expandedBlogs[blog.id] ? (
                        <ChevronUp className="h-5 w-5 text-teal-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-teal-500" />
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/blog/${blog.id}`}
                        className="p-2 hover:bg-teal-50 rounded-lg transition-colors text-teal-600 text-sm font-medium"
                        title="View blog"
                      >
                        Read more
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openEditModal(blog);
                        }}
                        className="p-2 hover:bg-teal-50 rounded-lg transition-colors"
                        title="Edit Blog"
                      >
                        <Edit className="h-5 w-5 text-teal-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(blog.id);
                        }}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Blog"
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  </div>

                  {expandedBlogs[blog.id] && (
                    <div className="mt-6 space-y-4">
                      {blog.thumbnail && (
                        <img
                          src={blog.thumbnail}
                          alt={blog.title}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                      )}

                      <div className="prose max-w-none">
                        <div 
                          className="text-gray-600 leading-relaxed"
                          dangerouslySetInnerHTML={{ __html: blog.content }}
                        />
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-500 pt-4 border-t">
                        <div className="flex items-center gap-2">
                          <Calendar size={16} />
                          <span>{formatDate(blog.publishedAt)}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Edit Modal */}
        {editingBlog && (
          <EditBlogModal
            blog={editingBlog}
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false);
              setEditingBlog(null);
            }}
            onRefresh={fetchBlogs}
          />
        )}
      </div>
    </div>
  );
};

export default Blog;
