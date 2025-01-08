
import JobList from "@/components/job-listing-pages/job-list-v4";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Job List V4 || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const JobListPage4 = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <JobList />
    </>
  );
};

export default JobListPage4