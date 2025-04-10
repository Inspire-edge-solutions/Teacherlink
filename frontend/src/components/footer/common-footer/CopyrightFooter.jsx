import Social from "./Social";

const CopyrightFooter = () => {
  return (
    <div className="footer-bottom">
      <div className="auto-container">
        <div className="outer-box">
          <div className="copyright-text">
            © {new Date().getFullYear()} TeacherLink by{" "}
            <a
              href="https://inspireedgesolutions.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Inspire Edge Innovation
            </a>
            . All Rights Reserved.
          </div>
          <div className="social-links">
            <Social />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CopyrightFooter;
