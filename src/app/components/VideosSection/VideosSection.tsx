import { Video } from "@/types/homepage";
import React, { FC } from "react";
import styles from "./VideosSection.module.scss";
import SliderMain from "../SliderMain/SliderMain";
import VideoSlide from "../VideoSlide/VideoSlide";

type Props = {
  videosTitle: string;
  videos: Video[];
};

const VideosSection: FC<Props> = ({ videosTitle, videos }) => {
  return (
    <section className={styles.videosSection} id="videos">
      <div className="container">
        <p className={styles.videosSectionTitle}>{videosTitle}</p>
        <SliderMain className={styles.videosSlider}>
          {videos.map((video, index) => (
            <VideoSlide
              key={video._key ?? index}
              videoId={video.videoId}
              posterImage={video.posterImage}
              date={video.date}
              title={video.title}
            />
          ))}
        </SliderMain>
      </div>
    </section>
  );
};

export default VideosSection;
