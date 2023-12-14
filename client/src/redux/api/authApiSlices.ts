import apiSlices from "../apiSlices";

const authApiSlices = apiSlices.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<UserInfo, Auth>({
      query: (data) => ({ url: "/auth/register", method: "POST", body: data }),
      invalidatesTags: ["User", "Post", "Comment", "Tag"],
    }),
    login: builder.mutation<UserInfo, Auth>({
      query: (data) => ({ url: "/auth/login", method: "POST", body: data }),
      invalidatesTags: ["User", "Post", "Comment", "Tag"],
    }),
    logout: builder.mutation<void, void>({
      query: (data) => ({ url: "/auth/logout", method: "POST", body: data }),
      invalidatesTags: ["User", "Post", "Comment", "Tag"],
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } = authApiSlices;
