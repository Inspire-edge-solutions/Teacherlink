
import Meetings from "@/components/dashboard-pages/candidates-dashboard/meetings";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Meetings || TeacherLink - Job Board for Teachers",
  description: "TeacherLink - Job Board for Teachers",
};

const MeetingsPage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      <Meetings />
    </>
  );
};

export default MeetingsPage
