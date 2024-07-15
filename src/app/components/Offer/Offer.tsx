import { Form } from "@/types/form";
import { offerContactLink, offerListItem } from "@/types/homepage";
import React, { FC } from "react";
import styles from "./Offer.module.scss";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";
import FormSuperLite from "../FormSuperLite/FormSuperLite";

type Props = {
  offerTitle: string;
  offerTitleHighlight: string;
  offerListTitle: string;
  offerList: offerListItem[];
  giftText: string;
  offerDesctiption: string;
  offerFormTitle: string;
  offerForm: Form;
  offerAltText: string;
  offerContactLinks: offerContactLink[];
};

const Offer: FC<Props> = ({
  offerTitle,
  offerTitleHighlight,
  offerListTitle,
  offerList,
  giftText,
  offerDesctiption,
  offerFormTitle,
  offerForm,
  offerAltText,
  offerContactLinks
}) => {
  console.log("offerForm", offerForm);

  return (
    <section className={styles.offer}>
      <div className="container">
        <div className={styles.offerWrapper}>
          <svg
            className={styles.posterBackground}
            width="466"
            height="176"
            viewBox="0 0 466 176"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M54.038 150.742H440.514C454.306 150.742 465.5 161.942 465.5 175.742V0.742188H0.768799C14.5608 0.742188 25.7543 11.9422 25.7543 25.7422V122.442C25.7543 138.042 38.347 150.742 54.038 150.742Z"
              fill="#F5F5F5"
            />
          </svg>

          <div className={styles.offerMainContent}>
            <div className={styles.mainContentLeft}>
              <div className={styles.offerFlexBlock}>
                <h2 className={styles.offerTitle}>
                  {offerTitle}{" "}
                  <span className={styles.offerTitleHighlight}>
                    {offerTitleHighlight}
                  </span>
                </h2>
                <div className={styles.listBlock}>
                  <p className={styles.offerListTitle}>{offerListTitle}</p>
                  <ul className={styles.offerList}>
                    {offerList.map(item => (
                      <li className={styles.offerListItem} key={item._key}>
                        {item.offerListItem}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.giftBlock}>
                  <div className={styles.giftImage}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                    >
                      <rect
                        y="-0.00463867"
                        width="40"
                        height="40"
                        rx="10"
                        fill="#224071"
                      />
                      <path
                        d="M27.0596 16.1582H25.554C25.8213 16.0209 26.0692 15.8486 26.2914 15.6463C26.949 15.0272 27.3199 14.163 27.3157 13.2599C27.312 12.3822 26.9404 11.5464 26.2914 10.9555C25.6298 10.3384 24.7586 9.99536 23.854 9.99536C22.9492 9.99536 22.0782 10.3384 21.4164 10.9555C20.6587 11.8425 20.156 12.9186 19.9621 14.069C19.7553 12.9309 19.2457 11.8696 18.4872 10.9965C17.8255 10.3794 16.9545 10.0364 16.0497 10.0364C15.145 10.0364 14.274 10.3794 13.6121 10.9965C12.9632 11.5874 12.5916 12.4232 12.588 13.3009C12.5837 14.2038 12.9548 15.0681 13.6121 15.6873C13.8343 15.8896 14.0823 16.0619 14.3496 16.1992H12.8646C12.3852 16.1908 11.9218 16.3705 11.5732 16.6999C11.2248 17.0291 11.0192 17.4817 11.0005 17.9608V28.2028C11.0113 28.6872 11.2134 29.1477 11.5627 29.4837C11.912 29.8194 12.3801 30.0033 12.8646 29.9951H27.0597C27.5442 30.0033 28.0123 29.8193 28.3615 29.4837C28.7108 29.1478 28.9129 28.6872 28.9238 28.2028V17.9608C28.9157 17.4745 28.7148 17.0114 28.3651 16.6735C28.0155 16.3354 27.5459 16.15 27.0597 16.1583L27.0596 16.1582ZM21.3346 14.9805C21.4964 13.9485 21.9001 12.9693 22.5125 12.123C22.8954 11.7644 23.4012 11.5666 23.9258 11.57C24.4263 11.5666 24.9095 11.7533 25.2778 12.0922C25.6121 12.3931 25.8054 12.8202 25.8103 13.27C25.8055 13.755 25.5974 14.2157 25.2368 14.54C24.3058 15.1327 23.2577 15.5171 22.1643 15.6666L21.0889 15.9125L21.3346 14.9805ZM14.6979 12.082C15.0662 11.743 15.5494 11.5565 16.0499 11.5598C16.5744 11.5563 17.0804 11.7544 17.4632 12.1129C18.0799 12.9616 18.4871 13.9443 18.6512 14.9805L18.9381 15.9126L17.9139 15.6667H17.9138C16.8204 15.5168 15.7724 15.1326 14.8412 14.54C14.4795 14.2201 14.2677 13.7634 14.2576 13.2803C14.2327 12.8373 14.3921 12.4037 14.6979 12.082ZM12.5369 28.2027V17.9606C12.5583 17.8003 12.7039 17.6865 12.8647 17.7046H18.9382V28.4585H12.8647C12.7039 28.4767 12.5583 28.3628 12.5369 28.2025V28.2027ZM27.3873 28.2027H27.3875C27.366 28.363 27.2205 28.4768 27.0596 28.4587H20.9861V17.6947H27.0596C27.2189 17.682 27.3612 17.7933 27.3875 17.9509L27.3873 28.2027Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                  <div className={styles.giftContent}>
                    <p className={styles.giftText}>{giftText}</p>
                  </div>
                </div>
              </div>
              <div className={styles.offerDesctiption}>
                <p>{offerDesctiption}</p>
              </div>
            </div>
            <div className={styles.mainContenrRight}>
              <div className={styles.offerFormBlock}>
                <h3 className={styles.offerFormTitle}>{offerFormTitle}</h3>
                <FormSuperLite form={offerForm} />
              </div>
              <div className={styles.offerLinksBlock}>
                <p className={styles.offerAltText}>{offerAltText}</p>
                <div className={styles.offerContactLinks}>
                  {offerContactLinks.map(link => (
                    <Link
                      key={link._key}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactLink}
                    >
                      <Image
                        alt="Icon"
                        src={urlFor(link.icon).url()}
                        width={50}
                        height={50}
                        className={styles.contactIcon}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Offer;
