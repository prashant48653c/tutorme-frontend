'use client'
import React, { useState, useEffect } from 'react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight, Loader2 } from "lucide-react";
import Marquee from "react-fast-marquee";
import api from '@/hooks/axios';
 

interface Blog {
  id: number;
  title: string;
  content: string;
  publishedAt: string;
  thumbnail: string;
  slug?: string;
}

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const res = await api.get('/blog');
      setBlogPosts(res.data.data);
    } catch (err: any) {
      console.error('Error fetching blogs:', err);
      setError('Failed to load blog posts. Please try again later.');
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

  const stripHtml = (html: string) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  const getExcerpt = (content: string, maxLength: number = 100) => {
    const text = stripHtml(content);
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <section className="py-16 pl-16 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-teal-500 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading blog posts...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 pl-16 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-3">Oops!</h2>
            <p className="text-gray-700 mb-6">{error}</p>
            <Button 
              onClick={fetchBlogs}
              className="bg-teal-500 hover:bg-teal-600"
            >
              Try Again
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 pl-16 bg-gray-50">
      <div className="lg:max-w-7xl md:max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex md:flex-row flex-col pr-20 lg:pl-16 items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl  md:text-5xl font-hove font-extrabold text-gray-900 mb-4">
              From Our <span className="text-teal-400">Blogs</span>
            </h2>
            <p className="text-gray-600 text-ls lg:text-lg">
              Stay updated with the latest insights, tips, and trends from our blogs.
            </p>
          </div>
          <div>
            <Link href="/blog">
              <Button className=" sm:flex group border-green-400 bg-white justify-around text-center border min-w-[10rem] mt-4 px-1 py-6 text-lg font-semibold pl-3 rounded-full text-black hover:bg-teal-50 transition">
                View all Blogs
                <span className="icon-hover-rotate">
                  <div className="rounded-full p-3 bg-green-400">
                    <ArrowUpRight color="white" size={15} />
                  </div>
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Blog Posts */}
        {blogPosts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl">No blog posts available yet.</p>
          </div>
        ) : (
          <>
            {/* Scrollable Blog Cards */}
            <div className="pb-4 overflow-x-visible">
              <Marquee pauseOnHover={true} gradient={false} speed={40}>
                <div className="flex gap-6 px-6 min-w-max">
                  {[...blogPosts, ...blogPosts].map((post, index) => {
                    const href = post.id
                      ? `/blog/${post.id}`
                      : post.slug
                      ? `/blog/${post.slug}`
                      : "/blog";

                    return (
                      <div className="flex-shrink-0 w-80 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer">
                        <Link href={href} className="block relative h-48 overflow-hidden">
                          <Image
                            src={post.thumbnail || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </Link>
                        <div className="p-6">
                          <p className="text-sm text-gray-500 mb-3">
                            {formatDate(post.publishedAt)}
                          </p>
                          <Link href={href}>
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 line-clamp-2 hover:text-teal-600 transition-colors">
                              {post.title}
                            </h3>
                          </Link>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {getExcerpt(post.content, 80)}
                          </p>
                          <Link href={href}>
                            <Button
                              variant="outline"
                              className="flex items-center rounded-full gap-2 text-gray-700 border-gray-300 hover:bg-gray-50"
                            >
                              Read More
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Marquee>
            </div>

            {/* Mobile View All Button */}
            <div className="flex justify-center mt-8 md:hidden min-w-[200%] sm:min-w-max">
              <Link href="/blog">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 px-6 py-3 rounded-full border-2 border-teal-400 text-teal-600 hover:bg-teal-50 bg-white"
                >
                  View all Blogs
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
