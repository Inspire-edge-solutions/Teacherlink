import React from "react";

import Home from "@/components/home-14";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home-14 || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const HomePage14 = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <Home />
    </>
  );
};

export default HomePage14;
