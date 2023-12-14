import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import ProtectedLayout from "./components/layout/ProtectedLayout";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import PostsPage from "./pages/PostsPage";
import ProfilePage from "./pages/ProfilePage";
import PostDetailPage from "./pages/PostDetailPage";
import TagPostsPage from "./pages/TagPostsPage";
import RepliesPage from "./pages/RepliesPage";

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/home" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* <Route path="/profile/user/:userId" element={<UserProfilePage />} /> */}
      </Route>

      <Route element={<ProtectedLayout />}>
        {/* <Route path="/profile" element={<UserAccountPage />} /> */}
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/:category/:userId?" element={<PostsPage />} />
        <Route path="/tag/:name" element={<TagPostsPage />} />
        <Route path="/post/:postId" element={<PostDetailPage />} />
        <Route path="/comment/replies/:commentId" element={<RepliesPage />} />
      </Route>
    </Routes>
  );
};
export default App;
