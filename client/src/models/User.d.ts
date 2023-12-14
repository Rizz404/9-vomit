interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
  roles?: "User" | "Admin";
  fullname?: string;
  bio?: string;
  profilePict?: string;
  following?: string[];
  createdAt?: string;
  updatedAt?: string;
}

interface SearchPayloadCategory {
  by: "username" | "email";
  query: string;
}
