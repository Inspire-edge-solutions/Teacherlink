
import ForgetPassword from "@/components/common/form/forgetPassword";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Forget Password || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const ForgetPasswordPage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <ForgetPassword />
    </>
  );
};

export default ForgetPasswordPage
