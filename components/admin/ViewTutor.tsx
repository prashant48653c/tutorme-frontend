import React from 'react';
import { X, Eye } from 'lucide-react';

const ViewTutor = ({ tutorProfile, onClose }:{tutorProfile:any,onClose:()=>void}) => {
  // Default data for demonstration
 
  const profile = tutorProfile ;
console.log(profile)
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-semibold text-gray-800">
            {profile.name}'s KYC
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Personal Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-500 block mb-1">First Name</label>
                <div className="bg-gray-50 p-2 rounded">
                  {profile?.name?.split(" ")[0] }
                </div>
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Last Name</label>
                <div className="bg-gray-50 p-2 rounded">
                                {profile?.name?.split(" ")[0] }

                </div>
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Email</label>
                <div className="bg-gray-50 p-2 rounded">
                  {profile?.email || 'sandesh@gmail.com'}
                </div>
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Phone</label>
                <div className="bg-gray-50 p-2 rounded">
                  {profile?.phoneNumber || '9876543210'}
                </div>
              </div>
              <div className="col-span-2">
                <label className="text-gray-500 block mb-1">Languages</label>
                <div className="bg-gray-50 p-2 rounded flex gap-2">
                  {(profile?.languages || ['English', 'Nepali']).map((lang:string, idx:number) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-500 block mb-1">{profile?.tutorProfile?.bankName}</label>
                <div className="bg-gray-50 p-2 rounded">
                                {profile?.tutorProfile?.bankAccountNumber || '0283641221649'}

                </div>
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Khalti</label>
                <div className="bg-gray-50 p-2 rounded">
                  {profile?.tutorProfile?.bankAccountNumber || '0283641221649'}
                </div>
              </div>
            </div>
          </div>

          {/* Qualification Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Qualification Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <label className="text-gray-500 block mb-1">Qualification</label>
                <div className="bg-gray-50 p-2 rounded">
                  {profile?.tutorProfile?.qualifications || 'Bachelors in Software Engineering'}
                </div>
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Where did you Graduate From?</label>
                <div className="bg-gray-50 p-2 rounded">
                  {profile?.tutorProfile?.graduatedFrom || 'ABC University'}
                </div>
              </div>
              <div>
                <label className="text-gray-500 block mb-1">What year did you graduate?</label>
                <div className="bg-gray-50 p-2 rounded">
                  {profile?.tutorProfile?.graduationYear || '2024'}
                </div>
              </div>
              <div>
                <label className="text-gray-500 block mb-1">What do you do?</label>
                <div className="bg-gray-50 p-2 rounded">
                  {profile?.tutorProfile?.jobTitle || 'UI/UX Designer'}
                </div>
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Working Experience</label>
                <div className="bg-gray-50 p-2 rounded">
                  {profile.tutorProfile?.workingExperience || '7 Years'}
                </div>
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Which grade students did you previously teach?</label>
                <div className="bg-gray-50 p-2 rounded">
                  {profile?.qualificationDetails?.gradesTaught || '12'}
                </div>
              </div>
              <div>
                <label className="text-gray-500 block mb-1">Are you currently working?</label>
                <div className="bg-gray-50 p-2 rounded flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full border-2 ${profile?.tutorProfile?.currentlyWorking === 'yes' ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                    {profile?.tutorProfile?.currentlyWorking === 'yes' && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                  <span>Yes</span>
                  <div className={`w-4 h-4 rounded-full border-2 ml-4 ${profile?.tutorProfile?.currentlyWorking === 'no' ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                    {profile?.tutorProfile?.currentlyWorking === 'no' && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                  <span>No</span>
                </div>
              </div>
              <div>
                <label className="text-gray-500 block mb-1">If Yes, Where?</label>
                <div className="bg-gray-50 p-2 rounded">
                  {profile?.tutorProfile?.workingOrganization || 'Worldwide Name'}
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4">Uploaded Documents</h3>
            <div className="grid grid-cols-2 gap-4">
             
             {/* imags */}
              
                <div  className="space-y-2">
                  <label className="text-sm text-gray-500 block">{"Identification Certificate"}</label>
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[3/2]">
                    <img
                      src={profile?.tutorProfile?.identificationCert}
                      alt={"certificate"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0  bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                      <Eye size={20} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>


                  <div  className="space-y-2">
                  <label className="text-sm text-gray-500 block">{"Qualification Certificate"}</label>
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[3/2]">
                    <img
                      src={profile?.tutorProfile?.qualificationCert}
                      alt={"certificate"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0  bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                      <Eye size={20} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>


                  <div  className="space-y-2">
                  <label className="text-sm text-gray-500 block">{"Experience Letter"}</label>
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[3/2]">
                    <img
                      src={profile?.tutorProfile?.experienceLetter}
                      alt={"certificate"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                      <Eye size={20} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>


                  <div  className="space-y-2">
                  <label className="text-sm text-gray-500 block">{"For Account Verification"}</label>
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[3/2]">
                    <img
                      src={profile?.tutorProfile?.chequeImage}
                      alt={"certificate"}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0   bg-opacity-0 hover:bg-opacity-30 transition-all flex items-center justify-center">
                      <Eye size={20} className="text-white opacity-0 hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                </div>
             
            </div>
          </div>


        </div>
      </div>
    </div>
  );
};

export default ViewTutor;