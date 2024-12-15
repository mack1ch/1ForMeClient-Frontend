"use client";

import { CreateTraining } from "@/featueres/training-slice/createTraining";
import ReduxProvider from "@/shared/redux/provider";
import { PageHeader } from "@/shared/ui/header-slice/pageHeader";
import { AppLayout } from "@/shared/ui/layout-slice/appLayout";
import { PageLayout } from "@/shared/ui/layout-slice/pageLayout";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Suspense } from "react";

export default function Home() {
  const params = useSearchParams();
  const clubID = params.get("clubID") || "";
  const studioID = params.get("studioID") || "";
  const date = params.get("date") || "";
  const slotID = params.get("slotID") || 0;
  const trainerID = params.get("trainerID") || 0;
  const router = useRouter();

  return (
    <>
      
        <ReduxProvider>
          <AppLayout>
            <PageHeader onBack={() => router.back()}>
              Запись на тренировку
            </PageHeader>
            <PageLayout isMargin>
              <CreateTraining
                trainerID={Number(trainerID)}
                clubID={clubID}
                slotID={Number(slotID)}
                studioID={studioID}
                date={date}
              />
            </PageLayout>
          </AppLayout>
        </ReduxProvider>
      
    </>
  );
}
