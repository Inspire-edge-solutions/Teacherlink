import React from "react";

import Home from "@/components/home-13";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home-13 || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const HomePage13 = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <Home />
    </>
  );
};

export default HomePage13;
