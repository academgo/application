import { BenefitsBlock } from "@/types/blog";
import React, { FC } from "react";
import styles from "./BenefitsBlockComponent.module.scss";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  block: BenefitsBlock;
};

const BenefitsBlockComponent: FC<Props> = ({ block }) => {
  return (
    <section className={styles.benefitsBlock}>
      <h2 className="h2-main mb20">
        {block.title && <span>{block.title}</span>}
        {block.titleHighLight && (
          <span className={styles.highlight}>&nbsp;{block.titleHighLight}</span>
        )}
      </h2>
      {block.description && (
        <p className={styles.description}>{block.description}</p>
      )}
      <div className={styles.benefitsList}>
        {block.benefitsBullets.map((bullet, index) => (
          <div key={index} className={styles.bullet}>
            <div className={styles.bulletIcon}>
              {bullet.bulletIcon && (
                <Image
                  src={urlFor(bullet.bulletIcon).url()}
                  alt={bullet.bulletTitle}
                  width={50}
                  height={50}
                />
              )}
            </div>
            <div className={styles.bulletContent}>
              {bullet.bulletTitle && (
                <p className={styles.bulletTitle}>{bullet.bulletTitle}</p>
              )}
              {bullet.bulletText && (
                <p className={styles.bulletText}>{bullet.bulletText}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsBlockComponent;
