import Social from "./Social";

const CopyrightFooter = () => {
  return (
    <div className="footer-bottom">
      <div className="auto-container">
        <div className="outer-box">
          <div className="copyright-text">
            © {new Date().getFullYear()} TeacherLink by{" "}
            <a
              href="https://themeforest.net/user/Inspire Edge Solutions"
              target="_blank"
              rel="noopener noreferrer"
            >
              Inspire edge solutions
            </a>
            . All Right Reserved.
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
