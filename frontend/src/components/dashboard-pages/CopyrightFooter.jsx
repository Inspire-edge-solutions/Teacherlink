const CopyrightFooter = () => {
  return (
    <div className="copyright-text">
      <p>
        © {new Date().getFullYear()} TeacherLink by{" "}
        <a
          href="https://themeforest.net/user/Inspire Edge Solutions"
          target="_blank"
          rel="noopener noreferrer"
        >
          Inspire Edge Solutions
        </a>
        . All Right Reserved.
      </p>
    </div>
  );
};

export default CopyrightFooter;
