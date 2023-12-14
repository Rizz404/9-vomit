import { useGetPostCommentsQuery } from "../../redux/api/commentApiSlices";
import CommentCard from "../comment/CommentCard";

interface PostCommentsProps {
  postId: string;
}

const PostComments = ({ postId }: PostCommentsProps) => {
  const { data: comments, isLoading, isError } = useGetPostCommentsQuery(postId);

  if (isLoading) return <h1>Loading</h1>;
  if (isError) return <h1>Error</h1>;

  return (
    <>
      {comments?.length === 0 && <h1>No comment</h1>}
      {comments?.map((comment, index) => (
        <CommentCard key={index} comment={comment} />
      ))}
    </>
  );
};
export default PostComments;
