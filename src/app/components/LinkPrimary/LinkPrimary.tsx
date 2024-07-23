import Link from "next/link";
import React from "react";
import styles from "./LinkPrimary.module.scss";

type Props = {
  children: React.ReactNode;
  href: string;
};

const LinkPrimary = ({ children, href }: Props) => {
  return (
    <Link href={href} className={styles.linkPrimary}>
      {children}
    </Link>
  );
};

export default LinkPrimary;
