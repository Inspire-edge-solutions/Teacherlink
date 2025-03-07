import { BsArrowLeft, BsArrowRight } from 'react-icons/bs';

const BlogPagination = () => {
  return (
    <nav className="ls-pagination">
      <ul>
        <li className="prev">
          <a href="#">
            <i className="icon"><BsArrowLeft /></i>
          </a>
        </li>
        {/* End li */}

        <li>
          <a href="#">1</a>
        </li>
        {/* End li */}

        <li>
          <a href="#" className="current-page">
            2
          </a>
        </li>
        {/* End li */}

        <li>
          <a href="#">3</a>
        </li>
        {/* End li */}

        <li className="next">
          <a href="#">
            <i className="icon"><BsArrowRight /></i>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default BlogPagination;
