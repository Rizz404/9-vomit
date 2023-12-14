import apiSlices from "../apiSlices";

const formData = new FormData();
const commentApiSlices = apiSlices.injectEndpoints({
  endpoints: (builder) => ({
    // * POST
    createComment: builder.mutation<Comment, Comment>({
      query: ({ postId, _id, content, image }) => {
        if (content) formData.append("content", content);
        // ! image aja ya bukan image.name
        // ! karena sudah dihandle multer
        if (image) formData.append("image", image);

        return {
          url: `/comments/create/${postId}/${_id ? _id : ""}`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, arg) => [
        { type: "Comment" },
        { type: "Post", id: arg._id },
      ],
    }),

    // * GET
    getPostComments: builder.query<Comment[], string>({
      query: (postId) => ({ url: `/comments/post/${postId}` }),
      providesTags: (result) => {
        return result
          ? [
              ...result.map(({ _id }) => ({ type: "Comment" as const, id: _id })),
              { type: "Comment", id: "LIST" },
            ]
          : [{ type: "Comment", id: "LIST" }];
      },
    }),
    getComment: builder.query<Comment, string>({
      query: (commentId) => ({ url: `/comments/${commentId}` }),
      providesTags: (_result, _error, arg) => [{ type: "Comment", id: arg }],
    }),
    getReplies: builder.query<Comment[], string>({
      query: (postId) => ({ url: `/comments/replies/${postId}` }),
      providesTags: (result) => {
        return result
          ? [
              ...result.map(({ _id }) => ({ type: "Comment" as const, id: _id })),
              { type: "Comment", id: "LIST" },
            ]
          : [{ type: "Comment", id: "LIST" }];
      },
    }),

    // * PATCH
    updateComment: builder.mutation<Comment, Comment>({
      query: ({ content, image, _id: commentId }) => {
        formData.append("content", content);
        image && formData.append("image", image);

        return {
          url: `/comments/${commentId}`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: (_result, _error, arg) => [{ type: "Comment", id: arg._id }],
    }),
    voteComment: builder.mutation<void, VoteCommentPayload>({
      query: ({ action, commentId }) => ({
        url: `/comments/${action}/${commentId}`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Comment", id: arg._id }],
    }),

    // * DELETE
    deleteComment: builder.mutation<void, VoteCommentPayload>({
      query: (commentId) => ({ url: `/comments/${commentId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Comment", id: arg._id }],
    }),
  }),
});

export const {
  useCreateCommentMutation,
  useGetPostCommentsQuery,
  useGetCommentQuery,
  useGetRepliesQuery,
  useUpdateCommentMutation,
  useVoteCommentMutation,
  useDeleteCommentMutation,
} = commentApiSlices;
