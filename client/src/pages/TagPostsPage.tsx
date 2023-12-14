import { useParams } from "react-router-dom";
import { useGetPostsByTagQuery } from "../redux/api/tagApiSlices";
import PostCard from "../components/post/PostCard";
import { Grid } from "@mui/material";

const TagPostsPage = () => {
  const { name } = useParams();
  const { data: posts, isLoading, isError } = useGetPostsByTagQuery(name || "");

  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>Error</h1>;

  return (
    <Grid container>
      {posts?.map((post, i) => (
        <Grid item md={8} key={i}>
          <PostCard post={post} />
        </Grid>
      ))}
    </Grid>
  );
};
export default TagPostsPage;
