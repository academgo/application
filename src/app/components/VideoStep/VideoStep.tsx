"use client";
import React, { FC, useState, useRef } from "react";
import styles from "./VideoStep.module.scss";
import { Image as ImageType } from "@/types/homepage";
import Image from "next/image";
import { FaPlay, FaPause } from "react-icons/fa";
import YouTube, { YouTubePlayer } from "react-youtube";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  videoId: string;
  posterImage: ImageType;
  text: string;
};

const VideoStep: FC<Props> = ({ videoId, posterImage, text }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const playerRef = useRef<YouTubePlayer | null>(null);

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;
    setIsPlayerReady(true);
    if (isVideoLoaded) {
      event.target.playVideo();
      setIsVideoPlaying(true);
    }
  };

  const onPlayerStateChange = (event: { data: number }) => {
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
    if (!isVideoLoaded) {
      setIsVideoLoaded(true);
      return;
    }

    if (isPlayerReady && playerRef.current) {
      if (isVideoPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  return (
    <div className={styles.videoStep}>
      <div className={styles.posterImageBlock}>
        {!isVideoPlaying && (
          <>
            <Image
              src={urlFor(posterImage).url()}
              alt={text}
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
            isVideoPlaying ? `Pause video: ${text}` : `Play video: ${text}`
          }
        >
          {isVideoPlaying ? (
            <FaPause className={styles.playIcon} color="#fff" fontSize="1em" />
          ) : (
            <FaPlay className={styles.playIcon} color="#fff" fontSize="1em" />
          )}
        </button>
        {isVideoLoaded && (
          <YouTube
            videoId={videoId}
            opts={{
              width: "100%",
              height: "100%",
              playerVars: {
                autoplay: 1, // Autoplay when initializing
                controls: 0
              }
            }}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
            className={styles.videoFrame}
          />
        )}
        {!isVideoPlaying && (
          <div className={styles.videoStepContent}>
            <p className={styles.text}>{text}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoStep;
