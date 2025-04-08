const ImgBox = () => {
  // const imgContent = [
  //   {
  //     id: 1,
  //     block: [{ img: "About-us-image" }],
  //   },
    // {
    //   id: 2,
    //   block: [{ img: "about-img-2" }, { img: "about-img-3" }],
    // },
    // {
    //   id: 3,
    //   block: [{ img: "about-img-4" }, { img: "about-img-5" }],
    // },
    // {
    //   id: 4,
    //   block: [{ img: "about-img-6" }],
    // },
  //];

//   return (
//     <div className="images-box">
//       <div className="row">
//         {imgContent.map((item) => (
//           <div className="column col-lg-3 col-md-6 col-sm-6" key={item.id}>
//             {item.block.map((itemImg, i) => (
//               <figure className="image" key={i}>
//                 <img
//                   src={`/images/teacherlink_images/${itemImg.img}.png`}
//                   alt="about image"
                  
//                 />
//               </figure>
//             ))}
//           </div>
//         ))}
//         {/* End .col */}
//       </div>
//     </div>
//   );
// };

return (
    <div className="img-box-container p-3 p-md-4">
      <figure className="image mb-0">
        <img 
          src="/images/teacherlink_images/About-us-image.png" 
          alt="about image" 
          className="img-fluid rounded shadow-sm"
          style={{maxWidth: '100%', height: 'auto'}}
        />
      </figure>
    </div>
);

}

export default ImgBox;
