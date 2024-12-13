
import ShortlistedResumes from "@/components/dashboard-pages/employers-dashboard/shortlisted-resumes";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Shortlisted Resumes || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const ShortListedResumeEmploeeDBPage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <ShortlistedResumes />
    </>
  );
};

export default ShortListedResumeEmploeeDBPage
