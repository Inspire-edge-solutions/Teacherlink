
import RecruiterActions from "@/components/dashboard-pages/candidates-dashboard/recruiter-actions";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Recruiter Actions || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const RecruiterActionsPage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <RecruiterActions />
    </>
  );
};

export default RecruiterActionsPage
