import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "TaskForge - Modern Project Management Platform",
    description: "Streamline your workflow with TaskForge. Futuristic project management with Kanban, Agile sprints, and real-time collaboration.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={jakarta.className}>{children}</body>
        </html>
    );
}
