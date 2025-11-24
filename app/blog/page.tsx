"use client";

import React, { useEffect, useState } from "react";
import Footer from "@/component/reusable/Footer";
import Navbar from "@/component/reusable/Navbar";
import Image from "next/image";
import Link from "next/link";
import { Onest } from "next/font/google";
import { Loader2 } from "lucide-react";
import api from "@/hooks/axios";

type BlogPost = {
  id: string | number;
  title: string;
  image?: string;
  date?: string;
  excerpt?: string;
  slug?: string;
  content?: string;
  publishedAt?: string;
  thumbnail?: string;
};

const onest = Onest({
  subsets: ["latin"],
  weight: "400",
});

const formatDate = (value?: string) => {
  if (!value) return "Latest";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const stripHtml = (html: string) => {
  if (!html) return "";
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
};

const getExcerpt = (content?: string, maxLength: number = 120) => {
  if (!content) return "";
  const text = stripHtml(content);
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlogs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await api.get("/blog");
      const data = res.data?.data ?? [];

      const mapped: BlogPost[] = Array.isArray(data)
        ? data.map((post: any, index: number) => ({
            id: post.id ?? index,
            title: post.title ?? "Untitled blog",
            image: post.image ?? post.thumbnail ?? "/static/landing/course.svg",
            date: post.date ?? post.publishedAt ?? post.createdAt,
            excerpt:
              post.excerpt ??
              post.description ??
              getExcerpt(post.content ?? ""),
            slug: post.id?.toString() ?? post.slug ?? index.toString(),
            content: post.content,
            publishedAt: post.publishedAt,
            thumbnail: post.thumbnail,
          }))
        : [];

      setBlogs(mapped);
    } catch (err) {
      console.error("Error fetching blogs:", err);
      setError("Failed to load blog posts. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className={`font-hove flex min-h-screen flex-col bg-gray-50`}>
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-12 py-14 sm:py-16 lg:py-10">
          {/* Header */}
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                From Our <span className="text-teal-400">Blogs</span>
              </h1>
              <p className="max-w-2xl text-base sm:text-lg text-gray-600">
                Stay updated with the latest tips, ideas, and student success
                stories from the TutorMe community.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-teal-400 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-teal-50"
            >
              Back to home
            </Link>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin text-teal-500 mx-auto mb-4" />
                <p className="text-gray-600 text-base">
                  Loading blog posts...
                </p>
              </div>
            </div>
          )}

          {/* Error state */}
          {!isLoading && error && (
            <div className="flex items-center justify-center py-20">
              <div className="max-w-md text-center rounded-2xl border border-red-200 bg-red-50 px-6 py-8">
                <h2 className="mb-2 text-xl font-semibold text-red-600">
                  Oops!
                </h2>
                <p className="mb-4 text-sm text-gray-700">{error}</p>
                <button
                  onClick={fetchBlogs}
                  className="inline-flex items-center rounded-full bg-teal-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-teal-600"
                >
                  Try again
                </button>
              </div>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && blogs.length === 0 && (
            <div className="flex items-center justify-center py-20">
              <p className="text-gray-500 text-lg">
                No blog posts available yet.
              </p>
            </div>
          )}

          {/* Blog grid */}
          {!isLoading && !error && blogs.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {blogs.map((post) => {
                const href = post.id
                  ? `/blog/${post.id}`
                  : post.slug
                  ? `/blog/${post.slug}`
                  : "/blog";

                return (
                  <article
                    key={post.id}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                      <Image
                        src={post.image || "/static/landing/course.svg"}
                        alt={post.title}
                        fill
                        className="object-cover transition duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col gap-3 px-6 pb-6 pt-5">
                      <p className="text-sm font-medium text-teal-500">
                        {formatDate(post.date)}
                      </p>
                      <h2 className="text-xl font-semibold text-gray-900 leading-snug line-clamp-2">
                        {post.title}
                      </h2>
                      {post.excerpt && (
                        <p className="text-sm text-gray-600 line-clamp-3">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-auto">
                        <Link
                          href={href}
                          className="inline-flex items-center text-sm font-semibold text-teal-600 transition hover:text-teal-700"
                        >
                          Read more
                          <span
                            aria-hidden
                            className="ml-2 transition duration-200 group-hover:translate-x-1"
                          >
                            -&gt;
                          </span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
