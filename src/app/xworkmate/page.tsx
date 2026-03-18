export const dynamic = "force-dynamic";

import { Suspense } from "react";

import { XWorkmateLoading } from "@/app/xworkmate/XWorkmateLoading";
import { XWorkmateWorkspacePage } from "@/components/xworkmate/XWorkmateWorkspacePage";
import {
  buildXWorkmateScopeKey,
} from "@/lib/xworkmate/types";
import { getConsoleIntegrationDefaults } from "@/server/consoleIntegrations";

export const metadata = {
  title: "XWorkmate",
  description: "Online XWorkmate workspace powered by OpenClaw gateway",
};

export default async function XWorkmatePage() {
  const defaults = getConsoleIntegrationDefaults();
  const scopeKey = buildXWorkmateScopeKey(null, null);

  return (
    <div className="h-[calc(100vh-var(--app-shell-nav-offset))] w-full">
      <Suspense fallback={<XWorkmateLoading />}>
        <XWorkmateWorkspacePage
          defaults={defaults}
          scopeKey={scopeKey}
        />
      </Suspense>
    </div>
  );
}
