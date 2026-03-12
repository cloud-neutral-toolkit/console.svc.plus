import { Suspense } from "react";

import { XWorkmateWorkspacePage } from "@/components/xworkmate/XWorkmateWorkspacePage";
import { getConsoleIntegrationDefaults } from "@/server/consoleIntegrations";

export const metadata = {
  title: "XWorkmate",
  description: "Online XWorkmate workspace powered by OpenClaw gateway",
};

export default function XWorkmatePage() {
  const defaults = getConsoleIntegrationDefaults();

  return (
    <div className="h-[calc(100vh-var(--app-shell-nav-offset))] w-full p-4">
      <Suspense
        fallback={
          <div className="flex h-full items-center justify-center">
            Loading XWorkmate...
          </div>
        }
      >
        <XWorkmateWorkspacePage defaults={defaults} />
      </Suspense>
    </div>
  );
}
