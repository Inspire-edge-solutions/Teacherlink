

import CandidatesList from "@/components/candidates-listing-pages/candidates-list-v1";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: 'Candidates List V1 || TeacherLink - Job Board for Teachers',
  description:
    'TeacherLink - Job Board for Teachers',
  
}


const CandidateListPage1 = () => {
  return (
    <>
      
    <MetaComponent meta={metadata} />
      <CandidatesList />
    </>
  );
};

export default CandidateListPage1
