"use client"

import { cn } from "@/lib/utils";
import { CalendarCheck, HomeIcon, Settings, Users2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface iAppProps{
    id:number;
    name: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}


export const DashboardLink: iAppProps[] = [
    {
id:0,
name:'Event Types',
href: '/dashboard',
icon: HomeIcon
},
{
    id:1,
    name:'Meeting',
    href: '/dashboard/meetings',
    icon: Users2
    },
    {
        id:2,
        name:'Availability',
        href: '/dashboard/availibility',
        icon: CalendarCheck
        },
        {
            id:3,
            name:'Settings',
            href: '/dashboard/setting',
            icon: Settings
            },
]

export default function DashboardLinkComponent() {
    const pathname = usePathname();
    return(
        <>
        {DashboardLink.map((link)=>(
            <Link className={cn(
                pathname === link.href ? "text-primary bg-primary/10":
                "text-muted-foreground hover:text-foreground",
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary" 
            )} key={link.id} href={link.href}>
                <link.icon className="size-4" />
                {link.name}
            </Link>
        ))}
        </>
    )
}