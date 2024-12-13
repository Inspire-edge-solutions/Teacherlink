import React from "react";

import Home from "@/components/home-2";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home-2 || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const HomePage2 = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <Home />
    </>
  );
};

export default HomePage2;
