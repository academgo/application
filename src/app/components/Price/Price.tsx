import React, { FC } from "react";
import styles from "./Price.module.scss";
import { PriceBlock } from "@/types/homepage";
import SliderMain from "../SliderMain/SliderMain";
import PriceSlide from "../PriceSlide/PriceSlide";

type Props = {
  priceTitle: string;
  priceBlock: PriceBlock[];
};

const Price: FC<Props> = ({ priceTitle, priceBlock }) => {
  return (
    <section className={styles.price} id="price">
      <div className="container">
        <p className={styles.title}>{priceTitle}</p>
        <SliderMain slidesPerView={3} uniqueId="price-slider">
          {priceBlock.map((priceBlock, index) => (
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

export default Price;
