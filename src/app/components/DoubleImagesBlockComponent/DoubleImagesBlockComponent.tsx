import { DoubleImagesBlock } from "@/types/blog";
import React, { FC } from "react";
import styles from "./DoubleImagesBlockComponent.module.scss";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  block: DoubleImagesBlock;
  title: string;
};

const DoubleImagesBlockComponent: FC<Props> = ({ block, title }) => {
  // console.log("block", block)
  return (
    <div className={styles.doubleImagesBlock}>
      <div className={styles.imageBlock}>
        <Image src={urlFor(block.leftImage).url()} alt={title} fill={true} />
      </div>
      <div className={styles.imageBlock}>
        <Image src={urlFor(block.rightImage).url()} alt={title} fill={true} />
      </div>
    </div>
  );
};

export default DoubleImagesBlockComponent;
