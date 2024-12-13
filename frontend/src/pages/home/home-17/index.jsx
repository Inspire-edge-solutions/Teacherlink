import React from "react";

import Home from "@/components/home-17";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home-17 || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const HomePage17 = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <Home />
    </>
  );
};

export default HomePage17;
