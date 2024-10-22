// components/SliderBlockComponent.tsx
import React from "react";
import SliderMain from "../SliderMain/SliderMain";
import { SliderBlock } from "@/types/blog";
import SlideFull from "../SlideFull/SlideFull";

type Props = {
  block: SliderBlock;
};

const SliderBlockComponent: React.FC<Props> = ({ block }) => {
  return (
    <section>
      <SliderMain>
        {block.slides.map((slide, index) => (
          <SlideFull
            key={index}
            image={slide.image}
            title={slide.title}
            description={slide.description}
            subTitle={slide.subTitle}
            sliderList={slide.sliderList}
            semesters={slide.semesters}
            cost={slide.cost}
            universitiesTitle={slide.universitiesTitle}
            universities={slide.universities}
            linkLabel={slide.linkLabel}
            linkDestination={slide.linkDestination}
            hasBorder={slide.hasBorder}
          />
        ))}
      </SliderMain>
    </section>
  );
};

export default SliderBlockComponent;
