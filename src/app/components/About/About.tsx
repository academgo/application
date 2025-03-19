import React, { FC } from "react";
import styles from "./About.module.scss";
import {
  Ceo,
  Link as LinkType,
  List as ListType,
  offerContactLink
} from "@/types/homepage";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  aboutSummary: string;
  aboutTitle: string;
  aboutParagraphs: ListType[];
  sertificateLink: LinkType;
  aboutSocialsTitle: string;
  aboutSocials: offerContactLink[];
  aboutOffersTitle: string;
  aboutOffers: offerContactLink[];
  ceos: Ceo[];
};

const About: FC<Props> = ({
  aboutSummary,
  aboutTitle,
  aboutParagraphs,
  sertificateLink,
  aboutSocialsTitle,
  aboutSocials,
  aboutOffersTitle,
  aboutOffers,
  ceos
}) => {
  return (
    <section className={styles.aboutSection} id="about">
      <div className="container">
        <div className={styles.about}>
          <div className={styles.aboutWrapper}>
            <div className={styles.textContent}>
              <p className={styles.summary}>{aboutSummary}</p>
              <p className={styles.title}>{aboutTitle}</p>
              <div className={styles.paragraphs}>
                {aboutParagraphs.map((paragraph, index) => (
                  <p className={styles.paragraph} key={paragraph._key}>
                    {paragraph.title}
                  </p>
                ))}
              </div>
            </div>
            <div className={styles.contacts}>
              <div className={styles.subscribe}>
                <p className={styles.subtitle}>{aboutSocialsTitle}</p>
                <ul className={styles.icons}>
                  {aboutSocials.map(social => (
                    <li key={social._key}>
                      <Link href={social.link}>
                        <Image
                          alt={social.title}
                          src={urlFor(social.icon).url()}
                          width={50}
                          height={50}
                          className={styles.contactIcon}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div className={styles.write}>
                <p className={styles.subtitle}>{aboutOffersTitle}</p>
                <ul className={styles.icons}>
                  {aboutOffers.map(offer => (
                    <li key={offer._key}>
                      <Link href={offer.link}>
                        <Image
                          alt={offer.title}
                          src={urlFor(offer.icon).url()}
                          width={50}
                          height={50}
                          className={styles.contactIcon}
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className={styles.ceos}>
            {ceos.map(ceo => (
              <div key={ceo._key} className={styles.ceo}>
                <div className={styles.overlay}></div>
                <Image
                  alt={ceo.name}
                  src={urlFor(ceo.image).url()}
                  // fill={true}
                  width={410}
                  height={450}
                  className={styles.ceoImage}
                />
                <div className={styles.ceoData}>
                  <p className={styles.ceoName}>{ceo.name}</p>
                  <p className={styles.ceoPosition}>{ceo.position}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
