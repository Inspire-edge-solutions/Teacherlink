
import JobAlerts from "@/components/dashboard-pages/candidates-dashboard/job-alerts";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "My Job Alerts || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const JobAlertPage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <JobAlerts />
    </>
  );
};

export default JobAlertPage
