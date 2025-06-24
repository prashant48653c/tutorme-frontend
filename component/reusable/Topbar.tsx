import { Input } from '@/components/ui/input'
import { Bell, Search } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const Topbar = () => {
  return (
    <nav className='w-full mb-8 px-4 items-center flex justify-between'>
<div className='flex flex-col items-start gap-1'>
<h5 className="text-lg font-medium">Hi! Sandesh</h5>
<p className='text-sm text-gray-500 '>Let’s do something new today!</p>
</div>


<div className="flex items-center ">
    <div className='flex items-center border rounded-lg bg-[#F5F7F9] p-2 gap-2 justify-center'>
        <Search size={18}/>
        <input  className='border-0 min-w-[20rem] outline-0 hover:outline-0' placeholder='Search..' />
    </div>

    <div className="flex ml-6 items-center justify-center gap-2">
        <div className='relative'>
            <Bell fill='black' size={23}/>
            <div className="bg-green-600 rounded-full w-3 h-3 absolute top-[-2] right-[0] border-2 border-white"></div>
        </div>
       <div className="w-10 h-10">
  <Image
    src="/static/landing/course.svg"
    width={40}
    height={40}
    alt="profile"
    className="rounded-full object-cover w-full h-full"
  />
</div>

    </div>
</div>
    </nav>
  )
}

export default Topbar