"use client";
import styles from "./SliderMain.module.scss";
import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import FacultySlideLast from "../FacultySlideLast/FacultySlideLast";

const SliderMain = ({
  children,
  lastSlideTitleHighlight,
  lastSlideTitle,
  lastSlideDescription,
  form,
  slidesPerView = 4
}: any) => {
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const prevRef = useRef<HTMLButtonElement | null>(null);
  const nextRef = useRef<HTMLButtonElement | null>(null);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    const observer = new ResizeObserver(entries => {
      let maxHeight = 0;
      entries.forEach(entry => {
        if (entry.target instanceof HTMLElement) {
          const slideHeight = entry.target.offsetHeight;
          if (slideHeight > maxHeight) {
            maxHeight = slideHeight;
          }
        }
      });

      slideRefs.current.forEach(slide => {
        if (slide) {
          slide.style.height = `${maxHeight}px`;
        }
      });
    });

    slideRefs.current.forEach(slide => {
      if (slide) {
        observer.observe(slide);
      }
    });

    return () => {
      slideRefs.current.forEach(slide => {
        if (slide) {
          observer.unobserve(slide);
        }
      });
    };
  }, [children]);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.params?.navigation) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.destroy();
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <div className={styles.sliderMain}>
      <div className={styles.sliderSlides}>
        <Swiper
          modules={[Pagination, Navigation]}
          spaceBetween={20}
          slidesPerView={1.5}
          onSwiper={swiper => (swiperRef.current = swiper)}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current
          }}
          pagination={{
            clickable: true,
            // Если пагинация оформляется через CSS-модуль, можно аналогично передать нужный контейнер
            el: `.${styles.pagination}`
          }}
          breakpoints={{
            640: { slidesPerView: 1.5, spaceBetween: 20 },
            768: { slidesPerView: 2.5, spaceBetween: 30 },
            980: { slidesPerView: 3, spaceBetween: 30 },
            1024: { slidesPerView, spaceBetween: 30 }
          }}
        >
          {children.map((child: any, index: number) => (
            <SwiperSlide key={index}>
              <div
                ref={el => {
                  slideRefs.current[index] = el;
                }}
              >
                {child}
              </div>
            </SwiperSlide>
          ))}
          {lastSlideTitle &&
            lastSlideDescription &&
            lastSlideTitleHighlight &&
            form && (
              <SwiperSlide key="last-slide">
                <div
                  ref={el => {
                    slideRefs.current[children.length] = el;
                  }}
                >
                  <FacultySlideLast
                    lastSlideTitleHighlight={lastSlideTitleHighlight}
                    lastSlideTitle={lastSlideTitle}
                    lastSlideDescription={lastSlideDescription}
                    form={form}
                  />
                </div>
              </SwiperSlide>
            )}
        </Swiper>
      </div>
      <div className={styles.sliderButtons}>
        <div className={styles.navigation}>
          <button
            ref={prevRef}
            className={`${styles.swiperMainPrev} ${styles.swiperButton}`}
            aria-label="Previous slide"
          >
            <FaArrowLeftLong
              fontSize="1.8em"
              className={`${styles.arrow} ${styles.arrowLeft}`}
            />
          </button>
          <button
            ref={nextRef}
            className={`${styles.swiperMainNext} ${styles.swiperButton}`}
            aria-label="Next slide"
          >
            <FaArrowRightLong
              fontSize="1.8em"
              className={`${styles.arrow} ${styles.arrowRight}`}
            />
          </button>
        </div>
        <div className={styles.pagination}>
          <span className="swiper-pagination-bullet"></span>
        </div>
      </div>
    </div>
  );
};

export default SliderMain;

// old code
// "use client";
// import styles from "./SliderMain.module.scss";
// import React, { useEffect, useRef } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Navigation } from "swiper/modules";
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";
// import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
// import FacultySlideLast from "../FacultySlideLast/FacultySlideLast";

// const SliderMain = ({
//   children,
//   lastSlideTitleHighlight,
//   lastSlideTitle,
//   lastSlideDescription,
//   form,
//   slidesPerView = 4,
//   uniqueId
// }: any) => {
//   const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

//   useEffect(() => {
//     const observer = new ResizeObserver(entries => {
//       let maxHeight = 0;
//       entries.forEach(entry => {
//         if (entry.target instanceof HTMLElement) {
//           const slideHeight = entry.target.offsetHeight;
//           if (slideHeight > maxHeight) {
//             maxHeight = slideHeight;
//           }
//         }
//       });

//       slideRefs.current.forEach(slide => {
//         if (slide) {
//           slide.style.height = `${maxHeight}px`;
//         }
//       });
//     });

//     slideRefs.current.forEach(slide => {
//       if (slide) {
//         observer.observe(slide);
//       }
//     });

//     return () => {
//       slideRefs.current.forEach(slide => {
//         if (slide) {
//           observer.unobserve(slide);
//         }
//       });
//     };
//   }, [children]);

//   return (
//     <div className={styles.sliderMain}>
//       <div className={styles.sliderSlides}>
//         <Swiper
//           modules={[Pagination, Navigation]}
//           spaceBetween={15}
//           slidesPerView={1.5}
//           navigation={{
//             nextEl: `.swiper-main-next-${uniqueId}`,
//             prevEl: `.swiper-main-prev-${uniqueId}`
//           }}
//           pagination={{
//             clickable: true,
//             el: `.swiper-pagination-${uniqueId}`
//           }}
//           breakpoints={{
//             640: { slidesPerView: 1.5, spaceBetween: 20 },
//             768: { slidesPerView: 2.5, spaceBetween: 30 },
//             980: { slidesPerView: 3, spaceBetween: 30 },
//             1024: { slidesPerView, spaceBetween: 30 }
//           }}
//         >
//           {children.map((child: any, index: number) => (
//             <SwiperSlide key={index}>
//               <div
//                 ref={el => {
//                   slideRefs.current[index] = el;
//                 }}
//               >
//                 {child}
//               </div>
//             </SwiperSlide>
//           ))}
//           {lastSlideTitle &&
//             lastSlideDescription &&
//             lastSlideTitleHighlight &&
//             form && (
//               <SwiperSlide key="last-slide">
//                 <div
//                   ref={el => {
//                     slideRefs.current[children.length] = el;
//                   }}
//                 >
//                   <FacultySlideLast
//                     lastSlideTitleHighlight={lastSlideTitleHighlight}
//                     lastSlideTitle={lastSlideTitle}
//                     lastSlideDescription={lastSlideDescription}
//                     form={form}
//                   />
//                 </div>
//               </SwiperSlide>
//             )}
//         </Swiper>
//       </div>
//       <div className={styles.sliderButtons}>
//         <div className={styles.navigation}>
//           <button
//             className={`swiper-main-prev-${uniqueId} ${styles.swiperMainPrev} ${styles.swiperButton}`}
//           >
//             <FaArrowLeftLong
//               aria-label="Previous slide"
//               fontSize="1.8em"
//               className={`${styles.arrow} ${styles.arrowLeft}`}
//             />
//           </button>
//           <button
//             className={`swiper-main-next-${uniqueId} ${styles.swiperMainNext} ${styles.swiperButton}`}
//           >
//             <FaArrowRightLong
//               aria-label="Next slide"
//               fontSize="1.8em"
//               className={`${styles.arrow} ${styles.arrowRight}`}
//             />
//           </button>
//         </div>
//         <div className={styles.pagination}>
//           <div className={`swiper-pagination-${uniqueId}`}>
//             <span className="swiper-pagination-bullet"></span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SliderMain;
