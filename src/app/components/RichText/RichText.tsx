import Image from "next/image";
import Link from "next/link";
import React from "react";
import styles from "./RichText.module.scss";
import { urlFor } from "@/sanity/sanity.client";

// Компонент для SVG
const BulletIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="8"
    viewBox="0 0 12 8"
    fill="none"
  >
    <path
      d="M11.3595 1.10594L10.3404 0.186046C10.203 0.0620155 10.0312 0 9.83654 0C9.64187 0 9.47011 0.0620155 9.33269 0.186046L4.4316 4.60982L2.24443 2.62532C2.10701 2.50129 1.93525 2.43928 1.74058 2.43928C1.54591 2.43928 1.37414 2.50129 1.23672 2.62532L0.217572 3.54522C0.0687069 3.66925 0 3.82429 0 4C0 4.17571 0.0687069 4.33075 0.206121 4.45478L2.90859 6.89406L3.92775 7.81395C4.06516 7.93798 4.23693 8 4.4316 8C4.62627 8 4.79803 7.93798 4.93545 7.81395L5.9546 6.89406L11.3595 2.0155C11.497 1.89147 11.5657 1.73643 11.5657 1.56072C11.5657 1.38501 11.497 1.22997 11.3595 1.10594Z"
      fill="#F39708"
    />
  </svg>
);

export const RichText = {
  types: {
    image: ({ value }: any) => {
      const { alt } = value;
      return (
        <div className={styles.blogImage}>
          <Image
            src={urlFor(value).url()}
            alt={alt || "Academgo image"}
            fill={true}
          />
        </div>
      );
    }
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className={styles.customBulletList}>
        {React.Children.map(children, child =>
          React.cloneElement(child, {
            className: styles.listItem,
            children: (
              <>
                <BulletIcon />
                <span>{child.props.children}</span>
              </>
            )
          })
        )}
      </ul>
    )
  },
  number: ({ children }: any) => (
    <ol className="mt-lg list-decimal">{children}</ol>
  ),
  block: {
    normal: ({ children }: any) => (
      <p className={styles.paragraph}>{children}</p>
    ),
    // h1: ({ children }: any) => (
    //   <h1 className="text-4xl md:text-[50px] mb-2 font-bold text-[#163e5c]">
    //     {children}
    //   </h1>
    // ),
    h2: ({ children }: any) => <h2 className={styles.h2}>{children}</h2>,
    h3: ({ children }: any) => <h3 className={styles.h3}>{children}</h3>,
    h4: ({ children }: any) => <h4 className={styles.h4}>{children}</h4>,
    blockquote: ({ children }: any) => (
      <blockquote className={styles.blockquote}>{children}</blockquote>
    )
  },
  marks: {
    link: ({ children, value }: any) => {
      const rel = !value.href ? "noreferrer noopener" : undefined;
      return (
        <Link href={value.href} rel={rel} className="underline">
          {children}
        </Link>
      );
    }
  }
};
