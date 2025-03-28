
import MyAccount from "@/components/dashboard-pages/candidates-dashboard/my-account";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "CV Manager || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const MyAccountPage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <MyAccount />
    </>
  );
};

export default MyAccountPage
