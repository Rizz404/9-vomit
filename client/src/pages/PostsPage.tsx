import PostCard from "../components/post/PostCard";
import { useGetPostsByCategoryQuery, useSearchPostsByTitleQuery } from "../redux/api/postApiSlices";
import { NavLink, useParams, useSearchParams } from "react-router-dom";
import FeaturedTag from "../components/tag/FeaturedTag";
import SideBar from "../components/SideBar";
import Advertisement from "../components/Advertisement";
import { Box, Container, Divider, Grid } from "@mui/material";

const PostsPage = () => {
  const { category: categoryParams, userId } = useParams();
  const category = () => {
    switch (categoryParams) {
      case "home":
        return "home";
      case "top":
        return "top";
      case "trending":
        return "trending";
      case "fresh":
        return "fresh";
      case "self":
        return "self";
      case "user":
        return "user";

      default:
        return "home";
    }
  };
  const postCategory = category();
  const {
    data: posts,
    isLoading,
    isError,
  } = useGetPostsByCategoryQuery({ category: postCategory, userId });

  const [searchParams] = useSearchParams();
  const title = searchParams.get("title");
  const {
    data: filteredPosts,
    isLoading: isLoadingFilteredPost,
    isError: isErrorFilteredPost,
  } = useSearchPostsByTitleQuery(title || "");

  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>Error</h1>;
  if (isLoadingFilteredPost) return <h1>Loading</h1>;
  if (isErrorFilteredPost) return <h1>Error</h1>;

  return (
    <Container component="section" maxWidth="xl">
      <Grid container spacing={2}>
        {/* dari layar ukuran 0 sampai dengan 899 itu none dan di 900 baru tampil */}
        <Grid item lg={2} md={4} sx={{ display: { xs: "none", md: "block" } }}>
          {/* <SideBar /> */}
        </Grid>
        <Grid item lg={7} md={8}>
          <Box display="flex" alignItems="center" gap={5} py={2} px={1}>
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/top">Top</NavLink>
            <NavLink to="/trending">trending</NavLink>
            <NavLink to="/fresh">Fresh</NavLink>
            <NavLink to="/forum">Forum</NavLink>
          </Box>
          <Divider />
          {postCategory !== "self" && <FeaturedTag />}
          {title ? (
            <>
              {filteredPosts?.length === 0 && <h1>No post found with title {title}</h1>}
              {filteredPosts?.map((post, index) => (
                <PostCard key={index} post={post} />
              ))}
            </>
          ) : (
            <>
              {posts?.length === 0 && <h1>No post found</h1>}
              {posts?.map((post, index) => (
                <PostCard key={index} post={post} />
              ))}
            </>
          )}
        </Grid>
        {/* dari layar ukuran 0 sampai dengan 1199 itu none dan di 2000 baru tampil */}
        <Grid item lg={3} sx={{ display: { xs: "none", lg: "block" } }}>
          <Advertisement />
        </Grid>
      </Grid>
    </Container>
  );
};
export default PostsPage;
