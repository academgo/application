import { Image as ImageType } from "@/types/homepage";
import React, { FC } from "react";
import styles from "./PreviewMain.module.scss";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  previewImage: ImageType;
  title: string;
};

const PreviewMain: FC<Props> = ({ previewImage, title }) => {
  return (
    <section className={styles.previewMain}>
      <div className={styles.overlay}></div>
      <Image
        alt={title}
        src={urlFor(previewImage).url()}
        fill={true}
        className={styles.image}
      />
    </section>
  );
};

export default PreviewMain;
