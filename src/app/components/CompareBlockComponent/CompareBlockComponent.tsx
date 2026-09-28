import { CompareBlock } from "@/types/blog";
import React, { FC } from "react";
import styles from "./CompareBlockComponent.module.scss";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import Link from "next/link";
import LinkPrimary from "../LinkPrimary/LinkPrimary";

type Props = {
  block: CompareBlock;
};

const CompareBlockComponent: FC<Props> = ({ block }) => {
  return (
    <section className={styles.compareBlock}>
      <img
        src="/decor/de2f03229c.svg"
        alt=""
        aria-hidden="true"
        className={styles.decor}
        width={855}
        height={483}
        loading="lazy"
        decoding="async"
      />
      <div className={styles.compareBlockWrapper}>
        <div className={styles.contentBlock}>
          <p className={styles.title}>{block.title}</p>
          <p className={styles.description}>{block.description}</p>
          {/* <Link className={styles.link} href={block.link.destination}>
            {block.link.label}
          </Link> */}
          <div className={styles.link}>
            <LinkPrimary href={block.link.destination}>
              {block.link.label}
            </LinkPrimary>
          </div>
        </div>
        <div className={styles.imageBlock}>
          <Image
            alt={block.title}
            src={urlFor(block.image).url()}
            width={400}
            height={400}
            className={styles.imagePoster}
          />
        </div>
      </div>
    </section>
  );
};

export default CompareBlockComponent;
