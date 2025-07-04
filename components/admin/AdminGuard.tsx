"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/hooks/axios";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const id = user?.id;
        

        const res = await api.get(`/auth/is-admin`, {
          params: { id },
          withCredentials: true,
        });
        console.log(res);
        if (res.data?.data?.isAdmin) {
          setLoading(false);
        }
      } catch (err) {
        console.error("Admin check failed", err);
        router.push("/");
      }
    };

    checkAdmin();
  }, [user?.id]);

 if (loading) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-6">
      <h1 className="text-2xl font-bold text-red-600 mb-4">
        Only admins are allowed to access this page.
      </h1>
      <button
        onClick={() => router.push("/")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Go to Homepage
      </button>
    </div>
  );
}


  return <>{children}</>;
}
