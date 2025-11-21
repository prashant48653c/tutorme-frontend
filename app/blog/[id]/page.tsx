'use client'
import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import api from '@/hooks/axios';
 

interface Blog {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
  thumbnail: string;
}

const BlogViewPage = () => {
  const params = useParams();
  const router = useRouter();
  const blogId = params.id as string;

  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (blogId) {
      fetchBlog();
    }
  }, [blogId]);

  const fetchBlog = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await api.get(`/blog/${blogId}`);
      setBlog(res.data.data);
    } catch (err: any) {
      console.error('Error fetching blog:', err);
      if (err.response?.status === 404) {
        setError('Blog post not found');
      } else {
        setError('Failed to load blog post. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-teal-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-3">Oops!</h2>
            <p className="text-gray-700 mb-6">{error || 'Blog post not found'}</p>
            <button
              onClick={() => router.back()}
              className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header with Back Button */}
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-teal-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      {/* Blog Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Featured Image */}
          {blog.thumbnail && (
            <div className="w-full h-96 overflow-hidden">
              <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Blog Header */}
          <div className="p-8 md:p-12">
            <div className="mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {blog.title}
              </h1>
              
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="h-5 w-5" />
                <time dateTime={blog.publishedAt}>
                  {formatDate(blog.publishedAt)}
                </time>
              </div>
            </div>

            {/* Blog Content */}
            <div className="border-t pt-8">
              <div 
                className="prose prose-lg max-w-none
                  prose-headings:text-gray-900 
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-a:text-teal-600 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-gray-900
                  prose-ul:text-gray-700
                  prose-ol:text-gray-700
                  prose-blockquote:border-teal-500 prose-blockquote:bg-teal-50 prose-blockquote:py-2
                  prose-code:text-teal-600 prose-code:bg-gray-100 prose-code:px-1 prose-code:rounded
                  prose-pre:bg-gray-900 prose-pre:text-gray-100
                  prose-img:rounded-lg prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: blog.content }}
              />
            </div>
          </div>
        </article>

        {/* Back to Blogs Button at Bottom */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/blog')}
            className="px-8 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium"
          >
            View All Blogs
          </button>
        </div>
      </div>
    </div>
  );
};

export default BlogViewPage;