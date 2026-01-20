import dynamicImport from "next/dynamic";

export const dynamic = "force-static";

const Studio = dynamicImport(() => import("../Studio"), { ssr: false });

export default function StudioCatchAllPage() {
  return <Studio />;
}
