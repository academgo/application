"use client";
import React, { FC, useMemo, useState, useRef, useEffect } from "react";
import styles from "./VideoSlide.module.scss";
import { Image as ImageType } from "@/types/homepage";
import Image from "next/image";
import { FaPlay, FaPause } from "react-icons/fa";
import YouTube, { YouTubePlayer } from "react-youtube";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  videoId?: string; // ✅ делаем опциональным
  posterImage: ImageType;
  date: string;
  title: string;
};

const VideoSlide: FC<Props> = ({ videoId, posterImage, date, title }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);

  const hasVideo = useMemo(() => Boolean(videoId && videoId.trim()), [videoId]);

  // ✅ если videoId пропал/пустой — гарантированно сбрасываем состояния
  useEffect(() => {
    if (!hasVideo) {
      setIsVideoLoaded(false);
      setIsVideoPlaying(false);
      setIsPlayerReady(false);
      playerRef.current = null;
    }
  }, [hasVideo]);

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    if (!hasVideo) return; // ✅ защита
    playerRef.current = event.target;
    setIsPlayerReady(true);

    if (isVideoLoaded) {
      event.target.playVideo();
      setIsVideoPlaying(true);
    }
  };

  const onPlayerStateChange = (event: { data: number }) => {
    if (!hasVideo) return; // ✅ защита
    if (event.data === 0) setIsVideoPlaying(false);
    else if (event.data === 1) setIsVideoPlaying(true);
    else if (event.data === 2) setIsVideoPlaying(false);
  };

  const handlePlayPause = () => {
    if (!hasVideo) return; // ✅ главное: ничего не делаем, если нет id

    if (!isVideoLoaded) {
      setIsVideoLoaded(true);
      return;
    }

    if (isPlayerReady && playerRef.current) {
      if (isVideoPlaying) playerRef.current.pauseVideo();
      else playerRef.current.playVideo();

      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  return (
    <div className={styles.videoSlide}>
      <div className={styles.posterImageBlock}>
        {!isVideoPlaying && (
          <>
            <Image
              src={urlFor(posterImage).url()}
              alt={title}
              width={1920}
              height={1080}
              className={styles.posterImage}
            />
            <div className={styles.overlay}></div>
          </>
        )}

        {/* ✅ кнопку показываем только если есть videoId */}
        {hasVideo && (
          <button
            className={
              isVideoPlaying ? styles.playingButton : styles.playButton
            }
            onClick={handlePlayPause}
            aria-label={
              isVideoPlaying ? `Pause video: ${title}` : `Play video: ${title}`
            }
            type="button"
          >
            {isVideoPlaying ? (
              <FaPause
                className={styles.playIcon}
                color="#fff"
                fontSize="1em"
              />
            ) : (
              <FaPlay className={styles.playIcon} color="#fff" fontSize="1em" />
            )}
          </button>
        )}

        {/* ✅ плеер рендерим только если есть videoId */}
        {hasVideo && isVideoLoaded && (
          <YouTube
            videoId={videoId!}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: { autoplay: 1, controls: 0 }
            }}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
            className={styles.videoFrame}
          />
        )}
      </div>

      <div className={styles.videoSlideContent}>
        <p className={styles.date}>{date}</p>
        <p className={styles.title}>{title}</p>
      </div>
    </div>
  );
};

export default VideoSlide;
