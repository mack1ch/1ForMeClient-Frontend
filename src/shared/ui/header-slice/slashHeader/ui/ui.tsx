import { CSSProperties, ReactNode } from "react";
import styles from "./ui.module.scss";
export const HeadingWithSlash = ({
  children,
  style,
}: {
  children: ReactNode;
  style?: CSSProperties;
}) => {
  return (
    <>
      <h2 style={{ ...style }} className={styles.h2}>
        <span className={styles.slash}>/</span> {children}
      </h2>
    </>
  );
};
