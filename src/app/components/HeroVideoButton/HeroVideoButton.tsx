"use client";

import React, { FC, ReactNode, useState } from "react";
import dynamic from "next/dynamic";
import { FaPlay } from "react-icons/fa6";
import styles from "./HeroVideoButton.module.scss";

// Плеер и framer-motion тянем только когда пользователь реально открывает видео
const VideoModal = dynamic(() => import("../VideoModal/VideoModal"), {
  ssr: false
});

type Props = {
  videoId: string;
  startSeconds?: number;
  title?: string;
  children: ReactNode;
};

const HeroVideoButton: FC<Props> = ({
  videoId,
  startSeconds,
  title,
  children
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.videoButton}
        onClick={() => setIsOpen(true)}
      >
        <span className={styles.playIcon} aria-hidden="true">
          <FaPlay />
        </span>
        {children}
      </button>

      <VideoModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        videoId={videoId}
        startSeconds={startSeconds}
        title={title}
      />
    </>
  );
};

export default HeroVideoButton;
