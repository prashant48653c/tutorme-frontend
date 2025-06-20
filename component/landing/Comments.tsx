import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

export default function Comments() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
        <div className="space-y-6">
         
          <Card className="bg-white p-0 ">
            <CardContent className="p-0">
              <div className="flex items-start px-4 pt-5 gap-3 mb-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/static/landing/hero1.svg" />
                  <AvatarFallback className="bg-gray-600 text-white">
                    RS
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">Rashmi Sharma</h3>
                  <p className="text-sm text-gray-500">June 02, 2024</p>
                </div>
              </div>
              <p className="text-gray-800 px-4 mb-4">
                I am having merge issues in while pushing the codes. Can anyone
                help me solve this?
              </p>
              <div className="text-right px-4 py-2">
                <span className="text-sm text-teal-600 font-medium">
                  2 replies
                </span>
              </div>
              <div className="">
                <Image
                  src="/static/landing/course.svg"
                  alt="3D rendered scene with spherical objects"
                  width={400}
                  height={250}
                  className="rounded-b-lg w-full object-cover"
                />
              </div>
            </CardContent>
          </Card>
 
        </div>
 
        <div className="space-y-6">
         
        <Card className="bg-white py-0 cursor-pointer hover:bg-green-400 transition-all group">
  <CardContent className="p-6">
    <div className="flex items-start gap-3 mb-4">
      <Avatar className="w-10 h-10">
        <AvatarImage src="/placeholder.svg" />
        <AvatarFallback className="bg-gray-600 text-white group-hover:text-white">
          RS
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-semibold text-gray-900 group-hover:text-white">
          Rashmi Sharma
        </h3>
        <p className="text-sm text-gray-500 group-hover:text-white">
          June 02, 2024
        </p>
      </div>
    </div>
    <p className="text-gray-800 mb-4 group-hover:text-white">
      Difference between a one-tailed and two-tailed test. When to use
      each one and give an example with a real-world application?
      Also, how do I interpret the p-value correctly?
    </p>
    <div className="text-right">
      <span className="text-sm text-teal-600 font-medium group-hover:text-white">
        2 replies
      </span>
    </div>
  </CardContent>
</Card>


         <Card className="bg-white py-0  cursor-pointer hover:bg-green-400 transition-all group">
  <CardContent className="p-6">
    <div className="flex items-start gap-3 mb-4">
      <Avatar className="w-10 h-10">
        <AvatarImage src="/placeholder.svg" />
        <AvatarFallback className="bg-gray-600 text-white group-hover:text-white">
          RS
        </AvatarFallback>
      </Avatar>
      <div>
        <h3 className="font-semibold text-gray-900 group-hover:text-white">
          Rashmi Sharma
        </h3>
        <p className="text-sm text-gray-500 group-hover:text-white">
          June 02, 2024
        </p>
      </div>
    </div>
    <p className="text-gray-800 mb-4 group-hover:text-white">
     When do I use a normal distribution versus a binomial distribution in statistics?
    </p>
    <div className="text-right">
      <span className="text-sm text-teal-600 font-medium group-hover:text-white">
        2 replies
      </span>
    </div>
  </CardContent>
</Card>

        </div>



        <div>
          <Card className="bg-white p-0">
            <CardContent className="p-0">
              <div className="mb-4">
                <Image
                  src="/static/landing/course.svg"
                  alt="3D rendered scene with spherical objects"
                  width={400}
                  height={250}
                  className="rounded-lg w-full object-cover"
                />
              </div>
              <div className="flex px-4 items-start gap-3 mb-4">
                <Avatar className="w-10 h-10">
                  <AvatarImage src="/static/landing/hero1.svg" />
                  <AvatarFallback className="bg-gray-600 text-white">
                    RS
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-gray-900">Rashmi Sharma</h3>
                  <p className="text-sm text-gray-500">June 02, 2024</p>
                </div>
              </div>
              <p className="text-gray-800 mb-4 px-4">
                I am having merge issues in while pushing the codes. Can anyone
                help me solve this?
              </p>
              <div className="text-right px-4 py-2">
                <span className="text-sm text-teal-600 font-medium">
                  2 replies
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
