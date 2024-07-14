"use client";
import styles from "./SliderMain.module.scss";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";

const SliderMain = ({ children }: any) => {
  return (
    <div className={styles.sliderMain}>
      <div className={styles.sliderSlides}>
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={15}
          slidesPerView={1.5}
          navigation={{
            nextEl: ".swiper-main-next",
            prevEl: ".swiper-main-prev"
          }}
          pagination={{
            clickable: true,
            el: ".swiper-pagination"
          }}
          breakpoints={{
            640: { slidesPerView: 1.5, spaceBetween: 20 },
            768: { slidesPerView: 2.5, spaceBetween: 30 },
            980: { slidesPerView: 3, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 30 }
          }}
        >
          {children.map((child: any, index: number) => (
            <SwiperSlide key={index}>{child}</SwiperSlide>
          ))}
        </Swiper>
      </div>
      <div className={styles.sliderButtons}>
        <div className={styles.navigation}>
          <button
            className={`swiper-main-prev ${styles.swiperMainPrev} ${styles.swiperButton}`}
          >
            <FaArrowLeftLong
              fontSize="1.8em"
              className={`${styles.arrow} ${styles.arrowLeft}`}
            />
          </button>
          <button
            className={`swiper-main-next ${styles.swiperMainNext} ${styles.swiperButton}`}
          >
            <FaArrowRightLong
              fontSize="1.8em"
              className={`${styles.arrow} ${styles.arrowRight}`}
            />
          </button>
        </div>
        <div className={styles.pagination}>
          <div className="swiper-pagination">
            <span className="swiper-pagination-bullet"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SliderMain;
