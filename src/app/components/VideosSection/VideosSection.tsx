import { Video } from "@/types/homepage";
import React, { FC } from "react";
import styles from "./VideosSection.module.scss";
import SliderMain from "../SliderMain/SliderMain";
import VideoSlide from "../VideoSlide/VideoSlide";

type Props = {
  videosTitle: string;
  videos: Video[];
  /** Заголовок блока: по умолчанию абзац, как было на главной и в статьях */
  titleTag?: "p" | "h2";
  /** Якорь секции. На странице их может быть два — одинаковый id ломает ссылки */
  sectionId?: string;
};

const VideosSection: FC<Props> = ({
  videosTitle,
  videos,
  titleTag = "p",
  sectionId = "videos"
}) => {
  const Title = titleTag;

  return (
    <section className={styles.videosSection} id={sectionId}>
      <div className="container">
        <Title className={styles.videosSectionTitle}>{videosTitle}</Title>
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
