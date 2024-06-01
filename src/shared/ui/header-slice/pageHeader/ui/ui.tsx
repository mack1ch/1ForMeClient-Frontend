"use client";

import { CSSProperties, ReactNode } from "react";
import styles from "./ui.module.scss";
import ArrowLeft from "../../../../../../public/icons/header/arrowLeft-black.svg";
import Image from "next/image";
import { HeadingWithSlash } from "../../slashHeader";

export const PageHeader = ({
  children,
  icon,
  subChildren,
  onBack,
  layout,
  isChildrenWithOutText = false,
}: {
  children: ReactNode | string;
  onBack?: () => void;
  icon?: ReactNode;
  layout?: CSSProperties["justifyContent"];
  subChildren?: ReactNode;
  isChildrenWithOutText?: boolean;
}) => {
  return (
    <>
      {subChildren ? (
        <div style={{ justifyContent: layout }} className={styles.layout}>
          <header className={styles.header}>
            {onBack && (
              <picture onClick={onBack} className={styles.icon}>
                <Image src={ArrowLeft} width={24} height={24} alt="" />
              </picture>
            )}
            <HeadingWithSlash>{children}</HeadingWithSlash>
            {icon && icon}
          </header>
          {subChildren}
        </div>
      ) : (
        <header style={{ justifyContent: layout }} className={styles.header}>
          {onBack && (
            <picture onClick={onBack} className={styles.icon}>
              <Image src={ArrowLeft} width={24} height={24} alt="" />
            </picture>
          )}
          {isChildrenWithOutText ? (
            <>{children}</>
          ) : (
            <HeadingWithSlash
              style={{ width: (isChildrenWithOutText && "100%") || "" }}
            >
              {children}
            </HeadingWithSlash>
          )}
          {icon && icon}
        </header>
      )}
    </>
  );
};
