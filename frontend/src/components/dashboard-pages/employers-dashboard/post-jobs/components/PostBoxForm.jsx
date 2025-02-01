
import Category from "./Category";


const PostBoxForm = () => {
 

  return (
    <form className="default-form">
      <div className="row">
        
        <Category/>

      </div>
      <div className="form-group col-lg-12 col-md-12 text-right">
        <button className="theme-btn btn-style-one">Post Job</button>
      </div>
    </form>
  );
};

export default PostBoxForm;
