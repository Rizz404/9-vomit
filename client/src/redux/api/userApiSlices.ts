import apiSlices from "../apiSlices";

const formData = new FormData();
const userApiSlices = apiSlices.injectEndpoints({
  endpoints: (builder) => ({
    // * Default dari query sudah get jadi tidak perlu didefinisikan lagi
    // ! jangan bingung soal generics, parameter pertama itu responsenya, yang kedua adalah type paramnya
    // * Bisa pakai underscore untuk params yang tidak terpakai tapi masih penting

    // * GET
    getUserProfile: builder.query<User, void>({
      query: () => ({ url: "users/profile" }),
      providesTags: [{ type: "User", id: "PROFILE" }],
    }),
    getUser: builder.query<User, string>({
      query: (userId) => ({ url: `users/${userId}` }),
      providesTags: (_result, _error, arg) => [{ type: "User", id: arg }],
    }),
    getUserFriends: builder.query<User[], void>({
      query: () => ({ url: "/users/friends" }),
      providesTags: ["User"],
    }),
    searchAllUser: builder.query<User[], SearchPayloadCategory>({
      query: ({ by, query }) => ({ url: `/users/search-all-user?${by}=${query}` }),
    }),
    searchUser: builder.query<User, SearchPayloadCategory>({
      query: ({ by, query }) => ({ url: `/users/search-user?${by}=${query}` }),
    }),

    // * PATCH
    updateUserProfile: builder.mutation<User, Partial<User>>({
      query: ({ username, email, fullname, profilePict }) => {
        if (username) formData.append("username", username);
        if (email) formData.append("email", email);
        if (fullname) formData.append("fullname", fullname);
        if (profilePict) formData.append("profilePict", profilePict);

        return {
          url: "/users/profile",
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: [{ type: "User", id: "PROFILE" }],
    }),
    addFriend: builder.mutation<void, string>({
      query: (friendId) => ({ url: `users/friends/${friendId}`, method: "PATCH" }),
      invalidatesTags: [{ type: "User", id: "PROFILE" }],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useGetUserQuery,
  useSearchAllUserQuery,
  useSearchUserQuery,
  useLazySearchAllUserQuery,
  useLazySearchUserQuery,
  useGetUserFriendsQuery,
  useUpdateUserProfileMutation,
  useAddFriendMutation,
} = userApiSlices;
