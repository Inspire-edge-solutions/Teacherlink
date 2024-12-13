
import Seo from "../../../components/common/Seo";
import AllApplicants from "../../../components/dashboard-pages/employers-dashboard/all-applicants";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: 'All Applicants || TeacherLink - Job Board for Teachers',
  description:
    'TeacherLink - Job Board for Teachers',
  
}



const AllApplicantsCandidatesPage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />

      <AllApplicants />
    </>
  );
};

export default AllApplicantsCandidatesPage
