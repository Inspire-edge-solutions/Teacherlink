
import Messaging from "@/components/dashboard-pages/candidates-dashboard/messaging";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Messages || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const MessagingPage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <Messaging />
    </>
  );
};

export default MessagingPage
