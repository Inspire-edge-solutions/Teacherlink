
import ResumeAlerts from "@/components/dashboard-pages/employers-dashboard/resume-alerts";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Resume Alerts || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const ResumeAlertsEmploeeDBPage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <ResumeAlerts />
    </>
  );
};

export default ResumeAlertsEmploeeDBPage
