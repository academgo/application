import { PricesBlock, Part, Package, PackageItem } from "@/types/blog";
import React, { FC } from "react";
import styles from "./PricesBlockComponent.module.scss";

type Props = {
  block: PricesBlock;
};

const PricesBlockComponent: FC<Props> = ({ block }) => {
  return (
    <section className={styles.pricesBlock}>
      <h2 className={styles.title}>
        {block.title}{" "}
        <span className={styles.highlight}>{block.titleHighLight}</span>
      </h2>

      <div className={styles.table}>
        {/* Заголовки пакетов */}
        <div className={styles.headerRow}>
          <div className={styles.headerCell}></div>
          {block.packages.map((pkg: Package, pkgIndex: number) => (
            <div key={pkgIndex} className={styles.headerCell}>
              <h3 className={styles.packageTitle}>{pkg.packageTitle}</h3>
              <p className={styles.packagePrice}>{pkg.packagePrice}</p>
            </div>
          ))}
        </div>

        {/* Основное содержимое таблицы */}
        {block.parts.map((part: Part, partIndex: number) => (
          <React.Fragment key={partIndex}>
            {/* Название услуги */}
            <div className={styles.partCell}>
              <h4>{part.partTitle}</h4>
            </div>
            {/* Доступность услуг в каждом пакете */}
            {block.packages.map((pkg: Package, pkgIndex: number) => {
              const isAvailable = pkg.packageItems.some(
                (item: PackageItem) =>
                  item.title === part.partTitle &&
                  item.items.some(i => i.trueOrFalse)
              );
              return (
                <div
                  key={`${partIndex}-${pkgIndex}`}
                  className={styles.packageCell}
                >
                  {isAvailable ? "✔️" : "❌"}
                </div>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

export default PricesBlockComponent;
