import React from 'react';
import SalientFeatures from "../../../components/pages-menu/salientFeatures";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: 'Salient Features || TeacherLink - Job Board for Teachers',
  description: 'TeacherLink - Job Board for Teachers',
}

const SalientFeaturesPage = () => {
  console.log("SalientFeaturesPage rendering");
  return (
    <>
      <MetaComponent meta={metadata} />
      <SalientFeatures />
    </>
  );
};

export default SalientFeaturesPage;
