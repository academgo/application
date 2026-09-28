"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useModal } from "@/app/context/ModalContext";
import { FormStandardDocument } from "@/types/formStandardDocument";
import { loadModalFull } from "./loadModalFull";

const ModalFull = dynamic(loadModalFull, { ssr: false });

type Props = {
  lang: string;
  formDocument: FormStandardDocument;
};

/** Монтирует попап при первом открытии и дальше держит его смонтированным */
const ModalFullLazy = (props: Props) => {
  const { isModalOpen } = useModal();
  const [wasOpened, setWasOpened] = useState(false);

  if (isModalOpen && !wasOpened) setWasOpened(true);

  return wasOpened ? <ModalFull {...props} /> : null;
};

export default ModalFullLazy;
