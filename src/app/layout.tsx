import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study in Poland for international students - Academgo",
  description:
    "We offer full assistance in applying to universities in Poland from the moment we choose a university to the first day of your studies in it!"
};

const Layout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
