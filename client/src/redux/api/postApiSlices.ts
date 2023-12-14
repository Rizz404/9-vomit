import apiSlices from "../apiSlices";

const formData = new FormData();
const postApiSlices = apiSlices.injectEndpoints({
  // * POST
  endpoints: (builder) => ({
    createPost: builder.mutation<Post, Post>({
      query: ({ title, tags, images, description }) => {
        formData.append("title", title);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        formData.append("tags", tags);
        images &&
          images.forEach((image) => {
            // ! image aja ya bukan image.name
            // ! karena sudah dihandle multer
            formData.append("images", image);
          });
        description && formData.append("description", description);

        return { url: "/posts/create", method: "POST", body: formData };
      },
      invalidatesTags: ["Post"],
    }),

    // * GET
    getPostsByCategory: builder.query<Post[], CategoryPayload>({
      query: ({ category, userId }) => ({ url: `/posts/category/${category}/${userId ?? ""}` }),
      providesTags: (result) => {
        return result
          ? [
              ...result.map(({ _id }) => ({ type: "Post" as const, id: _id })),
              { type: "Post", id: "LIST" },
            ]
          : [{ type: "Post", id: "LIST" }];
      },
    }),
    getPost: builder.query<Post, string>({
      query: (postId) => ({ url: `/posts/${postId}` }),
      providesTags: (_result, _error, arg) => [{ type: "Post", id: arg }],
    }),
    searchPostsByTitle: builder.query<Post[], string>({
      query: (title) => ({ url: `/posts/search?title=${title}` }),
    }),

    // * PATCH
    votePost: builder.mutation<void, VotePayload>({
      query: ({ action, postId }) => ({ url: `/posts/${action}/${postId}`, method: "PATCH" }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Post", id: arg._id }],
    }),

    // * DELETE
    deletePost: builder.mutation<void, DeletePayload>({
      // * Intinya sama saja memakai id dari arg dan dari params
      query: (postId) => ({ url: `/posts/delete/${postId}`, method: "DELETE" }),
      invalidatesTags: (_result, _error, arg) => [{ type: "Post", id: arg._id }],
    }),
  }),
});

export const {
  useCreatePostMutation,
  useGetPostsByCategoryQuery,
  useGetPostQuery,
  useSearchPostsByTitleQuery,
  useLazySearchPostsByTitleQuery,
  useVotePostMutation,
  useDeletePostMutation,
} = postApiSlices;
