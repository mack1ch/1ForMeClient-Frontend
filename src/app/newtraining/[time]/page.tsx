"use client";

import { CreateTraining } from "@/featueres/training-slice/createTraining";
import ReduxProvider from "@/shared/redux/provider";
import { PageHeader } from "@/shared/ui/header-slice/pageHeader";
import { AppLayout } from "@/shared/ui/layout-slice/appLayout";
import { PageLayout } from "@/shared/ui/layout-slice/pageLayout";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function Home() {
  const params = useParams<{ time: string }>();
  const router = useRouter();
  return (
    <>
      <ReduxProvider>
        <AppLayout>
          <PageHeader onBack={() => router.back()}>Запись</PageHeader>
          <PageLayout isMargin>
            <CreateTraining time={params.time} />
          </PageLayout>
        </AppLayout>
      </ReduxProvider>
    </>
  );
}
