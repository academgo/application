import { getFooterByLang } from "@/sanity/sanity.utils";
import React from "react";
import styles from "./Footer.module.scss";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";
import NavLink from "../NavLink/NavLink";
import Consultation from "../Consultation/Consultation";
import { ButtonModal } from "../ButtonModal/ButtonModal";

type Props = {
  params: { lang: string };
};

const Footer = async ({ params }: Props) => {
  const data = await getFooterByLang(params.lang);

  // console.log("Footer data", data.consultationBlock);

  return (
    <>
      <Consultation consultationBlock={data.consultationBlock} />
      <footer className={styles.footer}>
        <div className="container">
          <div className={styles.wrapper}>
            <div className={styles.top}>
              <div className={styles.companyData}>
                <Link className={styles.logoLink} href={`/${params.lang}`}>
                  <Image
                    alt="Academgo Logo"
                    src={urlFor(data.logo).url()}
                    width={200}
                    height={200}
                    className={styles.logoImage}
                  />
                </Link>
                <p className={styles.description}>{data.description}</p>
              </div>
              <div className={styles.contactData}>
                <p className={styles.workingHours}>{data.workingHours}</p>
                <Link
                  className={styles.phoneNumber}
                  href={`tel:${data.phoneNumber.replace(/[^\d+]/g, "")}`}
                >
                  {data.phoneNumber}
                </Link>
              </div>
              <div className={styles.emailBlock}>
                <Link
                  href={`mailto:${data.footerEmail}`}
                  className={styles.email}
                >
                  {data.footerEmail}
                </Link>
              </div>
              <div className={styles.adressBlock}>
                <p className={styles.adress}>{data.adress}</p>
              </div>
            </div>
            <div className={styles.middle}>
              <nav className={styles.navLinks}>
                {data.navLinks.map(link => (
                  <NavLink key={link.label} href={link.link}>
                    {link.label}
                  </NavLink>
                ))}
              </nav>
            </div>
            <div className={styles.bottom}>
              <div className={styles.bottomLeft}>
                <div className={styles.social}>
                  <p className={styles.contactLinksTitle}>
                    {data.contactLinksTitle}
                  </p>
                  <div className={styles.socialItems}>
                    {data.contactLinks.map(link => (
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
              <div className={styles.bottomRight}>
                <ButtonModal>{data.buttonText}</ButtonModal>
                {/* <button className={styles.button}>{data.buttonText}</button> */}
              </div>
            </div>
            <div className={styles.dataLinks}>
              <p className={styles.copyright}>{data.copyright}</p>
              <Link href={data.privacyLink.link} className={styles.privacy}>
                {data.privacyLink.label}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
