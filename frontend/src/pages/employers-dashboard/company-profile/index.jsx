
import CompanyProfile from "@/components/dashboard-pages/employers-dashboard/company-profile";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Company Profile || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const CompanyProfileEmploeeDBPage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <CompanyProfile />
    </>
  );
};

export default CompanyProfileEmploeeDBPage
