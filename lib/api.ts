import api from "@/hooks/axios";
import { useQuery } from "@tanstack/react-query";

export const getUserData = async (id: number) => {
  const res = await api.get(`/auth/user/${id}`);
  console.log(res);
  return res.data.data;
};


const fetchPosts=async()=>{
  const res=await api.get("/forum/posts");
  return res.data.data;
}
export const usePosts = () => {
  return useQuery({ queryKey: ['posts'], queryFn: fetchPosts })
};

export const createPost=async(formData:FormData)=>{
      const res=await api.post("/forum/posts",formData);
      return res.data.data;
}