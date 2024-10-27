import { LogosBlock } from "@/types/blog";
import React, { FC } from "react";
import styles from "./LogosBlockComponent.module.scss";
import LogosCarousel from "../LogosCarousel/LogosCarousel";

type Props = {
  block: LogosBlock;
};

const LogosBlockComponent: FC<Props> = ({ block }) => {
  return (
    <section className={styles.logosBlock}>
      <LogosCarousel universities={block.logos} />
    </section>
  );
};

export default LogosBlockComponent;
