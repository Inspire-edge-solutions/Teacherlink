import Location from "./Location";
import Category from "./Category";
import Qualifications from "./Qualifications";
import Experience from "./Experience";
import Details from "./Details";

const PostBoxForm = () => {
 

  return (
    <form className="default-form">
      <div className="row">
        
        <Category/>

        <Qualifications/>

        <Experience/>

        <Details/>

        <Location/>
        
        <div className="form-group col-lg-12 col-md-12 text-right">
          <button className="theme-btn btn-style-one">Next</button>
        </div>
      </div>
    </form>
  );
};

export default PostBoxForm;
