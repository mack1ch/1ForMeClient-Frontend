import { ReactNode } from "react";
import styles from "./ui.module.scss";
import Image from "next/image";
import Message from "../../../../../../public/assets/message.png";
export const LackData = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <section className={styles.layout}>
        <Image src={Message} layout="responsive" alt="WithOutDate" />
        <h2 className={styles.h2}>{children}</h2>
      </section>
    </>
  );
};
