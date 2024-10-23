import { ExtraBlock } from "@/types/blog";
import Image from "next/image";
import React, { FC } from "react";
import styles from "./ExtraBlockComponent.module.scss";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  block: ExtraBlock;
};

const ExtraBlockComponent: FC<Props> = ({ block }) => {
  return (
    <section className={styles.extraBlock}>
      <div className={styles.extra}>
        <Image
          alt={block.title}
          src={urlFor(block.bgImage).url()}
          fill={true}
          className={styles.imagePoster}
        />
        <div className={styles.overlay}></div>
        <div className={styles.extraWrapper}>
          <div className={styles.mainContent}>
            <p className={styles.title}>{block.title}</p>
            <p className={styles.description}>{block.description}</p>
            <div className={styles.items}>
              {block.items.map(item => (
                <div key={item._key} className={styles.item}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                  >
                    <rect
                      y="-0.00488281"
                      width="25"
                      height="25"
                      rx="5"
                      fill="white"
                    />
                    <path
                      d="M18.7861 9.2393L17.7287 8.20442C17.5861 8.06488 17.4079 7.99512 17.2059 7.99512C17.004 7.99512 16.8257 8.06488 16.6832 8.20442L11.598 13.1812L9.32871 10.9486C9.18614 10.8091 9.00792 10.7393 8.80594 10.7393C8.60396 10.7393 8.42574 10.8091 8.28317 10.9486L7.22574 11.9835C7.07129 12.123 7 12.2974 7 12.4951C7 12.6928 7.07129 12.8672 7.21386 13.0067L10.0178 15.7509L11.0752 16.7858C11.2178 16.9253 11.396 16.9951 11.598 16.9951C11.8 16.9951 11.9782 16.9253 12.1208 16.7858L13.1782 15.7509L18.7861 10.2626C18.9287 10.123 19 9.94861 19 9.75093C19 9.55326 18.9287 9.37884 18.7861 9.2393Z"
                      fill="#112546"
                    />
                  </svg>
                  <p>{item.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExtraBlockComponent;
