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
          <div className="min-h-screen bg-slate-900">
            <main className="w-full overflow-y-auto bg-slate-900">
              <div className="p-8 max-w-7xl mx-auto">{children}</div>
            </main>
            <ToastContainer />
          </div>
        </EventBusProvider>
      </GlobalStateProvider>
    </UserProvider>
  );
}
