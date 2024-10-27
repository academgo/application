import { SliderPicturesBlock } from "@/types/blog";
import React, { FC } from "react";
import SliderMain from "../SliderMain/SliderMain";
import SlidePicture from "../SlidePicture/SlidePicture";

type Props = {
  block: SliderPicturesBlock;
};

const SliderPictureBlockComponent: FC<Props> = ({ block }) => {
  return (
    <section>
      <SliderMain>
        {block.slides.map((slide, index) => (
          <SlidePicture
            key={index}
            image={slide.image}
            alt={slide.alt}
            title={slide.title}
          />
        ))}
      </SliderMain>
    </section>
  );
};

export default SliderPictureBlockComponent;
