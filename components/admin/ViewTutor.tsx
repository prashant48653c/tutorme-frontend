import React, { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';

const ViewTutor = ({ tutorProfile, onClose }:{tutorProfile:any,onClose:()=>void}) => {
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  const profile = tutorProfile ;
console.log(profile)

  const openPreview = (src?: string) => {
    if (src) setPreviewSrc(src);
  };

  const closePreview = () => setPreviewSrc(null);

  const documentImages = [
    {
      label: "Identification Certificate",
      src: profile?.tutorProfile?.identificationCert,
    },
    {
      label: "Qualification Certificate",
      src: profile?.tutorProfile?.qualificationCert,
    },
    {
      label: "Experience Letter",
      src: profile?.tutorProfile?.experienceLetter,
    },
    {
      label: "For Account Verification",
      src: profile?.tutorProfile?.chequeImage,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50  ">
      <div className="bg-white rounded-lg w-full 
    sm:max-w-lg 
    md:max-w-2xl 
    lg:max-w-4xl 
    xl:max-w-4xl 
    max-h-[90vh] 
    overflow-y-auto max-h-[90vh] overflow-y-auto no-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl text-gray-800">
            {profile.name}'s KYC
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={30} className="text-gray-800" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Personal Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Personal Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-3 lg:grid-cols-4">
              <div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  {profile?.name?.split(" ")[0] }
                </div>
              </div>
              <div>
                <div className="bg-gray-50 p-2 rounded-lg">
                                {profile?.name?.split(" ")[0] }

                </div>
              </div>
              <div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  {profile?.email || 'sandesh@gmail.com'}
                </div>
              </div>
              <div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  {profile?.phoneNumber || '9876543210'}
                </div>
              </div>
              <div>
                <div className="bg-gray-50 p-2  rounded-lg">
                  {profile?.address || 'Baneswor'}
                </div>
              </div>
              <div className="col-span-2">
                <div className="p-2 rounded-lg flex gap-2">
                  {(profile?.languages || ['English', 'Nepali']).map((lang:string, idx:number) => (
                    <span key={idx} className="px-2 py-1 bg-white border-2 border-teal-300 text-teal-400 rounded-md text-xs">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Payment Details</h3>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              
                <div className="bg-gray-50 p-2 rounded-lg">
                                {profile?.tutorProfile?.bankName}
                </div>
                <div className="bg-gray-50 p-2 rounded-lg">
                                {profile?.tutorProfile?.bankAccountNumber || '0283641221649'}

                </div>
              
              <div>
                <div className="bg-gray-50 p-2 rounded-lg">
                  {profile?.tutorProfile?.bankAccountNumber || '0283641221649'} (Khalti)
                </div>
              </div>
            </div>
          </div>

          {/* Qualification Details */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Qualification Details</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4  gap-y-10 text-sm text-gray-400">
              <div>
                <label className="text-gray-400 block mb-1">Qualification</label>
                <div className="bg-gray-50 p-2 rounded-lg">
                  {profile?.tutorProfile?.qualifications || 'Bachelors in Software Engineering'}
                </div>
              </div>
              <div>
                <label className=" block mb-1">Where did you Graduate From?</label>
                <div className="bg-gray-50 p-2 rounded-lg">
                  {profile?.tutorProfile?.graduatedFrom || 'ABC University'}
                </div>
              </div>
              <div>
                <label className=" block mb-1">What year did you graduate?</label>
                <div className="bg-gray-50 p-2 rounded-lg">
                  {profile?.tutorProfile?.graduationYear || '2024'}
                </div>
              </div>
              <div>
                <label className=" block mb-1">What do you do?</label>
                <div className="bg-gray-50 p-2 rounded-lg">
                  {profile?.tutorProfile?.jobTitle || 'UI/UX Designer'}
                </div>
              </div>
              <div>
                <label className="block mb-1">Working Experience</label>
                <div className="bg-gray-50 p-2 rounded-lg">
                  {profile.tutorProfile?.workingExperience || '7 Years'}
                </div>
              </div>
              <div className='mt-[-22px]'>
                <label className="block mb-1">Which grade students did you previously teach?</label>
                <div className="bg-gray-50 p-2 rounded-lg">
                  {profile?.qualificationDetails?.gradesTaught || '12'}
                </div>
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Are you currently working?</label>
                <div className="bg-gray-50 p-2 rounded-lg flex items-center gap-2">
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
              <div className='lg:ml-[290px] lg:!w-full'>
                <label className="text-gray-400 block mb-1 ">If Yes, Where?</label>
                <div className="bg-gray-50 p-2 rounded-lg">
                  {profile?.tutorProfile?.workingOrganization || 'Worldwide Name'}
                </div>
              </div>
            </div>
          </div>

          {/* Uploaded Documents */}
          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-4 text-center">Uploaded Documents</h3>
            <div className="grid grid-cols-2 gap-4">
              {documentImages.map(({ label, src }) => (
                <div key={label} className="space-y-2">
                  <label className="text-sm text-gray-500 block">{label}</label>
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden aspect-[4/3] h-32 w-full">
                    <img
                      src={src}
                      alt={label}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => openPreview(src)}
                      className="absolute bottom-2 right-2 rounded-full bg-white/80 p-2 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                      aria-label={`Preview ${label}`}
                    >
                      <ZoomIn size={18} className="text-gray-800" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {previewSrc && (
            <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
              <div className="relative bg-transparent rounded-lg shadow-lg p-3 max-w-5xl w-full flex items-center justify-center">
                <button
                  type="button"
                  onClick={closePreview}
                  className="absolute top-2 right-2 rounded-full bg-white/80 p-2 shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Close preview"
                >
                  <X size={18} className="text-gray-800" />
                </button>
                <img
                  src={previewSrc}
                  alt="Document preview"
                  className="max-h-[80vh] max-w-[90vw] object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewTutor;
