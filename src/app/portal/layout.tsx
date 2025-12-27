import Sidebar from "@/components/layout/Sidebar";
import { GlobalStateProvider } from "@/contexts/GlobalStateContext";
import { EventBusProvider } from "@/contexts/EventBusContext";
import { ToastContainer } from "@/components/ui";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <GlobalStateProvider>
      <EventBusProvider>
        <div className="flex min-h-screen bg-gray-950 overflow-hidden">
          <Sidebar />
          <main className="flex-1 ml-64 overflow-y-auto overflow-x-hidden">
            <div className="p-8 max-w-7xl mx-auto">{children}</div>
          </main>
          <ToastContainer />
        </div>
      </EventBusProvider>
    </GlobalStateProvider>
  );
}
