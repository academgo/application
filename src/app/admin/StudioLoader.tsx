"use client";

import dynamic from "next/dynamic";

// Studio работает только в браузере. В Next 16 `ssr: false` разрешён
// только в клиентских компонентах, поэтому загрузка вынесена сюда.
const Studio = dynamic(() => import("./Studio"), { ssr: false });

export default function StudioLoader() {
  return <Studio />;
}
