interface Auth {
  username?: string;
  email?: string;
  password: string;
}

interface AuthState {
  userInfo: UserInfo | null;
}

interface UserInfo {
  _id?: string;
  username?: string;
  email?: string;
  roles?: "User" | "Admin";
}
