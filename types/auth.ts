export interface User {
  id: number;
  name: string;
  email: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  image: string | null;
  phoneNumber: string;
  isEmailVerified: boolean;
  createdAt: string;
  bio:string;
  updatedAt?: string;
  googleId?: string | null;
  tutorProfile?: any | null;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: "STUDENT" | "TUTOR";
  phoneNumber: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}


export interface EducationType{
  timePeriod:string;
  qualification:string;
  type:string;
  institutionName:string;
  id:number;

}