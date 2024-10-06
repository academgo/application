import { Form } from "@/types/form";
import {
  Consultation as ConsultationType,
  ContactLink,
  List as ListType
} from "@/types/homepage";
import React, { FC } from "react";
import styles from "./Consultation.module.scss";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";
import FormSuperLite from "../FormSuperLite/FormSuperLite";

type Props = {
  consultationBlock: ConsultationType;
};

const Consultation: FC<Props> = ({ consultationBlock }) => {
  const {
    title,
    titleHighlight,
    listTitle,
    list,
    giftText,
    description,
    formTitle,
    form,
    buttonCustomText,
    altText,
    contactLinks
  } = consultationBlock;

  // console.log("offerForm", offerForm);

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
                <p className={styles.offerTitle}>
                  {title}{" "}
                  <span className={styles.offerTitleHighlight}>
                    {titleHighlight}
                  </span>
                </p>
                <div className={styles.listBlock}>
                  <p className={styles.offerListTitle}>{listTitle}</p>
                  <ul className={styles.offerList}>
                    {list.map(item => (
                      <li className={styles.offerListItem} key={item._key}>
                        {item.title}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={styles.giftBlock}>
                  <div className={styles.giftImage}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="60"
                      height="60"
                      viewBox="0 0 60 60"
                      fill="none"
                    >
                      <rect width="60" height="60" rx="15" fill="#F5F5F5" />
                      <path
                        d="M40.5896 24.2443H38.3312C38.7322 24.0383 39.1041 23.7798 39.4374 23.4764C40.4237 22.5477 40.98 21.2514 40.9738 19.8968C40.9682 18.5803 40.4109 17.3265 39.4374 16.4402C38.4449 15.5146 37.1381 15 35.7813 15C34.4241 15 33.1176 15.5146 32.1248 16.4402C30.9883 17.7707 30.2342 19.3848 29.9434 21.1105C29.6332 19.4033 28.8689 17.8114 27.731 16.5017C26.7385 15.5761 25.432 15.0615 24.0749 15.0615C22.7177 15.0615 21.4112 15.5761 20.4184 16.5017C19.445 17.388 18.8877 18.6418 18.8823 19.9583C18.8758 21.3127 19.4324 22.6092 20.4184 23.5378C20.7518 23.8413 21.1237 24.0998 21.5246 24.3058H19.2971C18.578 24.2932 17.8829 24.5627 17.36 25.0568C16.8374 25.5506 16.529 26.2295 16.501 26.9482V42.3112C16.5172 43.0378 16.8204 43.7286 17.3443 44.2324C17.8682 44.736 18.5703 45.012 19.2971 44.9996H40.5897C41.3165 45.0119 42.0187 44.736 42.5425 44.2324C43.0664 43.7286 43.3696 43.0378 43.3859 42.3112V26.9482C43.3738 26.2188 43.0724 25.5241 42.5479 25.0172C42.0235 24.51 41.3191 24.232 40.5897 24.2444L40.5896 24.2443ZM32.0021 22.4777C32.2449 20.9297 32.8503 19.4609 33.769 18.1914C34.3433 17.6536 35.102 17.3568 35.889 17.3619C36.6397 17.3568 37.3644 17.6369 37.9169 18.1453C38.4184 18.5967 38.7083 19.2373 38.7157 19.9119C38.7085 20.6395 38.3963 21.3306 37.8555 21.8169C36.4589 22.706 34.8868 23.2827 33.2467 23.5069L31.6336 23.8757L32.0021 22.4777ZM22.0471 18.13C22.5996 17.6215 23.3243 17.3417 24.0751 17.3466C24.8618 17.3415 25.6208 17.6385 26.195 18.1763C27.1202 19.4494 27.731 20.9233 27.9771 22.4778L28.4073 23.8758L26.8712 23.507H26.8709C25.2308 23.2822 23.6589 22.7059 22.2621 21.817C21.7194 21.3371 21.4019 20.652 21.3866 19.9275C21.3494 19.2629 21.5883 18.6124 22.0471 18.13ZM18.8056 42.311V26.9479C18.8377 26.7074 19.0561 26.5367 19.2973 26.5639H28.4076V42.6947H19.2973C19.0561 42.7219 18.8377 42.5512 18.8056 42.3107V42.311ZM41.0812 42.311H41.0814C41.0493 42.5514 40.8309 42.7222 40.5897 42.6949H31.4794V26.549H40.5897C40.8286 26.53 41.0421 26.6969 41.0814 26.9333L41.0812 42.311Z"
                        fill="#8A929C"
                      />
                    </svg>
                  </div>
                  <div className={styles.giftContent}>
                    <p className={styles.giftText}>{giftText}</p>
                  </div>
                </div>
              </div>
              <div className={styles.offerDesctiption}>
                <p>{description}</p>
              </div>
              <div className={styles.offerLinksDesctop}>
                <p className={styles.offerAltText}>{altText}</p>
                <div className={styles.offerContactLinks}>
                  {contactLinks.map(link => (
                    <Link
                      key={link._key}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactLink}
                    >
                      <Image
                        alt={link.title}
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
            <div className={styles.mainContenrRight}>
              <div className={styles.offerFormBlock}>
                <p className={styles.offerFormTitle}>{formTitle}</p>
                <FormSuperLite
                  form={form}
                  buttonCustomText={buttonCustomText}
                />
              </div>
              <div className={styles.offerLinksBlock}>
                <p className={styles.offerAltText}>{altText}</p>
                <div className={styles.offerContactLinks}>
                  {contactLinks.map(link => (
                    <Link
                      key={link._key}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.contactLink}
                    >
                      <Image
                        alt={link.title}
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

export default Consultation;
