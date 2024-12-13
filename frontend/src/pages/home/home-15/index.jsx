import React from "react";

import Home from "@/components/home-15";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Home-15 || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const HomePage15 = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <Home />
    </>
  );
};

export default HomePage15;
