import { PackagePriceBlock } from "@/types/blog";
import React, { FC } from "react";
import styles from "./PackagePriceBlockComponent.module.scss";
import { PortableText } from "next-sanity";
import { RichText } from "../RichText/RichText";
import { ButtonModal } from "../ButtonModal/ButtonModal";

type Props = {
  block: PackagePriceBlock;
};

const PackagePriceBlockComponent: FC<Props> = ({ block }) => {
  const { leftSide, rightSide } = block;

  return (
    <section className={styles.packagePriceBlock}>
      <div className={styles.wrapper}>
        <div
          className={styles.leftSide}
          style={{
            backgroundColor: "#F39708"
          }}
        >
          <PortableText value={leftSide.content} components={RichText} />
        </div>
        <div
          className={styles.rightSide}
          style={{
            backgroundColor: "#112546"
          }}
        >
          <div className={styles.rightSideContent}>
            <div className={styles.pretitle}>{rightSide.pretitle}</div>
            <h2 className={styles.title}>{rightSide.title}</h2>
            <div className={styles.listTitle}>{rightSide.listTitle}</div>
            <ul className={styles.list}>
              {rightSide.list.map((item, index) => (
                <li key={index} className={styles.listItem}>
                  {item.title}
                </li>
              ))}
            </ul>
            <div className={styles.price}>{rightSide.price}</div>
            <div className={styles.priceDescription}>
              {rightSide.priceDescription}
            </div>
            <ButtonModal>{rightSide.buttonLabel}</ButtonModal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PackagePriceBlockComponent;
