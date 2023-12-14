import { Box, Button } from "@mui/material";
import { useGetTagsQuery } from "../../redux/api/tagApiSlices";
import { useNavigate } from "react-router-dom";

const FeaturedTag = () => {
  const navigate = useNavigate();
  const { data: tags, isLoading, isError } = useGetTagsQuery({ category: "featured-tag" });

  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>Error</h1>;

  return (
    <Box display="flex" flexWrap="wrap" alignItems="center" gap={1} py={1}>
      {tags?.map((tag, i) => (
        <Button
          key={i}
          size="small"
          variant="outlined"
          onClick={() => navigate(`/tag/${tag.name}`)}>
          {tag.name}
        </Button>
      ))}
    </Box>
  );
};
export default FeaturedTag;
