import { notFound } from "next/navigation";

// Любой адрес, для которого нет страницы, — настоящая 404 (see ../not-found.tsx)
export default function CatchAllNotFound() {
  notFound();
}
