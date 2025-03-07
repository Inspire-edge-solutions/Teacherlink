import { BsFileText, BsCreditCard, BsCheckCircle } from 'react-icons/bs';

const PostJobSteps = () => {
  return (
    <div className="post-job-steps">
      <div className="step">
        <span className="icon"><BsFileText /></span>
        <h5>Job Detail</h5>
      </div>

      <div className="step">
        <span className="icon"><BsCreditCard /></span>
        <h5>Package & Payments</h5>
      </div>

      <div className="step">
        <span className="icon"><BsCheckCircle /></span>
        <h5>Confirmation</h5>
      </div>
    </div>
  );
};

export default PostJobSteps;