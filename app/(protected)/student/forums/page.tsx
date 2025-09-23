"use client";

import { useEffect, useState } from "react";
import {
  Edit,
  Send,
  ImageIcon,
  X,
  ArrowUp,
  ArrowDown,
  Share,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import Image from "next/image";
import React from "react";
import api from "@/hooks/axios";
import {
  createPost,
  followUser,
  getMyFollowList,
  unfollowUser,
  useMyFollowList,
  usePosts,
  votePost,
} from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/types/auth";
import AdInTake from "@/component/adsense/AdTake";

interface Comment {
  id: number;
  userId: number;
  forumId: number;
  description: string;
  FormVote: any;
  user: User;
  upvotes: number;
  downvotes: number;
  replies: Comment[] & { children: Comment[] };
}
interface Post {
  id: number;
  description: string;
  pictures: string[];
  tags: string;
  createdAt: string;
  studentProfile: any;
  comments: Comment[];
  replies: Comment[];
  upvotes: number;
  downvotes: number;
}
type LocalPost = Post & {
  userVote: "UPVOTE" | "DOWNVOTE" | null;
};

// New Modal Component
function CommentsModal({
  post,
  isOpen,
  onClose,
  refetch,
}: {
  post: Post;
  isOpen: boolean;
  onClose: () => void;
  refetch: () => void;
}) {
  const user = useAuthStore((state) => state.user);
  const [newComment, setNewComment] = useState("");

  const handleCommentPost = async (post: Post) => {
    const res = await api.post(`/forum/comments/${post.id}`, {
      forumId: post.id,
      userId: user?.id,
      description: newComment,
    });
    console.log(res.data.data);
    refetch();
    setNewComment("");
  };

  const handleVote = async (post: Post, type: "UPVOTE" | "DOWNVOTE") => {
    try {
      await votePost(post.id, type, user?.id as number);
      refetch();
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Post Comments</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Content - Scrollable */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Post Content */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3 mb-3">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src={post.studentProfile.user.image || "/placeholder.svg"}
                />
                <AvatarFallback>
                  {post.studentProfile.user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">
                  {post.studentProfile.user.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>
            <p className="text-gray-800 mb-3">{post.description}</p>

            {post.pictures[0] && (
              <img
                src={post.pictures[0]}
                alt="post attachment"
                className="rounded-lg max-h-60 object-cover mb-3"
              />
            )}

            <div className="flex justify-between text-sm text-gray-500 mb-3">
              <p>23k views</p>
              <p>{post.comments.length} comments</p>
            </div>

            <div className="flex py-2 items-center justify-between">
              <div className="flex px-2 justify-between gap-2">
                <button
                  onClick={() => handleVote(post, "UPVOTE")}
                  className="flex gap-1 p-2 border-2 justify-between rounded"
                >
                  <ArrowUp size={16} /> Upvote ({post.upvotes})
                </button>

                <button
                  onClick={() => handleVote(post, "DOWNVOTE")}
                  className="flex gap-1 p-2 border-2 justify-between rounded"
                >
                  <ArrowDown size={16} /> Downvote ({post.downvotes})
                </button>
              </div>
              <div>
                <Share />
              </div>
            </div>
          </div>

          {/* Add Comment Section */}
          <div className="px-4 py-4 border-b">
            <div className="flex gap-3 items-start">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.image as string} />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="relative flex-1">
                <Textarea
                  placeholder="Post Comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="w-full min-h-[40px] text-sm border border-gray-200 rounded-md focus:border-cyan-500 pr-12 resize-none"
                />
                <button
                  type="button"
                  onClick={() => handleCommentPost(post)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
                >
                  <Send size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* All Comments */}
          <div className="px-4 py-4">
            {post.comments.length > 0 ? (
              <div className="space-y-4">
                <h4 className="font-semibold text-sm">
                  All Comments ({post.comments.length})
                </h4>
                {post.comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    refetch={refetch}
                    comment={comment}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No comments yet. Be the first to comment!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(isoDateStr: string): string {
  const date = new Date(isoDateStr);

  // Options for formatting the time
  const timeOptions: any = { hour: "numeric", minute: "2-digit", hour12: true };
  const timeStr = date.toLocaleTimeString("en-US", timeOptions);

  // Options for formatting the date
  const dateOptions: any = { month: "long", day: "numeric", year: "numeric" };
  const dateStr = date.toLocaleDateString("en-US", dateOptions);

  return `${timeStr} - ${dateStr}`;
}

const ForumPage = () => {
  const user = useAuthStore((state) => state.user);
  const [newComment, setNewComment] = useState("");
  const [vote, setVote] = useState(null);
  const [localPosts, setLocalPosts] = useState<LocalPost[]>([]);

  const [description, setDescription] = useState("");
  const [flair, setFlair] = useState<"Question" | "Thoughts" | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [posts, setPosts] = useState<
    { description: string; flair: string; createdAt: string; image?: string }[]
  >([]);
 const [isFollowing, setIsFollowing] = useState<number[]>([]);

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: responsePosts, refetch, isPending } = usePosts();

  const studentId = user?.studentProfile?.id;
  console.log(studentId);
  const {
    data: responseFollowList,
    refetch: refetchFollowList,
    isPending: isPendingFollowList,
  } = useMyFollowList(studentId);
  console.log(responseFollowList);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

const handleVote = async (postId: number, type: "UPVOTE" | "DOWNVOTE") => {
  setLocalPosts(prevPosts =>
    prevPosts.map(post => {
      if (post.id !== postId) return post;

      let upvotes = post.upvotes;
      let downvotes = post.downvotes;
      let userVote = post.userVote;

      if (userVote === type) {
        // Undo the vote
        if (type === "UPVOTE") upvotes -= 1;
        else downvotes -= 1;
        userVote = null;
      } else {
        // Switch or first vote
        if (type === "UPVOTE") {
          upvotes += 1;
          if (userVote === "DOWNVOTE") downvotes -= 1;
        } else {
          downvotes += 1;
          if (userVote === "UPVOTE") upvotes -= 1;
        }
        userVote = type;
      }

      return { ...post, upvotes, downvotes, userVote };
    })
  );

  try {
    await votePost(postId, type, user?.id as number); // persist to backend
  } catch (error) {
    console.error("Error voting:", error);
    // Optional: rollback if needed
  }
};




const handleFollow = async (profileId: number, userId: number) => {
  try {
    if (isFollowing.includes(profileId)) {
      // unfollow
      await unfollowUser(profileId, userId);
      setIsFollowing(prev => prev.filter(id => id !== profileId));
    } else {
      // follow
      await followUser(profileId, userId);
      setIsFollowing(prev => [...prev, profileId]);
    }
  } catch (error) {
    console.error("Error following/unfollowing user:", error);
  }
};


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !flair) {
      alert("Please add a description and select a flair.");
      return;
    }

    const formData = new FormData();

    formData.append("description", description);
    formData.append("tag", flair);
    const id = user?.studentProfile.id;
    formData.append("profileId", String(id));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    const data = await createPost(formData);
    console.log(data);
    refetch();
    setDescription("");
    setFlair(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleCommentPost = async (post: Post) => {
    const res = await api.post(`/forum/comments/${post.id}`, {
      forumId: post.id,
      userId: user?.id,
      description: newComment,
    });
    console.log(res.data.data);
    refetch();
    setNewComment("");
  };

  useEffect(() => {
  if (responseFollowList?.follower) {
    setIsFollowing(responseFollowList.follower.map((f: any) => f.followerId));
  }
}, [responseFollowList]);
  const openCommentsModal = (post: Post) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closeCommentsModal = () => {
    setSelectedPost(null);
    setIsModalOpen(false);
  };
useEffect(() => {
  if (responsePosts) {
    setLocalPosts(
      responsePosts.map((p:any) => ({
        ...p,
        userVote: null // initialize with no vote
      }))
    );
  }
}, [responsePosts]);

  if (isPending) {
    return <div>Loading...</div>;
  }

  console.log(responsePosts);
  return (
    <section className="flex gap-3 justify-start w-full">
      {/* Main Form Section */}
      <section className="w-[75%] ">
        <form
          onSubmit={handleSubmit}
          className="w-full p-5 border rounded-3xl shadow-2xs"
        >
          {/* Input with Send Button */}
          <div className="w-full flex gap-2 p-4 items-center relative">
            <Image
              src={"/static/landing/course.svg"}
              width={80}
              height={80}
              alt="profile"
              className="rounded-full w-12 h-12 object-cover"
            />

            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex-1 rounded-2xl outline-none border-0 bg-[#F5F7F9] py-2 px-4 pr-10"
              placeholder="Want to ask or share?"
            />

            {/* Up Arrow Button */}
            <button
              type="submit"
              className="absolute right-8 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
            >
              <Send size={16} />
            </button>
          </div>

          {/* Image Attachment */}
          <div className="flex items-center gap-3 px-4 pb-2">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-600 hover:text-blue-600">
              <ImageIcon size={18} />
              <span>Attach Image</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="relative w-fit mt-2 ml-4">
              <img
                src={imagePreview}
                alt="preview"
                className="max-h-40 rounded-lg border"
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <hr />

          {/* Flair Selection */}
          <div className="flex items-center text-sm gap-6 py-3 justify-center">
            <button
              type="button"
              onClick={() => setFlair("Question")}
              className={`flex gap-2 items-center px-3 py-1 rounded-2xl border ${
                flair === "Question" ? "bg-blue-100 border-blue-500" : ""
              }`}
            >
              <Edit size={16} />
              <p>Ask a Question</p>
            </button>

            <button
              type="button"
              onClick={() => setFlair("Thoughts")}
              className={`flex gap-2 items-center px-3 py-1 rounded-2xl border ${
                flair === "Thoughts" ? "bg-green-100 border-green-500" : ""
              }`}
            >
              <Edit size={16} />
              <p>Share your Thoughts</p>
            </button>
          </div>
        </form>

        {/* Posts Feed */}
        <div className="mt-6 space-y-4">
          {localPosts.map((post: LocalPost, index: number) => (
            <div
              key={index}
              className="border p-4 rounded-2xl shadow-sm bg-white"
            >
              <div className="p-4 pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage
                        src={
                          post.studentProfile.user.image || "/placeholder.svg"
                        }
                      />
                      <AvatarFallback>
                        {post.studentProfile.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-sm">
                        {post.studentProfile.user.name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {formatDate(post.createdAt)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      handleFollow(
                        post.studentProfile.id,
                        user?.studentProfile?.id as number
                      )
                    }
                    className={cn(
                      "text-xs font-medium",
                      isFollowing
                        ? "text-gray-600 hover:text-gray-800"
                        : "text-cyan-500 hover:text-cyan-600"
                    )}
                  >
                   {isFollowing.includes(post.studentProfile.id) ? "Following" : "+ Follow"}
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-gray-800">{post.description}</p>

              {post.pictures[0] && (
                <img
                  src={post.pictures[0]}
                  alt="post attachment"
                  className="mt-3 rounded-lg aspect-video border"
                />
              )}
              <div className="flex justify-between">
                <p>23k views</p>
                <p>{post.comments.length} comments</p>
              </div>

              <div className="flex py-2 items-center justify-between">
                <div className="flex px-2 justify-between gap-2">
           <button
      onClick={() => handleVote(post.id, "UPVOTE")}
      className={`flex gap-1 p-2 border-2 justify-between ${
        post.userVote === "UPVOTE" ? "text-green-600" : "text-gray-600"
      }`}
    >
      <ArrowUp /> Upvote ({post.upvotes})
    </button>

    <button
      onClick={() => handleVote(post.id, "DOWNVOTE")}
      className={`flex gap-1 p-2 border-2 justify-between ${
        post.userVote === "DOWNVOTE" ? "text-red-600" : "text-gray-600"
      }`}
    >
      <ArrowDown /> Downvote ({post.downvotes})
    </button>
                </div>
                <div>
                  <Share />
                </div>
              </div>

              {/* Post Comment  */}
              <div className="px-4 py-4 w-full">
                <div className="flex gap-3 items-start">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user?.image as string} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div className="relative flex-1">
                    <Textarea
                      placeholder="Post Comment"
                      rows={1}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full min-h-[40px] text-sm border border-gray-200 rounded-md focus:border-cyan-500 pr-12 resize-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleCommentPost(post)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Comment listing - Show only first comment */}
              {post.comments.length > 0 && (
                <div className="px-4 pb-4">
                  <h4 className="font-semibold text-sm mb-4">Top Comment</h4>
                  <div className="space-y-4">
                    <CommentItem
                      key={post.comments[0].id}
                      refetch={refetch}
                      comment={post.comments[0]}
                    />
                  </div>

                  {/* View More Button */}
                  {post.comments.length > 1 && (
                    <div className="mt-4 text-center">
                      <button
                        onClick={() => openCommentsModal(post)}
                        className="text-cyan-500 hover:text-cyan-600 text-sm font-medium px-4 py-2 border border-cyan-200 rounded-full hover:bg-cyan-50 transition-colors"
                      >
                        View all {post.comments.length} comments
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Sidebar */}
      <aside className="w-[25%]">
          <AdInTake dataAdFormat='auto' dataAdSlot='8397997281' dataFullWidthResponsive={true}/>
      </aside>

      {/* Comments Modal */}
      {selectedPost && (
        <CommentsModal
          post={selectedPost}
          isOpen={isModalOpen}
          onClose={closeCommentsModal}
          refetch={refetch}
        />
      )}
    </section>
  );
};

function CommentItem({
  comment,
  isReply = false,
  isChildReply = false,
  refetch,
}: {
  comment: Comment;
  isReply?: boolean;
  isChildReply?: boolean;
  refetch: () => void;
}) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");
  const user = useAuthStore((state) => state.user);

  const handleCommentPost = async (comment: Comment) => {
    if (isReply) {
      const res = await api.post(`/forum/comments/childreply/${comment.id}`, {
        commentId: comment.id,
        userId: user?.id,
        description: replyText,
      });

      console.log(res.data.data);
    } else {
      const res = await api.post(`/forum/comments/reply/${comment.id}`, {
        commentId: comment.id,
        userId: user?.id,
        description: replyText,
      });

      console.log(res.data.data);
    }
    refetch();
    setShowReplyInput(!showReplyInput);
    setReplyText("");
  };
  return (
    <div
      className={cn("space-y-3", isReply && "ml-12", isChildReply && "ml-24")}
    >
      <div className="flex gap-3">
        <Avatar className="w-8 h-8">
          <AvatarImage src={comment.user.image || "/placeholder.svg"} />
          <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">{comment.user.name}</span>
            <span className="text-xs text-cyan-500">30 July</span>
          </div>
          <p className="text-sm text-gray-700">{comment.description}</p>
          <div className="flex items-center gap-4 text-xs">
            <button className="flex items-center gap-1 text-gray-500 hover:text-cyan-500">
              <ChevronUp className="w-3 h-3" />
              <span>{0}</span>
            </button>
            <button className="flex items-center gap-1 text-gray-500 hover:text-red-500">
              <ChevronDown className="w-3 h-3" />
              <span>{0}</span>
            </button>
            {!isChildReply && (
              <button
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="text-cyan-500 hover:text-cyan-600"
              >
                Reply
              </button>
            )}
          </div>

          {showReplyInput && (
            <div className="mt-2 space-y-2">
              <Textarea
                placeholder="Write a reply..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="min-h-[60px] text-sm"
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleCommentPost(comment)}
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  Reply
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setShowReplyInput(false);
                    setReplyText("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply: any) => (
            <div key={reply.id} className="ml-6">
              <CommentItem refetch={refetch} comment={reply} isReply={true} />
              {/* Render reply children recursively */}
              {reply.children && reply.children.length > 0 && (
                <div className="ml-6 mt-2 space-y-2">
                  {reply.children.map((child: any) => (
                    <CommentItem
                      key={child.id}
                      refetch={refetch}
                      comment={child}
                      isChildReply={true}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default ForumPage;
