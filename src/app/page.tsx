"use client";

import { ScheduleRender } from "@/featueres/schedule-slice/scheduleRender";
import ReduxProvider from "@/shared/redux/provider";
import { PageHeader } from "@/shared/ui/header-slice/pageHeader";
import { HeadingWithSlash } from "@/shared/ui/header-slice/slashHeader";
import { AppLayout } from "@/shared/ui/layout-slice/appLayout";
import { PageLayout } from "@/shared/ui/layout-slice/pageLayout";
import Image from "next/image";
import ProductLogo from "../../public/assets/1formeLogo.png";
export default function Home() {
  return (
    <>
      <ReduxProvider>
        <AppLayout>
          <PageHeader isChildrenWithOutText>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <HeadingWithSlash>Расписание</HeadingWithSlash>
              <Image width={84} height={24} src={ProductLogo} alt="1ForMe" />
            </div>
          </PageHeader>
          <PageLayout>
            <ScheduleRender />
          </PageLayout>
        </AppLayout>
      </ReduxProvider>
    </>
  );
}
