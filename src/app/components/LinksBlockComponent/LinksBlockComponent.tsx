import React, { FC } from "react";
import styles from "./LinksBlockComponent.module.scss";
import { LinksBlock } from "@/types/blog";
import Link from "next/link";

type Props = {
  block: LinksBlock;
};

const LinksBlockComponent: FC<Props> = ({ block }) => {
  return (
    <section className={styles.linksBlock}>
      {block.title && <h2 className="h2-main mb20">{block.title}</h2>}
      <div className={styles.links}>
        {block.links.map((link, index) => (
          <Link href={link.destination} key={index} className={styles.link}>
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default LinksBlockComponent;
