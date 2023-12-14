import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:5000",
  credentials: "include",
});

const apiSlices = createApi({
  reducerPath: "happiness-overload",
  baseQuery,
  tagTypes: ["User", "Post", "Comment", "Tag"],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endpoints: (_builder) => ({}),
});

export default apiSlices;
