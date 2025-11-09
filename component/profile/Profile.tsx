"use client";
import { Button } from "@/components/ui/button";
import { Inbox } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import EditProfileForm from "./EditProfile";
import { useAuthStore } from "@/store/useAuthStore";
import KYCVerificationModal from "../auth/KycPop";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import api from "@/hooks/axios";
import { toast } from "sonner";

const Profile = () => {
  const progress = 60;
  const { user, setUser } = useAuthStore();
  console.log(user);
  const [status, setStatus] = useState(false);
  const imageRef: any = useRef(null);
  const handleUserImageUpload = async () => {
    const fileInput = imageRef.current as any;
    if (!fileInput?.files?.[0]) return;

    const formData = new FormData();
    formData.append("profile", fileInput.files[0]);
    console.log(fileInput.files);

    const uploadPromise = api.post(`/auth/user/pp/${user?.id}`, formData);
    toast.promise(uploadPromise, {
      loading: "Uploading your profile picture!",
      success: "Profile Picture has been updated",
      error: "Something went wrong",
    });
    try {
      const res = await uploadPromise;

      setUser(res.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
    }
  };
  return (
    <div className="shadow-md   rounded-2xl p-4 pb-7 ">
      <div className="text-center flex flex-col items-center my-3">
        <div className="relative w-32 h-32">
          <div
            className="absolute  inset-0 rounded-full"
            style={{
              background: `conic-gradient(from 25deg, #09C4AE ${progress}%, transparent ${progress}% 100%)`,
              transform: "scaleX(-1)",
            }}
          ></div>

          <div className="absolute inset-[6px] rounded-full overflow-hidden bg-white">
            <Image
              src={user?.image || "/icons/profile.png"}
              alt="profile"
              width={96}
              height={96}
              className="w-full h-full p-1 rounded-full
                   object-cover"
            />
          </div>
        </div>

        <p
          onClick={() => imageRef.current?.click()}
          className="my-2 text-primeGreen text-sm cursor-pointer"
        >
          Upload Profile Picture
        </p>
        <input
          type="file"
          onChange={handleUserImageUpload}
          ref={imageRef}
          className="invisible"
        />
      </div>

      <div>
        {status && (
          <Dialog open={status} onOpenChange={() => setStatus(false)}>
            <DialogContent className=" rounded-md">
              <EditProfileForm setStatus={setStatus} />
            </DialogContent>
          </Dialog>
        )}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h5 className="text-2xl font-semibold">{user?.name}</h5>
              <Image
                src={"/static/icons/verified.svg"}
                width={30}
                height={30}
                alt="profile"
                className="rounded-full  lg:visible object-cover w-6 h-6"
              />
            </div>
            <p className="text-lg  text-primeGreen">
              {user?.tutorProfile?.jobTitle || "No designation"}
            </p>
          </div>

          <div>
            <Button
              onClick={() => setStatus(true)}
              className="bg-gray-100 hover:bg-green-100 text-primeGreen font-normal"
            >
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="grid mt-5 grid-cols-1 justify-center lg:grid-cols-2 gap-3">
          <div className="flex gap-2 flex-col">
            <div className="flex items-center h-fit  justify-start gap-2">
              <Image
                src="/static/icons/d1.svg"
                alt="location"
                width={20}
                height={20}
              />

              <p
                className="text-sm break-words sm:truncate sm:max-w-[11rem]"
                title={user?.email}
              >
                {user?.email}
              </p>
            </div>

            <div className="flex items-center justify-start gap-2">
              <Image
                src="/static/icons/d2.svg"
                alt="location"
                width={20}
                height={20}
              />
              <p>{user?.tutorProfile?.address || "No address"}</p>
            </div>
            <div className="flex items-center justify-start gap-2">
              <Image
                src="/static/icons/d4.svg"
                alt="location"
                width={20}
                height={20}
              />

              <p>4 Courses</p>
            </div>
          </div>

          <div className="flex gap-2 flex-col">
            <div className="flex items-center justify-start gap-2">
              <Image
                src="/static/icons/d3.svg"
                alt="location"
                width={20}
                height={20}
              />

              <p>{user?.tutorProfile?.currentOrganization || "None"}</p>
            </div>
            <div className="flex items-center justify-start gap-2">
              <Image
                src="/static/icons/d5.svg"
                alt="location"
                width={20}
                height={20}
              />

              <p>{user?.phoneNumber}</p>
            </div>

            <div className="flex items-center justify-start gap-2">
              <Image
                src="/static/icons/d6.svg"
                alt="location"
                width={20}
                height={20}
              />

              <p>{user?.tutorProfile?.language.join(", ") || "None"}</p>
            </div>
          </div>
        </div>
      </div>

       
        <div className="absolute invisible ">
          <KYCVerificationModal />
        </div>
      
    </div>
  );
};

export default Profile;
