"use client";

import { ScheduleRender } from "@/featueres/schedule-slice/scheduleRender";
import ReduxProvider from "@/shared/redux/provider";
import { PageHeader } from "@/shared/ui/header-slice/pageHeader";
import { AppLayout } from "@/shared/ui/layout-slice/appLayout";
import { PageLayout } from "@/shared/ui/layout-slice/pageLayout";

export default function Home() {
  return (
    <>
      <ReduxProvider>
        <AppLayout>
          <PageHeader>Расписание</PageHeader>
          <PageLayout>
            <ScheduleRender />
          </PageLayout>
        </AppLayout>
      </ReduxProvider>
    </>
  );
}
