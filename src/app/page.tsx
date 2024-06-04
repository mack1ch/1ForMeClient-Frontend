"use client";

import { ScheduleRender } from "@/featueres/schedule-slice/scheduleRender";
import ReduxProvider from "@/shared/redux/provider";
import { PageHeader } from "@/shared/ui/header-slice/pageHeader";
import { HeadingWithSlash } from "@/shared/ui/header-slice/slashHeader";
import { AppLayout } from "@/shared/ui/layout-slice/appLayout";
import { PageLayout } from "@/shared/ui/layout-slice/pageLayout";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

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
              <Button
                href="/newsubscription"
                style={{ float: "right" }}
                icon={<PlusOutlined />}
                size="middle"
                type="primary"
              >
                Покупка абонемента
              </Button>
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
