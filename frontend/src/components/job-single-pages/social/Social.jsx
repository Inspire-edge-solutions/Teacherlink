import { getIcon } from "../../../utils/iconMapping";

const Social = () => {
  const socialContent = [
    { id: 1, icon: "icon-facebook", link: "https://www.facebook.com/" },
    { id: 2, icon: "icon-twitter", link: "https://www.twitter.com/" },
    { id: 3, icon: "icon-instagram", link: "https://www.instagram.com/" },
    { id: 4, icon: "icon-linkedin", link: "https://www.linkedin.com/" },
  ];
  
  return (
    <div className="social-links">
      {socialContent.map((item) => (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          key={item.id}
        >
          {getIcon(item.icon)}
        </a>
      ))}
    </div>
  );
};

export default Social;
