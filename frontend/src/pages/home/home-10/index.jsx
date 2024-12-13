import React from "react";

import Home from "@/components/home-10";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home-10 || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const HomePage10 = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <Home />
    </>
  );
};

export default HomePage10;
