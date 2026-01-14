import { Translation } from "@/types/post";
import LocaleSwitcher from "../LocaleSwitcher/LocaleSwitcher";
import { getHeaderByLang } from "@/sanity/sanity.utils";
import { Header as HeaderType } from "@/types/header";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";
import styles from "./Header.module.scss";
import Link from "next/link";
import NavWrapper from "../NavWrapper/NavWrapper";

type Props = {
  translations?: Translation[];
  params: { lang: string };
};

const Header = async ({ translations, params }: Props) => {
  const data = await getHeaderByLang(params.lang);

  return (
    <header className={styles.header}>
      <div className="container">
        <div className={styles.wrapper}>
          <div className={styles.companyData}>
            <Link className={styles.logoLink} href={`/${params.lang}`}>
              <Image
                alt="Academgo Logo"
                src={urlFor(data.logo).url()}
                width={200}
                height={200}
                className={styles.logoImage}
              />
              <Image
                alt="Academgo Logo"
                src={urlFor(data.logoMobile).url()}
                width={40}
                height={40}
                className={`${styles.logoImageMobile} logoImageMobile`}
              />
              <Image
                alt="Academgo Logo"
                src={urlFor(data.logoMobileActive).url()}
                width={40}
                height={40}
                className={`${styles.logoImageMobile} logoImageMobileActive`}
              />
            </Link>
            <p className={styles.description}>{data.description}</p>
          </div>
          <div className={styles.navWrapperParent}>
            <NavWrapper navLinks={data.navLinks} params={params} />
          </div>
          <div className={styles.contacts}>
            <div className={styles.contactLinks}>
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
            {/* <div className={styles.contactData}>
              <p className={styles.workingHours}>{data.workingHours}</p>
              <Link
                aria-label="Call us"
                className={styles.phoneNumber}
                href={`tel:${data.phoneNumber.replace(/[^\d+]/g, "")}`}
              >
                {data.phoneNumber}
              </Link>
            </div> */}
            <div className={styles.contactButtons}>
              <Link
                aria-label="Call us"
                className={styles.phoneButton}
                href={`tel:${data.phoneNumber.replace(/[^\d+]/g, "")}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                >
                  <path
                    d="M14.6388 11.3744L12.4052 9.81363C12.1131 9.6099 11.7717 9.50249 11.4176 9.50249C10.8547 9.50249 10.3262 9.77861 10.0044 10.2406L9.48585 10.9838C8.61684 10.4009 7.64715 9.58701 6.72275 8.66268C5.79852 7.73835 4.9849 6.76856 4.40224 5.89945L5.145 5.38089C5.52361 5.11722 5.77647 4.72224 5.85677 4.269C5.9369 3.81609 5.8359 3.35847 5.57193 2.97965L4.01168 0.745769C3.68542 0.279058 3.15899 0.000244141 2.60328 0.000244141C2.41069 0.000244141 2.2218 0.0342541 2.04201 0.10059C1.8378 0.176018 1.64757 0.26862 1.46104 0.385802L1.15262 0.602995C1.07552 0.662933 1.0038 0.728596 0.935118 0.797289C0.558861 1.17342 0.291861 1.64956 0.141189 2.21257C-0.501731 4.6229 1.09101 8.26769 4.10444 11.2814C6.63504 13.8123 9.67524 15.3845 12.0383 15.3849C12.443 15.3849 12.8247 15.3377 13.1725 15.2448C13.7355 15.0943 14.2115 14.8272 14.588 14.4508C14.6563 14.3824 14.7216 14.3107 14.7917 14.2201L15.009 13.91C15.1152 13.7403 15.2077 13.55 15.2841 13.3443C15.5469 12.6338 15.2816 11.8236 14.6388 11.3744Z"
                    fill="#112546"
                  />
                </svg>
              </Link>
              <LocaleSwitcher translations={translations} />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
