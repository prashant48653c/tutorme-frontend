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
  content?: string;
  slug?: string;
};

const onest = Onest({
  subsets: ["latin"],
  weight: "400",
});

const FALLBACK_BLOGS: BlogPost[] = [
  {
    id: 1,
    slug: "panic-to-prepared",
    title: "From Panic to Prepared: A Night Before Exam Checklist",
    image: "/static/landing/course.svg",
    date: "June 02, 2024",
    excerpt: "Practical steps to stay calm, focused, and ready to ace exam day.",
    content:
      "When the night before an exam hits, it is easy to spin out. Start with a short, focused review, then set a time-boxed plan for sleep, hydration, and a simple morning routine. Your brain consolidates during rest -- trust it. Keep your notes light, avoid cramming new concepts, and prime yourself with a calm walkthrough of likely questions.",
  },
  {
    id: 2,
    slug: "how-to-focus",
    title: "How to Focus in Studies",
    image: "/static/landing/course.svg",
    date: "June 03, 2024",
    excerpt: "Simple habits that improve concentration and make study time effective.",
    content:
      "Staying focused while studying can feel difficult, especially with constant distractions around us. But with a few simple habits, you can improve concentration and make your study time more effective. Set clear goals, create a distraction-free environment, use 25-minute Pomodoro sprints, silence notifications, prioritize sleep and hydration, and end each session with a two-minute review to cement progress.",
  },
  {
    id: 3,
    slug: "habits-that-stick",
    title: "Habits That Stick: Build a Study Routine in 7 Days",
    image: "/static/landing/course.svg",
    date: "June 05, 2024",
    excerpt: "A simple, repeatable plan to form a study habit that lasts.",
    content:
      "Start with 20-minute sessions at the same time daily. Use a visible tracker, pair studying with a cue (after breakfast), and end with a 2-minute summary. Keep friction low: one spot, one notebook, one timer. At day seven, reward yourself and schedule the next week to lock the habit in.",
  },
];

const BLOG_ENDPOINT =
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/blog`
    : "http://localhost:4000/api/blog";

export const revalidate = 300;

async function fetchBlog(id: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${BLOG_ENDPOINT}/${id}`, {
      next: { revalidate },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch blog");
    }

    const data = await res.json();
    // API returns { success, data: [...] } or { success, data: {...} }
    const payload = data?.data ?? data;
    const post = Array.isArray(payload)
      ? payload.find((b) => b?.id?.toString() === id) ?? payload[0]
      : payload;
    if (!post) return null;

    return {
      id: post.id ?? id,
      title: post.title ?? "Untitled blog",
      image: post.thumbnail ?? post.image ?? "/static/landing/course.svg",
      date: post.publishedAt ?? post.date ?? post.createdAt,
      excerpt: post.excerpt ?? post.description ?? "",
      content: post.content ?? post.body ?? post.description ?? "",
      slug: post.slug ?? id,
    };
  } catch (error) {
    console.error("Error fetching blog", error);
    const fallback =
      FALLBACK_BLOGS.find(
        (b) => b.id?.toString() === id || b.slug === id
      ) ?? FALLBACK_BLOGS[0];
    return fallback;
  }
}

async function fetchRelatedBlogs(currentId: string): Promise<BlogPost[]> {
  try {
    const res = await fetch(BLOG_ENDPOINT, {
      next: { revalidate },
    });
    if (!res.ok) throw new Error("Failed to fetch related blogs");

    const data = await res.json();
    const payload = data?.data ?? data;
    const list = Array.isArray(payload) ? payload : [];

    const mapped: BlogPost[] = list.map((post: any, idx: number) => ({
      id: post.id ?? idx,
      title: post.title ?? "Untitled blog",
      image: post.thumbnail ?? post.image ?? "/static/landing/course.svg",
      date: post.publishedAt ?? post.date ?? post.createdAt,
      excerpt: post.excerpt ?? post.description ?? "",
      content: post.content ?? post.body ?? post.description ?? "",
      slug: post.slug ?? post.id ?? idx.toString(),
    }));

    const filtered = mapped.filter(
      (b) => b.id?.toString() !== currentId && b.slug !== currentId
    );

    const pool = filtered.length > 0 ? filtered : mapped;
    if (!pool || pool.length === 0) return [];

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 3);
  } catch (error) {
    console.error("Error fetching related blog", error);
    const fallbackCandidates = FALLBACK_BLOGS.filter(
      (b) => b.id?.toString() !== currentId && b.slug !== currentId
    );
    if (fallbackCandidates.length === 0) return [];
    return fallbackCandidates
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(3, fallbackCandidates.length));
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

export default async function BlogDetailByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const blog = await fetchBlog(id);
  const related = await fetchRelatedBlogs(id);

  return (
    <div className={`${onest.className} flex min-h-screen flex-col bg-gray-50`}>
      <Navbar />

      <main className="flex-1 font-hove">
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-12 py-14 sm:py-16 lg:py-10">
          <div className="mb-8 flex items-center justify-between gap-4">
            <Link
              href="/blog"
              className="inline-flex items-center rounded-full border border-teal-400 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm transition hover:bg-teal-50"
            >
              Back to blogs
            </Link>
            <p className="text-sm font-medium text-teal-600">
              {formatDate(blog?.date)}
            </p>
          </div>

          <article className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
            <div className="relative h-64 w-full sm:h-80 lg:h-96 bg-gray-100">
              <Image
                src={blog?.image || "/static/landing/course.svg"}
                alt={blog?.title || "Blog image"}
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-4 px-6 pb-10 pt-8 sm:px-8 lg:px-10">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-teal-500">
                Blog
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
                {blog?.title ?? "Blog"}
              </h1>
              {blog?.excerpt && (
                <p className="text-lg text-gray-600">{blog.excerpt}</p>
              )}
              <div className="h-px w-full bg-gray-100" />
              <div
                className="prose max-w-none text-gray-800 prose-p:mb-5 prose-p:leading-relaxed prose-h3:mt-6 prose-h3:mb-3"
                dangerouslySetInnerHTML={{
                  __html:
                    blog?.content?.trim() ||
                    blog?.excerpt ||
                    "Content coming soon.",
                }}
              />
            </div>
          </article>
        </section>

        {related && related.length > 0 && (
          <section className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-12 pb-16">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Related blogs</h2>
              <Link
                href="/blog"
                className="text-sm font-semibold text-teal-600 hover:text-teal-700"
              >
                View all
              </Link>
            </div>

            <div className="grid gap-6 grid-cols-3 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.id ?? item.slug}
                  href={`/blog/${item.slug ?? item.id}`}
                  className="group block rounded-3xl overflow-hidden bg-white shadow-sm ring-1 ring-gray-100 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative w-full aspect-square bg-gray-100">
                    <Image
                      src={item.image || "/static/landing/course.svg"}
                      alt={item.title || "Related blog"}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-2 px-5 py-4">
                    <p className="text-xs font-medium text-teal-500">
                      {formatDate(item.date)}
                    </p>
                    <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    {item.excerpt && (
                      <p className="text-xs text-gray-600 line-clamp-3">
                        {item.excerpt}
                      </p>
                    )}
                    <span className="inline-flex items-center text-sm font-semibold text-teal-600">
                      Read more
                      <span
                        aria-hidden
                        className="ml-2 transition duration-200 group-hover:translate-x-1"
                      >
                        -&gt;
                      </span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
