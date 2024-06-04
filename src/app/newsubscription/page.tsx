"use client";

import { CreateSubscription } from "@/featueres/training-slice/createSubscription";
import { CreateTraining } from "@/featueres/training-slice/createTraining";
import ReduxProvider from "@/shared/redux/provider";
import { PageHeader } from "@/shared/ui/header-slice/pageHeader";
import { AppLayout } from "@/shared/ui/layout-slice/appLayout";
import { PageLayout } from "@/shared/ui/layout-slice/pageLayout";

import { useParams, useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  return (
    <>
      <ReduxProvider>
        <AppLayout>
          <PageHeader onBack={() => router.back()}>
            Покупка абонемента
          </PageHeader>
          <PageLayout isMargin>
            <CreateSubscription />
          </PageLayout>
        </AppLayout>
      </ReduxProvider>
    </>
  );
}
