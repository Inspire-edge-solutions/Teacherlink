import { BsFacebook, BsTwitter, BsInstagram, BsLinkedin } from "react-icons/bs";

const Social = () => {
  const socialContent = [
    { id: 1, icon: <BsFacebook />, link: "https://www.facebook.com/" },
    { id: 2, icon: <BsTwitter />, link: "https://www.twitter.com/" },
    { id: 3, icon: <BsInstagram />, link: "https://www.instagram.com/" },
    { id: 4, icon: <BsLinkedin />, link: "https://www.linkedin.com/" },
  ];
  return (
    <>
      {socialContent.map((item) => (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          key={item.id}
        >
            {item.icon}
        </a>
      ))}
    </>
  );
};

export default Social;
