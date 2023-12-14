import { ImArrowDown, ImArrowUp } from "react-icons/im";
import { useVoteCommentMutation } from "../redux/api/commentApiSlices";
import { useVotePostMutation } from "../redux/api/postApiSlices";

interface VotesSectionProps {
  upvotes: { userId: string; count: number };
  downvotes: { userId: string; count: number };
  userId: string;
  postId: string;
  commentId: string;
  typeVotes: "post" | "comment";
}

const VotesSection = ({
  upvotes,
  downvotes,
  userId,
  postId,
  commentId,
  typeVotes,
}: VotesSectionProps) => {
  const [votePost] = useVotePostMutation();
  const [voteComment] = useVoteCommentMutation();

  const buttonVariant = (type: "upvote" | "downvote", userId: string) => {
    if (type === "upvote") {
      return upvotes?.userId.includes(userId) ? "fs-4 text-success" : "fs-4 text-secondary";
    } else if (type === "downvote") {
      return downvotes?.userId.includes(userId) ? "fs-4 text-danger" : "fs-4 text-secondary";
    } else {
      return "fs-4 text-secondary";
    }
  };

  let content;

  if (typeVotes === "post") {
    content = (
      <>
        <div className="d-flex justify-content-between align-items-center gap-1">
          <ImArrowUp
            style={{ cursor: "pointer" }}
            className={buttonVariant("upvote", userId)}
            onClick={() => votePost({ action: "upvote", postId })}
          />
          <span className="fs-5 fw-semibold">{upvotes?.count}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center gap-1">
          <ImArrowDown
            style={{ cursor: "pointer" }}
            className={buttonVariant("downvote", userId)}
            onClick={() => votePost({ action: "downvote", postId })}
          />
          <span className="fs-5 fw-semibold">{downvotes?.count}</span>
        </div>
      </>
    );
  } else if (typeVotes === "comment") {
    content = (
      <>
        <div className="d-flex justify-content-between align-items-center gap-1">
          <ImArrowUp
            style={{ cursor: "pointer" }}
            className={buttonVariant("upvote", userId)}
            onClick={() => voteComment({ action: "upvote", commentId })}
          />
          <span className="fs-5 fw-semibold">{upvotes?.count}</span>
        </div>
        <div className="d-flex justify-content-between align-items-center gap-1">
          <ImArrowDown
            style={{ cursor: "pointer" }}
            className={buttonVariant("downvote", userId)}
            onClick={() => voteComment({ action: "downvote", commentId })}
          />
          <span className="fs-5 fw-semibold">{downvotes?.count}</span>
        </div>
      </>
    );
  } else {
    throw new Error("wrong");
  }

  return content;
};
export default VotesSection;
