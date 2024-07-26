import React, { FC } from "react";
import styles from "./NotFoundPageComponent.module.scss";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";
import Link from "next/link";
import { NotFoundPage } from "@/types/notFoundPage";
import LinkPrimary from "../LinkPrimary/LinkPrimary";

type Props = {
  notFoundPage: NotFoundPage;
  lang: string;
};

const NotFoundPageComponent: FC<Props> = ({ notFoundPage, lang }) => {
  const { textStart, textend, description, buttonText, image } = notFoundPage;

  return (
    <section className={styles.success}>
      <div className={`container ${styles.containerCustom}`}>
        <div className={styles.wrapper}>
          <div className={styles.contentBlock}>
            <div className={styles.contentTop}>
              <h1 className={styles.title}>{textStart}</h1>
              <p className={styles.title}>{textend}</p>
            </div>
            <div className={styles.contentBottom}>
              <p className={styles.description}>{description}</p>
              <div className={styles.linkBlock}>
                <LinkPrimary href={`/${lang}`}>{buttonText}</LinkPrimary>
              </div>
            </div>
          </div>
          <div className={styles.imageBlock}>
            <Image
              src={urlFor(image).url()}
              alt={textStart}
              width={500}
              height={500}
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPageComponent;
