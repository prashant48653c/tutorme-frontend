 'use client';
import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { checkKhaltiPaymentForLoadBalance } from '@/hooks/khalti';
import StudentWallet from '@/components/student/StudentWallet';
import AddCourse from '@/components/tutor/AddCourse';

const WalletPage = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const searchParams = useSearchParams();
  const pidx = searchParams.get('pidx');
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (pidx && user) {
      checkKhaltiPaymentForLoadBalance({
        id: user?.id,
        pidx,
      });
    }
  }, [pidx, user]);

  return (
    <section className="flex py-10 pl-4 flex-col gap-y-9">
      <div>
        <StudentWallet />
      </div>
    </section>
  );
};

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WalletPage />
    </Suspense>
  );
}
