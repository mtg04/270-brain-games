import Sidebar from "@/components/Sidebar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{ display: "flex", minHeight: "100vh", background: "transparent" }}
    >
      <Sidebar />

      <main
        style={{
          flex: 1,
          padding: "2rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          minWidth: 0,
        }}
      >
        {children}
      </main>
    </div>
  );
}
