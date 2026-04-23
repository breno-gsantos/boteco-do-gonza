import { Sidebar } from "@/components/admin/sidebar";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

interface Props{
    children: React.ReactNode
}

export default async function AdminLayout({ children }: Props) {
    const user = await currentUser();

    if (!user) {
        notFound();
    }

    return (
            <Sidebar>
                {children}
            </Sidebar>
    )
}