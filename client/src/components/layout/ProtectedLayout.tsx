import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../hooks/reduxHooks";
import Header from "../Header";

const ProtectedLayout = () => {
  const { userInfo } = useAppSelector((state) => state.auth);

  return userInfo ? (
    <>
      <Header />
      <Outlet />
    </>
  ) : (
    <Navigate to="/login" replace />
  );
};

export default ProtectedLayout;
