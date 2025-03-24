

import Subscription from "@/components/pages-menu/subscription";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: 'Subscription || TeacherLink - Job Board for Teachers',
  description:
    'TeacherLink - Job Board for Teachers',
  
}

const SubscriptionPage = () => {
  return (
    <>
    <MetaComponent meta={metadata} />
      
      <Subscription />
    </>
  );
};

export default SubscriptionPage
