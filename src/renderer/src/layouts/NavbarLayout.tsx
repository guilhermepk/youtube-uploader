import Navbar from "@renderer/components/Navbar";
import { Outlet } from "react-router-dom";

export default function NavbarLayout(): React.JSX.Element {
  return (
    <div className="h-screen w-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}