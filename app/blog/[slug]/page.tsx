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
    slug: "find-the-right-tutor",
    title: "How to Find the Right Tutor in Under 10 Minutes",
    image: "/static/landing/course.svg",
    date: "June 02, 2024",
    excerpt: "A quick framework to match with the tutor who fits your goals.",
    content:
      "Define your goal in one sentence, pick the subject depth you need, and screen tutors by outcomes not buzzwords. Look for clear communication, relevant experience, and sample explanations. A short intro call beats long bios -- ask them to explain one problem live and see if it clicks.",
  },
  {
    id: 3,
    slug: "last-minute-study-hacks",
    title: "5 Last-Minute Study Hacks That Actually Work",
    image: "/static/landing/course.svg",
    date: "June 02, 2024",
    excerpt: "Battle-tested tips to squeeze the most out of crunch time.",
    content:
      "Use 25-minute sprints with 5-minute breaks, and focus on active recall: write what you remember, then check. Teach one concept out loud, then practice a past paper. Reduce distractions ruthlessly -- one tab, phone away. Hydrate, breathe, and take a short walk when focus drops.",
  },
  {
    id: 4,
    slug: "online-learning-success",
    title: "The Ultimate Guide to Online Learning Success",
    image: "/static/landing/course.svg",
    date: "June 02, 2024",
    excerpt: "Habits, tools, and routines that keep you engaged and progressing.",
    content:
      "Treat online learning like a scheduled class: fixed time, clear outcomes. Set up a simple space, pick a single note system, and track progress weekly. Mix watch/read with do/quiz. Join a small accountability group -- light social pressure boosts completion rates dramatically.",
  },
  {
    id: 5,
    slug: "confidence-before-presentation",
    title: "Building Confidence Before Your Big Presentation",
    image: "/static/landing/course.svg",
    date: "June 02, 2024",
    excerpt: "Prep moves that steady your nerves and elevate your delivery.",
    content:
      "Script your opening and closing, then practice with a timer twice. Record a 60-second clip to adjust pacing. On the day, breathe in for 4, hold for 4, out for 6 before you start. Remember: clarity beats charisma, and eye contact anchors you.",
  },
  {
    id: 6,
    slug: "structure-study-sessions",
    title: "Study Smarter: Structuring Sessions for Focus",
    image: "/static/landing/course.svg",
    date: "June 02, 2024",
    excerpt: "Simple session layouts to avoid burnout and keep momentum.",
    content:
      "Open with a 5-minute warmup (easy reps), spend 30-40 minutes on the hardest task, and finish with a 10-minute recap list of what to hit next. Keep snacks light, water nearby, and rotate between reading, recall, and problem-solving to stay engaged.",
  },
];

const BLOG_ENDPOINT =
  process.env.NEXT_PUBLIC_API_URL
    ? `${process.env.NEXT_PUBLIC_API_URL}/blogs`
    : "http://localhost:4000/api/blogs";

export const revalidate = 300;

async function fetchBlog(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${BLOG_ENDPOINT}/${slug}`, {
      next: { revalidate },
    });

    if (!res.ok) {
      throw new Error("Failed to fetch blog");
    }

    const data = await res.json();
    const post = data?.data ?? data;
    if (!post) return null;

    return {
      id: post.id ?? slug,
      title: post.title ?? "Untitled blog",
      image: post.image ?? "/static/landing/course.svg",
      date: post.date ?? post.createdAt,
      excerpt: post.excerpt ?? post.description ?? "",
      content: post.content ?? post.body ?? post.description ?? "",
      slug: post.slug ?? slug,
    };
  } catch (error) {
    console.error("Error fetching blog", error);
    const fallback =
      FALLBACK_BLOGS.find((b) => b.slug === slug || b.id?.toString() === slug) ??
      FALLBACK_BLOGS[0];
    return fallback;
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

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const blog = await fetchBlog(params.slug);

  return (
    <div className={`${onest.className} flex min-h-screen flex-col bg-gray-50`}>
      <Navbar />

      <main className="flex-1">
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-12 py-14 sm:py-16 lg:py-20">
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
              <div className="prose max-w-none text-gray-800 prose-p:mb-5 prose-p:leading-relaxed">
                {(blog?.content ?? blog?.excerpt ?? "Content coming soon.").split("\n").map((para, idx) => (
                  <p key={idx}>{para.trim()}</p>
                ))}
              </div>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </div>
  );
}
