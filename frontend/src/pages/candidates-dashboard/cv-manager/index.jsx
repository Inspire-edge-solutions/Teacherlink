
import CvManager from "@/components/dashboard-pages/candidates-dashboard/cv-manager";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "CV Manager || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const CVMannagerPage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <CvManager />
    </>
  );
};

export default CVMannagerPage
