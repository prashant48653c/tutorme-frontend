// app/auth/success/page.tsx
'use client'
import { Suspense } from "react";
import AuthSuccessContent from "@/components/AuthSuccessContent";
import { SessionProvider } from "next-auth/react";


export const dynamic = "force-dynamic";


export default function AuthSuccessPage() {
  
  return (
     <SessionProvider >
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
        <Suspense fallback={<div>Loading...</div>}>
          <AuthSuccessContent />
        </Suspense>
      </div>
    </div>
    </SessionProvider>
  );
}