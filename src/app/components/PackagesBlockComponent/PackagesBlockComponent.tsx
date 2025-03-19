import React, { FC } from "react";
import styles from "./PackagesBlockComponent.module.scss";
import SliderMain from "../SliderMain/SliderMain";
import PriceSlide from "../PriceSlide/PriceSlide";
import { PackagesBlock } from "@/types/blog";

type Props = {
  block: PackagesBlock;
};

const PackagesBlockComponent: FC<Props> = ({ block }) => {
  return (
    <section className={styles.price}>
      <div className="container">
        <p className={styles.title}>{block.title}</p>
        <SliderMain slidesPerView={3} uniqueId="price-slider">
          {block.priceBlock.map((priceBlock, index) => (
            <PriceSlide
              key={index}
              preTitle={priceBlock.preTitle}
              title={priceBlock.title}
              itemsTitle={priceBlock.itemsTitle}
              items={priceBlock.items}
              cost={priceBlock.cost}
              stageCost={priceBlock.stageCost}
              buttonText={priceBlock.buttonText}
              buttonLink={priceBlock.buttonLink}
              hasBorder={priceBlock.hasBorder}
              hasBg={priceBlock.hasBg}
            />
          ))}
        </SliderMain>
      </div>
    </section>
  );
};

export default PackagesBlockComponent;
