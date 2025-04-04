
import AllJobs from "@/components/dashboard-pages/candidates-dashboard/all-jobs";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "All Jobs || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const AllJobPage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <AllJobs />
    </>
  );
};

export default AllJobPage
