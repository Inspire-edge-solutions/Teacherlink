

const Address = () => {
  const addressContent = [
    {
      id: 1,
      iconName: "placeholder",
      title: "Address",
      text: (
        <>
          13/2 Standage Road,
          <br /> Pulikeshi Nagar, Bengaluru, Karnataka, India 560005
        </>
      ),
    },
    {
      id: 2,
      iconName: "smartphone",
      title: "Call Us",
      text: (
        <>
          <a href="tel:+919606889003" className="phone">
            +91 9606889003
          </a>
        </>
      ),
    },
    {
      id: 3,
      iconName: "letter",
      title: "Email",
      text: (
        <>
          {" "}
          <a href="mailto:admin@inspireedgesolutions.com">Inspire Edge Innovation</a>
        </>
      ),
    },
  ];
  return (
    <>
      {addressContent.map((item) => (
        <div
          className="contact-block col-lg-4 col-md-6 col-sm-12"
          key={item.id}
        >
          <div className="inner-box">
            <span className="icon">
              <img
               
                src={`/images/icons/${item.iconName}.svg`}
                alt="icon"
              />
            </span>
            <h4>{item.title}</h4>
            <p>{item.text}</p>
          </div>
        </div>
      ))}
    </>
  );
};

export default Address;
