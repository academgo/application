import { FC, ReactNode } from "react";

export const metadata = {
  title: "Academgo Studio",
  description: "Academgo content editor"
};

interface IRootLayout {
  children: ReactNode;
}

const RootLayout: FC<IRootLayout> = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default RootLayout;
