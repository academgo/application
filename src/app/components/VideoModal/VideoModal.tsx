"use client";

import React, { FC, useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import YouTube from "react-youtube";
import styles from "./VideoModal.module.scss";

type Props = {
  open: boolean;
  onClose: () => void;
  videoId: string;
  startSeconds?: number;
  title?: string;
};

const VideoModal: FC<Props> = ({
  open,
  onClose,
  videoId,
  startSeconds,
  title
}) => {
  const [isReady, setIsReady] = useState(false);
  const reduceMotion = useReducedMotion();

  // Закрытие по Escape + блокировка скролла страницы, пока попап открыт
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.classList.add("no-scroll");

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("no-scroll");
    };
  }, [open, onClose]);

  // Плеер монтируется только на время показа, поэтому состояние сбрасываем
  useEffect(() => {
    if (!open) setIsReady(false);
  }, [open]);

  const overlayMotion = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 }
      }
    : {
        initial: { opacity: 0, backdropFilter: "blur(0px)" },
        animate: { opacity: 1, backdropFilter: "blur(8px)" },
        exit: { opacity: 0, backdropFilter: "blur(0px)" },
        transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }
      };

  const frameMotion = reduceMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.15 }
      }
    : {
        initial: { opacity: 0, scale: 0.92, y: 28 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 14 },
        transition: {
          type: "spring" as const,
          stiffness: 240,
          damping: 26,
          mass: 0.9
        }
      };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.overlay}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          {...overlayMotion}
        >
          <motion.div
            className={styles.frame}
            onClick={event => event.stopPropagation()}
            {...frameMotion}
          >
            <button
              type="button"
              className={styles.close}
              onClick={onClose}
              aria-label="Закрыть видео"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M15 1L1 15M1 1L15 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            <div className={styles.player}>
              {!isReady && <span className={styles.spinner} aria-hidden="true" />}
              <YouTube
                videoId={videoId}
                className={styles.youtube}
                iframeClassName={styles.iframe}
                onReady={() => setIsReady(true)}
                opts={{
                  // домен без кук — плеер не ставит трекеры до старта просмотра
                  host: "https://www.youtube-nocookie.com",
                  playerVars: {
                    autoplay: 1,
                    rel: 0,
                    modestbranding: 1,
                    playsinline: 1,
                    start: startSeconds || 0
                  }
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VideoModal;
