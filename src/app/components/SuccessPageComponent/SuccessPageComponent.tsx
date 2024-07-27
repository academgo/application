import { SuccessPage } from "@/types/successPage";
import React, { FC } from "react";
import styles from "./SuccessPageComponent.module.scss";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";
import Link from "next/link";

type Props = {
  successPage: SuccessPage;
  lang: string;
};

const SuccessPageComponent: FC<Props> = ({ successPage, lang }) => {
  const { successTextstart, successTextend, description, socialIcons, image } =
    successPage;

  return (
    <section className={styles.success}>
      <div className={`container ${styles.containerCustom}`}>
        <div className={styles.wrapper}>
          <div className={styles.contentBlock}>
            <div className={styles.contentTop}>
              <h1 className={styles.title}>{successTextstart}</h1>
              <p className={styles.title}>{successTextend}</p>
            </div>
            <div className={styles.contentBottom}>
              <p className={styles.description}>{description}</p>
              <div className={styles.socialIcons}>
                {socialIcons.map(icon => (
                  <Link
                    key={icon._key}
                    href={icon.link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      src={urlFor(icon.icon).url()}
                      alt={icon.title}
                      width={75}
                      height={75}
                      className={styles.icon}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.imageBlock}>
            <Image
              src={urlFor(image).url()}
              alt={successTextstart}
              width={750}
              height={750}
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SuccessPageComponent;
