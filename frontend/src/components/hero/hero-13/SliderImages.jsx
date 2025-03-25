import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const SliderImages = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    return (
        <Slider {...settings}>
            <div>
                <img src="/images/teacherlink_images/slider3.png" alt="teacher" />
            </div>
            <div>
                <img src="/images/teacherlink_images/slider4.png" alt="teacher" />
            </div>
            
        </Slider>
    );
};

export default SliderImages;
