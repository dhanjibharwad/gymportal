// app/(admin)/layout.tsx
import ReceptionSidebar from "@/components/reception/ReceptionSidebar";
import ReceptionHeader from "@/components/reception/ReceptionHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <ReceptionSidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <ReceptionHeader />
        <main className="p-3 sm:p-4 lg:p-6 flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}