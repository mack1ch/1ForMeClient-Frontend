import styles from "./ui.module.scss";
import { ReactNode } from "react";

export const PageLayout = ({
  children,
  isMargin = false,
}: Readonly<{
  children: ReactNode;
  isMargin?: boolean;
}>) => {
  return (
    <>
      <main
        style={{ marginTop: isMargin ? "12px" : "" }}
        className={styles.page}
      >
        {children}
      </main>
    </>
  );
};
