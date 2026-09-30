'use client';

import Link from "next/link";

export default function NotFoundPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <p style={styles.text}>Page not found</p>
      <Link href="/dashboard">
        <span style={styles.link}>Go back to Dashboard</span>
      </Link>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
  },
  title: {
    fontSize: "72px",
    fontWeight: "bold",
    color: "#111827",
    marginBottom: "16px",
  },
  text: {
    fontSize: "18px",
    color: "#6b7280",
    marginBottom: "24px",
  },
  link: {
    marginTop: "15px",
    color: "#2563eb",
    fontWeight: "bold",
    cursor: "pointer",
  },
};
