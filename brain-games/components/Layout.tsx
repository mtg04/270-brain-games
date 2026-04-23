import Sidebar from "@/components/Sidebar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0f172a" }}>
      <Sidebar />

      <main
        style={{
          flex: 1,
          padding: "2rem",
          display: "flex",
          justifyContent: "center",
          width: "100%",
        }}
      >
        {children}
      </main>
    </div>
  );
}
