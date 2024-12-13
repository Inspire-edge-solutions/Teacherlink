
import ShortListedJobs from "@/components/dashboard-pages/candidates-dashboard/short-listed-jobs";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Short ListedJobs || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const ShortListedJobsPage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <ShortListedJobs />
    </>
  );
};

export default ShortListedJobsPage
