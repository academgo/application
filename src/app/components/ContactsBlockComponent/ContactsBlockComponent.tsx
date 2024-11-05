import { ContactsBlock } from "@/types/blog";
import React, { FC } from "react";
import styles from "./ContactsBlockComponent.module.scss";
import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/sanity.client";

type Props = {
  block: ContactsBlock;
};

const ContactsBlockComponent: FC<Props> = ({ block }) => {
  return (
    <section className={styles.contactsBlock}>
      <div className={styles.wrapper}>
        <div className={styles.contactFlexBlock}>
          <p className={styles.title}>{block.title}</p>
        </div>
        <div className={`${styles.contactFlexBlock} ${styles.whiteBlock}`}>
          {block.contactsContent.map(contact => (
            <div key={contact._key} className={styles.contactBlock}>
              <p className={styles.contactTitle}>{contact.title}</p>
              {contact.linkLabel && contact.linkDestination && (
                <Link
                  href={contact.linkDestination}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.contactText}
                >
                  {contact.linkLabel}
                </Link>
              )}
              {contact.text && (
                <p className={styles.contactText}>{contact.text}</p>
              )}
            </div>
          ))}
          <p className={styles.socialDescription}>{block.socialDescription}</p>
          <div className={styles.socialIcons}>
            {block.socialIcons.map(socialIcon => (
              <Link
                key={socialIcon._key}
                href={socialIcon.link}
                target="_blank"
                rel="noreferrer"
                className={styles.socialLink}
              >
                {socialIcon.icon && (
                  <Image
                    alt={socialIcon.title || "Academgo social icon"}
                    src={urlFor(socialIcon.icon).url()}
                    className={styles.socialIcon}
                    width={50}
                    height={50}
                  />
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactsBlockComponent;
