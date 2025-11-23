import Footer from "@/component/reusable/Footer";
import Navbar from "@/component/reusable/Navbar";
import Image from "next/image";
import Link from "next/link";
import { Onest } from "next/font/google";

type BlogPost = {
  id: string | number;
  title: string;
  image?: string;
  date?: string;
  excerpt?: string;
  slug?: string;
};

const onest = Onest({
  subsets: ["latin"],
  weight: "400",
});

const FALLBACK_BLOGS: BlogPost[] = [
  {
    id: 1,
    title: "From Panic to Prepared: A Night Before Exam Checklist",
    image: "/static/landing/course.svg",
    date: "June 02, 2024",
    excerpt: "Practical steps to stay calm, focused, and ready to ace exam day.",
    slug: "panic-to-prepared",
  },
  {
    id: 2,
    title: "How to Find the Right Tutor in Under 10 Minutes",
    image: "/static/landing/course.svg",
    date: "June 02, 2024",
    excerpt: "A quick framework to match with the tutor who fits your goals.",
    slug: "find-the-right-tutor",
  },
  {
    id: 3,
    title: "5 Last-Minute Study Hacks That Actually Work",
    image: "/static/landing/course.svg",
    date: "June 02, 2024",
    excerpt: "Battle-tested tips to squeeze the most out of crunch time.",
    slug: "last-minute-study-hacks",
  },
  {
    id: 4,
    title: "The Ultimate Guide to Online Learning Success",
    image: "/static/landing/course.svg",
    date: "June 02, 2024",
    excerpt: "Habits, tools, and routines that keep you engaged and progressing.",
    slug: "online-learning-success",
  },
  {
    id: 5,
    title: "Building Confidence Before Your Big Presentation",
    image: "/static/landing/course.svg",
    date: "June 02, 2024",
    excerpt: "Prep moves that steady your nerves and elevate your delivery.",
    slug: "confidence-before-presentation",
  },
  {
    id: 6,
    title: "Study Smarter: Structuring Sessions for Focus",
    image: "/static/landing/course.svg",
    date: "June 02, 2024",
    excerpt: "Simple session layouts to avoid burnout and keep momentum.",
    slug: "structure-study-sessions",
  },
];

const BLOG_ENDPOINT =
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/blogs`
    : "http://localhost:4000/api/blogs";

const slugify = (value?: string) =>
  value
    ? value
        .toString()
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
    : undefined;

export const revalidate = 300;

async function fetchBlogs(): Promise<BlogPost[]> {
  try {
    const res = await fetch(BLOG_ENDPOINT, {
      next: { revalidate },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch blogs");
    }

    const data = await res.json();
    const posts = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];

    if (!posts.length) return FALLBACK_BLOGS;

    return posts.map((post: any, index: number) => ({
      id: post.id ?? index,
      title: post.title ?? "Untitled blog",
      image: post.image ?? "/static/landing/course.svg",
      date: post.date ?? post.createdAt,
      excerpt: post.excerpt ?? post.description ?? "",
      slug: post.slug ?? slugify(post.title) ?? post.id?.toString(),
    }));
  } catch (error) {
    console.error("Error fetching blogs", error);
    return FALLBACK_BLOGS;
  }
}

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

export default async function BlogPage() {
  const blogs = await fetchBlogs();

  return (
    <div className={`font-hove flex min-h-screen flex-col bg-gray-50`}>
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-12 py-14 sm:py-16 lg:py-20">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight">
                From Our <span className="text-teal-400">Blogs</span>
              </h1>
              <p className="max-w-2xl text-base sm:text-lg text-gray-600">
                Stay updated with the latest tips, ideas, and student success stories from the TutorMe community.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center rounded-full border border-teal-400 bg-white px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-teal-50"
            >
              Back to home
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((post) => {
              const href = post.slug ? `/blog/${post.slug}` : "/blog";

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
                    <p className="text-sm font-medium text-teal-500">{formatDate(post.date)}</p>
                    <h2 className="text-xl font-semibold text-gray-900 leading-snug line-clamp-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-3">{post.excerpt}</p>
                    )}
                    <div className="mt-auto">
                      <Link
                        href={href}
                        className="inline-flex items-center text-sm font-semibold text-teal-600 transition hover:text-teal-700"
                      >
                        Read more
                        <span aria-hidden className="ml-2 transition duration-200 group-hover:translate-x-1">-&gt;</span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
