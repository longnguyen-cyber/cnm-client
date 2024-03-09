import React from 'react';
import PropTypes from 'prop-types';

import zalo1 from '../../../../../image/zalo1.jpg';
import zalo2 from '../../../../../image/zalo2.png';
import zalo3 from '../../../../../image/zalo3.png';
import zalo4 from '../../../../../image/zalo4.jpg';

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Autoplay } from "swiper";
import './Homepage.css'
Banner.propTypes = {

};

function Banner() {
  const dataSlider = [
    {
      imgNike: zalo1,
      name: 'Nhắn tin nhiều hơn soạn thảo ít hơn',
      decription: 'Sử dụng các tin nhắn nhanh để lưu trữ các tin nhắn thường dùng và gửi nhanh trong hội thoại bất kỳ ',
    },
    {
      imgNike: zalo2,
      name: 'Nhắn tin nhiều hơn soạn thảo ít hơn',
      decription: 'Sử dụng các tin nhắn nhanh để lưu trữ các tin nhắn thường dùng và gửi nhanh trong hội thoại bất kỳ ',
    },
    {
      imgNike: zalo3,
      name: 'Nhắn tin nhiều hơn soạn thảo ít hơn',
      decription: 'Sử dụng các tin nhắn nhanh để lưu trữ các tin nhắn thường dùng và gửi nhanh trong hội thoại bất kỳ ',
    },
    {
      imgNike: zalo4,
      name: 'Nhắn tin nhiều hơn soạn thảo ít hơn',
      decription: 'Sử dụng các tin nhắn nhanh để lưu trữ các tin nhắn thường dùng và gửi nhanh trong hội thoại bất kỳ ',
    },
  ];


  return (
    <div className='MainPageHomeRecomend  '>
      <div className='text-center flex flex-col gap-5 mb-5'>
        <p className='text-4xl'>
          Chào mừng đến với nền tảng  <b>WorkChat !</b>{' '}
        </p>
        <p>
          khám phá những tiện ích hỗ trợ làm việc và trò chuyện cũng <br /> người thân và bạn bẻ được tối ưu hóa cho máy
          tính của bạn{' '}
        </p>
      </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false
        }}
        className="mySwiper"
      >

        {dataSlider && dataSlider.map((imgSlider, index) => (

          <SwiperSlide className='SwiperSlideContent' key={index}><img src={imgSlider.imgNike} /></SwiperSlide>
        ))}
      </Swiper>



    </div>


  );
}

export default Banner;