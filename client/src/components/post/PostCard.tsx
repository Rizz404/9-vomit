// * External packages
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { ImArrowUp, ImArrowDown } from "react-icons/im";
import { FaRegCommentAlt } from "react-icons/fa";

// * Redux hooks and API slices
import { useAppDispatch, useAppSelector } from "../../hooks/reduxHooks";
import { useDeletePostMutation, useVotePostMutation } from "../../redux/api/postApiSlices";
import { useAddFriendMutation, useGetUserProfileQuery } from "../../redux/api/userApiSlices";
import { setImagePostIndex } from "../../redux/slices/postSlices";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  IconButton,
  Typography,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // * Jangan bingung
  // * Ini cuma mengambil parameter setelah category, jadi bisa userId, tagName, postId, dll
  const paramsAfterCategory = location.pathname.split("/")[2];

  const [showModal, setShowModal] = useState(false);

  const [vote] = useVotePostMutation();
  const [addFriend] = useAddFriendMutation();
  // ! buat agar ketika delete post maka commentnya dan id posts di tag juga di delete
  const [deletePost] = useDeletePostMutation();
  const { data: userProfile } = useGetUserProfileQuery();
  const {
    _id,
    userId: author,
    title,
    description,
    tags,
    images,
    upvotes,
    downvotes,
    commentsCount,
    createdAt,
  } = post;
  const postId = _id || "";

  const handleDelete = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      await deletePost({ postId }).unwrap();
      toast.success("Delete post successfully");
    } catch (error) {
      toast.error("hehe");
    }
  };

  const buttonVariant = (type: "upvote" | "downvote", userId: string) => {
    if (type === "upvote") {
      return upvotes?.userId.includes(userId) ? "fs-4 text-success" : "fs-4 text-secondary";
    } else if (type === "downvote") {
      return downvotes?.userId.includes(userId) ? "fs-4 text-danger" : "fs-4 text-secondary";
    } else {
      return "fs-4 text-secondary";
    }
  };

  const imageIndex = useAppSelector((state) => state.post);
  const handleImageChange = (selectedIndex: number) => {
    dispatch(setImagePostIndex({ postId, index: selectedIndex }));
  };

  return (
    <Card sx={{ mb: 2 }}>
      {userProfile && author && (
        <CardHeader
          avatar={
            userProfile.profilePict ? (
              <Avatar
                onClick={() => {
                  author._id !== paramsAfterCategory && navigate(`/user/${author._id}`);
                }}
                sx={{ cursor: "pointer" }}
                src={`http://localhost:5000/assets/profilePict/${author.profilePict}`}
                alt={author.username}
              />
            ) : (
              <Avatar
                onClick={() => {
                  author._id !== paramsAfterCategory && navigate(`/user/${author._id}`);
                }}
                sx={{ cursor: "pointer" }}>
                {author.username.split("")[0]}
              </Avatar>
            )
          }
          title={<Typography variant="h5">{title}</Typography>}
          subheader={createdAt}
          action={
            <IconButton>
              <MoreVert />
            </IconButton>
          }
        />
      )}
      <CardMedia component="img" image={`http://localhost:5000/assets/images/${images[0]}`} />
      <CardContent>
        {tags.map((tag, i) => (
          <Button
            variant="outlined"
            key={i}
            sx={{ mr: 1, mb: 2 }}
            onClick={() => {
              tag.name !== paramsAfterCategory && navigate(`/tag/${tag.name}`);
            }}>
            {tag.name}
          </Button>
        ))}
        <Typography
          variant="body2"
          p={1}
          onClick={() => {
            postId !== paramsAfterCategory && navigate(`/post/${postId}`);
          }}
          sx={{ cursor: postId !== paramsAfterCategory ? "pointer" : "" }}>
          {description}
        </Typography>
      </CardContent>
      <CardActions>
        <Box component="div" display="flex" justifyContent="space-between" alignItems="center">
          <IconButton onClick={() => vote({ action: "upvote", postId })}>
            <ImArrowUp />
          </IconButton>
          <Typography variant="h6">{upvotes?.count}</Typography>
        </Box>

        <Box component="div" display="flex" justifyContent="space-between" alignItems="center">
          <IconButton onClick={() => vote({ action: "downvote", postId })}>
            <ImArrowDown />
          </IconButton>
          <Typography variant="h6">{downvotes?.count}</Typography>
        </Box>
        <Box component="div" display="flex" justifyContent="space-between" alignItems="center">
          <IconButton onClick={() => postId !== paramsAfterCategory && navigate(`/post/${postId}`)}>
            <FaRegCommentAlt />
          </IconButton>
          <Typography variant="h6">{commentsCount}</Typography>
        </Box>
      </CardActions>
    </Card>
  );
};
export default PostCard;
