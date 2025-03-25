
import MyProfile from "@/components/dashboard-pages/candidates-dashboard/my-profile";
import MetaComponent from "@/components/common/MetaComponent";
import { Outlet } from "react-router-dom";

const metadata = {
  title: "My Profile || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const MyProfilePage = () => {
  return (
    <>
      <MetaComponent meta={metadata} />
      <MyProfile />
      <Outlet />
    </>
  );
};

export default MyProfilePage;
