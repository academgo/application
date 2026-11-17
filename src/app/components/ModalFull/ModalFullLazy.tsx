"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useModal } from "@/app/context/ModalContext";
import { FormStandardDocument } from "@/types/formStandardDocument";
import { MessengerCtaDocument } from "@/types/homepage";
import { loadModalFull } from "./loadModalFull";

const ModalFull = dynamic(loadModalFull, { ssr: false });

type Props = {
  lang: string;
  formDocument: FormStandardDocument;
  ctaBlock?: MessengerCtaDocument | null;
  /** Своя плашка для кнопки «Оценить шансы» в шапке */
  headerCtaBlock?: MessengerCtaDocument | null;
};

/** Монтирует попап при первом открытии и дальше держит его смонтированным */
const ModalFullLazy = ({ headerCtaBlock, ...props }: Props) => {
  const { isModalOpen, modalVariant } = useModal();
  const [wasOpened, setWasOpened] = useState(false);

  if (isModalOpen && !wasOpened) setWasOpened(true);

  // Кнопка в шапке объясняет, что дальше будет бот, поэтому текст у неё
  // свой. Если отдельная плашка не заведена, берём общую
  const ctaBlock =
    modalVariant === "chances" && headerCtaBlock
      ? headerCtaBlock
      : props.ctaBlock;

  return wasOpened ? <ModalFull {...props} ctaBlock={ctaBlock} /> : null;
};

export default ModalFullLazy;
