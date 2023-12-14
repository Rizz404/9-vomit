import apiSlices from "../apiSlices";

const tagApiSlices = apiSlices.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query<Tag[], TagPayload>({
      query: ({ category }) => ({ url: `/tags/category/${category}` }),
      providesTags: ["Tag"],
    }),

    getTag: builder.query<Tag, string>({
      query: (tagId) => ({ url: `/tags/tag${tagId}` }),
      providesTags: (_result, _error, arg) => [{ type: "Tag", id: arg }],
    }),
    searchTagsByName: builder.query<Tag[], string>({
      query: (name) => ({ url: `/tags/search?title=${name}` }),
      providesTags: ["Tag"],
    }),
    getPostsByTag: builder.query<Post[], string>({
      query: (name) => ({ url: `/tags/posts/${name}` }),
      providesTags: ["Tag", "Post"],
    }),
  }),
});

export const { useGetTagsQuery, useGetTagQuery, useSearchTagsByNameQuery, useGetPostsByTagQuery } =
  tagApiSlices;
