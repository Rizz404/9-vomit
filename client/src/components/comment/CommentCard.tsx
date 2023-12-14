import { useVoteCommentMutation } from "../../redux/api/commentApiSlices";
import { useGetUserProfileQuery } from "../../redux/api/userApiSlices";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import AddComment from "./AddComment";
import { ImArrowUp, ImArrowDown, ImReply } from "react-icons/im";
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

interface CommentCardProps {
  comment: Comment;
}

const CommentCard = ({ comment }: CommentCardProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showCreateReply, setShowCreateReply] = useState(false);
  const { data: userProfile } = useGetUserProfileQuery();
  const paramsAfterCategory = location.pathname.split("/")[2];
  const [vote] = useVoteCommentMutation();
  const {
    _id: commentId,
    userId: author,
    postId,
    content,
    repliesCount,
    image,
    upvotes,
    downvotes,
    createdAt,
  } = comment;

  const buttonVariant = (type: "upvote" | "downvote", userId: string) => {
    if (type === "upvote") {
      return upvotes?.userId.includes(userId) ? "fs-4 text-success" : "fs-4 text-secondary";
    } else if (type === "downvote") {
      return downvotes?.userId.includes(userId) ? "fs-4 text-danger" : "fs-4 text-secondary";
    } else {
      return "fs-4 text-secondary";
    }
  };

  return (
    comment && (
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
            title={author.username}
            subheader={createdAt}
          />
        )}
        {image && (
          <CardMedia
            sx={{ maxWidth: "500px", mx: "auto" }}
            component="img"
            image={`http://localhost:5000/assets/images/${image}`}
          />
        )}
        <CardContent>
          <Typography variant="body2">{content}</Typography>
        </CardContent>
        <CardActions>
          <Box component="div" display="flex" justifyContent="space-between" alignItems="center">
            <IconButton onClick={() => vote({ action: "upvote", commentId })}>
              <ImArrowUp />
            </IconButton>
            <Typography variant="h6">{upvotes?.count}</Typography>
          </Box>

          <Box component="div" display="flex" justifyContent="space-between" alignItems="center">
            <IconButton onClick={() => vote({ action: "downvote", commentId })}>
              <ImArrowDown />
            </IconButton>
            <Typography variant="h6">{downvotes?.count}</Typography>
          </Box>
          <Box component="div" display="flex" justifyContent="space-between" alignItems="center">
            <IconButton
              onClick={() =>
                commentId !== paramsAfterCategory && navigate(`/comment/replies/${commentId}`)
              }>
              <ImReply />
            </IconButton>
            <Typography variant="h6">{repliesCount}</Typography>
          </Box>
        </CardActions>
      </Card>
    )
  );
};
export default CommentCard;
