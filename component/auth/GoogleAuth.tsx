import { useGoogleLogin } from "@react-oauth/google";
import { decode } from "jwt-js-decode";
import api from "@/hooks/axios";
import { Button } from "@/button";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

interface GoogleButtonProps {
  role: string;
}

export default function GoogleButton({ role }: GoogleButtonProps) {
  const setUser=useAuthStore((state)=>state.setUser);
  const router= useRouter()
  const login = useGoogleLogin({
    onSuccess: async (tokenResponse: any) => {
      try {
        const userInfo = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        const data = await userInfo.json();
        console.log(data);
        const { email, name, picture: image, sub: googleId } = data;

        // Send to backend
        const res = await api.post("/auth/google-auth", {
          email,
          name,
          image,
          googleId,
          role,
        });
        console.log(res.data);
        const { token, user } = res.data.data;
        setUser(user)
        if(user.role=="TUTOR"){
          router.push("/tutor/profile");
        }else{
          router.push("/student/profile");
        }

        // Store token
        localStorage.setItem("authToken", token);

        console.log("Logged in user:", user);
      } catch (err) {
        console.error("Google login failed:", err);
      }
    },
    onError: () => {
      console.error("Google login failed");
    },
  });

  const handleGoogleAuth = () => login();

  return (
    <Button
      type="button"
      onClick={handleGoogleAuth}
      variant="outline"
      className="w-full h-12 border-gray-200 hover:bg-gray-50"
    >
      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
        {/* SVG paths as in your button */}
      </svg>
      Continue with Google
    </Button>
  );
}
