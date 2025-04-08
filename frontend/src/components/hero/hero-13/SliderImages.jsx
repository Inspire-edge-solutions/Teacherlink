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
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    arrows: false,
                    dots: true
                }
            }
        ]
    };

    return (
        <div className="slider-wrapper">
            <Slider {...settings}>
                <div className="slide-item">
                    <img 
                        src="/images/teacherlink_images/slider3.png" 
                        alt="teacher" 
                        className="img-fluid"
                        style={{maxWidth: '100%', height: 'auto'}}
                    />
                </div>
                <div className="slide-item">
                    <img 
                        src="/images/teacherlink_images/slider4.png" 
                        alt="teacher" 
                        className="img-fluid"
                        style={{maxWidth: '100%', height: 'auto'}}
                    />
                </div>
            </Slider>
        </div>
    );
};

export default SliderImages;
