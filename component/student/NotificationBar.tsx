import { MoveRight } from 'lucide-react'
import React from 'react'

const NotificationBar = () => {
  return (
    <aside className=" ">
<h4 className="text-xl font-[600]">Notification</h4>
        <div className="flex min-h-[18rem] p-6 gapy4  rounded-sm border-gray-100 shadow-xl bg-white flex-col">
            <div className='flex items-start justify-start gap-3'>
                <MoveRight fill='#09C4AE' size={20}/>
                <div className="flex flex-col gap-2">
                    <h5 className="text-lg">
                        Well done! You have completed the course!
                    </h5>
                    <p className="text-sm font-light text-gray-300">Yesterday</p>
                </div>
            </div>

              <div className='flex items-start justify-start gap-3'>
                <MoveRight fill='#09C4AE' size={20}/>
                <div className="flex flex-col gap-2">
                    <h5 className="text-lg">
                        Well done! You have completed the course!
                    </h5>
                    <p className="text-sm font-light text-gray-300">Yesterday</p>
                </div>
            </div>
        </div>
    </aside>
  )
}

export default NotificationBar