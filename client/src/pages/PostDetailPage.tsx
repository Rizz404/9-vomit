import { useGetPostQuery } from "../redux/api/postApiSlices";
import { useParams } from "react-router-dom";
import PostCard from "../components/post/PostCard";
import PostComments from "../components/post/PostComments";
import AddComment from "../components/comment/AddComment";
import { Container, Grid } from "@mui/material";

const PostDetailPage = () => {
  const { postId } = useParams();
  const { data: post, isLoading, isError } = useGetPostQuery(postId || "");

  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>Error</h1>;

  return (
    post && (
      <Container component="main">
        <Grid container>
          <Grid item md={2}>
            sidebar
          </Grid>
          <Grid item md={8}>
            <PostCard post={post} />
            <AddComment postId={post._id || ""} />
            <PostComments postId={post._id || ""} />
          </Grid>
        </Grid>
      </Container>
    )
  );
};
export default PostDetailPage;
