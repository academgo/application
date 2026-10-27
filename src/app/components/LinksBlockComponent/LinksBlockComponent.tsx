import React, { FC } from "react";
import styles from "./LinksBlockComponent.module.scss";
import { LinksBlock } from "@/types/blog";
import Link from "next/link";
import { normalizeInternalHref } from "@/lib/href";

type Props = {
  block: LinksBlock;
  lang: string;
};

const LinksBlockComponent: FC<Props> = ({ block, lang }) => {
  return (
    <section className={styles.linksBlock}>
      {block.title && <h2 className="h2-main mb20">{block.title}</h2>}
      <div className={styles.links}>
        {block.links.map((link, index) => (
          <Link
            href={normalizeInternalHref(lang, link.destination)}
            key={index}
            className={styles.link}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LinksBlockComponent;
