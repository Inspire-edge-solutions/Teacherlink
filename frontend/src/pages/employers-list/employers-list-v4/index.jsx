
import EmployersList from "@/components/employers-listing-pages/employers-list-v4";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Employers List V4 || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const EmployerListPage4 = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <EmployersList />
    </>
  );
};

export default EmployerListPage4
