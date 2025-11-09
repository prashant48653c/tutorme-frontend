import Navbar from '@/component/reusable/Navbar';
import React from 'react';

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}
