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
  return useQuery({ queryKey: ['postss'], queryFn: fetchPosts })
};

export const createPost=async(formData:FormData)=>{
      const res=await api.post("/forum/posts",formData);
      return res.data.data;
}

export const votePost=async(id:number, type:"UPVOTE"|"DOWNVOTE",userId:number)=>{
      const res=await api.post(`/forum/votes/posts/${id}`,{type,userId});
      return res.data.data;
}

export const voteComment=async(id:number,formData:FormData)=>{
      const res=await api.post(`/forum/votes/comments/${id}`,formData);
      return res.data.data;
}

export const followUser=async(id:number,userId:number)=>{
      const res=await api.post(`/forum/follow/${id}`,{userId});
      return res.data.data;
}

export const unfollowUser=async(id:number,userId:number)=>{
      const res=await api.post(`/forum/unfollow/${id}`,{userId});
      return res.data.data;
}

export const getMyFollowList=async(id:number)=>{
      const res=await api.get(`/forum/follow/list/${id}`);
      
      return res.data.data;
      
}
 

export const useMyFollowList = (id?: number) => {
  return useQuery({
    queryKey: ['followList', id],
    queryFn: () => getMyFollowList(id!),
    enabled: !!id,  
  });
};