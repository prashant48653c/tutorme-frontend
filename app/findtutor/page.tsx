import CourseProductList from '@/component/landing/findtutor/ProductCourses'
import TutorProfile from '@/component/landing/findtutor/TutorProfile'
import Footer from '@/component/reusable/Footer'
import Navbar from '@/component/reusable/Navbar'
import React from 'react'

const FindTutors = () => {
  return (
    <div className='w-full h-full'>
        <Navbar />
        <div className="px-16">
<TutorProfile/>
        <CourseProductList/>
        </div>
        
        <Footer/>
    </div>
  )
}

export default FindTutors