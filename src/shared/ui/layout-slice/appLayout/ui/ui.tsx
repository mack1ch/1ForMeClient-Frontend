"use client";
import styles from "./ui.module.scss";
import { ReactNode } from "react";

import { ConfigProvider, ThemeConfig } from "antd";
import { globalContext } from "../theme";

export const AppLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <>
      <ConfigProvider theme={globalContext}>
        <div className={styles.page}>{children}</div>
      </ConfigProvider>
    </>
  );
};
