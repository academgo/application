import React from "react";
import styles from "./BlogButtonWrapper.module.scss";

type Props = {
  children: React.ReactNode;
};

const BlogButtonWrapper = ({ children }: Props) => {
  return <div className={styles.wrapper}>{children}</div>;
};

export default BlogButtonWrapper;
