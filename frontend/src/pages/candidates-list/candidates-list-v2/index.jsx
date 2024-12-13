

import CandidatesList from "@/components/candidates-listing-pages/candidates-list-v2";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: 'Candidates List V2 || TeacherLink - Job Board for Teachers',
  description:
    'TeacherLink - Job Board for Teachers',
  
}


const CandidateListPage2 = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
     
      <CandidatesList />
    </>
  );
};

export default CandidateListPage2
