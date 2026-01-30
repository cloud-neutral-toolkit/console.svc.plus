import { getDocCollections } from "./resources.server";
import DocsSidebar from "./DocsSidebar";
import UnifiedNavigation from "@components/UnifiedNavigation";
import Footer from "@components/Footer";

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const collections = await getDocCollections();

  return (
    <div className="flex min-h-screen flex-col bg-background text-text">
      <UnifiedNavigation />
      <div className="mx-auto flex w-full max-w-[1536px] items-start">
        <DocsSidebar collections={collections} />
        <main className="min-h-[calc(100vh-64px)] flex-1 overflow-x-hidden py-8 px-4 sm:px-8 lg:px-10">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
