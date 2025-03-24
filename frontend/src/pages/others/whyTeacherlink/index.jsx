

import WhyTeacherlink from "@/components/pages-menu/whyTeacherlink";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: 'Why TeacherLink || TeacherLink - Job Board for Teachers',
  description:
    'TeacherLink - Job Board for Teachers',
  
}

const WhyTeacherlinkPage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      
      <WhyTeacherlink />
    </>
  );
};

export default WhyTeacherlinkPage
