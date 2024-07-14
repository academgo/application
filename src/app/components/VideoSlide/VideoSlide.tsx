"use client";
import React, { FC, useState, useRef } from "react";
import styles from "./VideoSlide.module.scss";
import { Image as ImageType, Video } from "@/types/homepage";
import Image from "next/image";
import { FaPlay, FaPause } from "react-icons/fa";
import YouTube, { YouTubePlayer } from "react-youtube";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  videoId: string;
  posterImage: ImageType;
  date: string;
  title: string;
};

const VideoSlide: FC<Props> = ({ videoId, posterImage, date, title }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    // console.log('Player is ready');
    playerRef.current = event.target;
    setIsPlayerReady(true);
  };

  const onPlayerStateChange = (event: { data: number }) => {
    console.log("Player state changed:", event.data);
    if (event.data === 0) {
      // Video ended
      setIsVideoPlaying(false);
    } else if (event.data === 1) {
      // Video playing
      setIsVideoPlaying(true);
    } else if (event.data === 2) {
      // Video paused
      setIsVideoPlaying(false);
    }
  };

  const handlePlayPause = () => {
    if (isPlayerReady && playerRef.current) {
      if (isVideoPlaying) {
        console.log("Pausing video");
        playerRef.current.pauseVideo();
      } else {
        console.log("Playing video");
        playerRef.current.playVideo();
      }
      setIsVideoPlaying(!isVideoPlaying);
    } else {
      console.log("Player is not ready");
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
        <button
          className={isVideoPlaying ? styles.playingButton : styles.playButton}
          onClick={handlePlayPause}
          aria-label={
            isVideoPlaying ? `Pause video: ${title}` : `Play video: ${title}`
          }
        >
          {isVideoPlaying ? (
            <FaPause className={styles.playIcon} color="#fff" fontSize="1em" />
          ) : (
            <FaPlay className={styles.playIcon} color="#fff" fontSize="1em" />
          )}
        </button>
        <YouTube
          videoId={videoId}
          opts={{
            width: "100%",
            height: "100%",
            playerVars: {
              autoplay: 0, // Don't autoplay when initializing
              controls: 0
            }
          }}
          onReady={onPlayerReady}
          onStateChange={onPlayerStateChange}
          className={styles.videoFrame}
        />
      </div>
      <div className={styles.videoSlideContent}>
        <p className={styles.date}>{date}</p>
        <h3 className={styles.title}>{title}</h3>
      </div>
    </div>
  );
};

export default VideoSlide;
