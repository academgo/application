import { ReactNode } from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Study in Europe, Türkiye, the UAE & Asia — AcademGo",
  description:
    "Admission support for universities in Poland, Italy, Spain, Hungary, Türkiye, the UAE, Malaysia, Georgia and Cyprus. Documents, visa and support. Free consultation.",
  other: {
    "google-site-verification": "y26kx-fqwQmu8vSsuIo8zW09MIp0pnOQNHnGFNggnmQ"
  }
};

const Layout = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default Layout;
