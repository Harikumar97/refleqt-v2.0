import Sidebar from "@/components/layout/Sidebar";
import { GlobalStateProvider } from "@/contexts/GlobalStateContext";
import { EventBusProvider } from "@/contexts/EventBusContext";
import { UserProvider } from "@/contexts/UserContext";
import { ToastContainer } from "@/components/ui";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <UserProvider>
      <GlobalStateProvider>
        <EventBusProvider>
          <div className="flex min-h-screen bg-slate-900 overflow-hidden">
            <Sidebar />
            <main className="flex-1 ml-64 overflow-y-auto overflow-x-hidden bg-slate-900">
              <div className="p-8 max-w-7xl mx-auto">{children}</div>
            </main>
            <ToastContainer />
          </div>
        </EventBusProvider>
      </GlobalStateProvider>
    </UserProvider>
  );
}
