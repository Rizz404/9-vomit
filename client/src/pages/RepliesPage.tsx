import { useParams } from "react-router-dom";
import CommentCard from "../components/comment/CommentCard";
import { useGetCommentQuery, useGetRepliesQuery } from "../redux/api/commentApiSlices";
import AddComment from "../components/comment/AddComment";
import { Grid } from "@mui/material";

const RepliesPage = () => {
  const { commentId } = useParams();
  const { data: comment, isLoading, isError } = useGetCommentQuery(commentId || "");
  const {
    data: replies,
    isLoading: isLoadingReplies,
    isError: isErrorReplies,
  } = useGetRepliesQuery(commentId || "");

  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>Error</h1>;
  if (isLoadingReplies) return <h1>Loading</h1>;
  if (isErrorReplies) return <h1>Error</h1>;

  return (
    comment && (
      <Grid container justifyContent="center" spacing={2}>
        <Grid item md={7}>
          <CommentCard comment={comment} />
          <AddComment postId={comment._id || ""} commentId={commentId} />
          <hr />
          {replies && replies?.map((reply, index) => <CommentCard key={index} comment={reply} />)}
        </Grid>
      </Grid>
    )
  );
};
export default RepliesPage;
