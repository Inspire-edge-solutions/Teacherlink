
import MyResume from "@/components/dashboard-pages/candidates-dashboard/my-resume";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "My Resume || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const MyResumePage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <MyResume />
    </>
  );
};

export default MyResumePage
