import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import Logo from "../../../public/logo.png"
import DashboardLink from "../components/dashboard/dashboardLink";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ThemeToggle } from "../components/dashboard/themeToggle";
import { DropdownMenu, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { signOut } from "../lib/auth";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { requireUser } from "../lib/hook";
import prisma from "../lib/db";
import { redirect } from "next/navigation";
import { Toaster } from "@/components/ui/sonner";

async function getData(userId: string){
    const data = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            userName: true,
            grantId: true,
        },
    });
    if(!data?.userName){
        return redirect('/onboarding')
    }

    if(!data?.grantId){
        return redirect('/onboarding/grand-id')
    }

    return data
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
    
    const session = await requireUser()
    await getData(session?.user?.id as string)
    return (
        <>
            <div className="min-h-screen w-full grid md:grid-cols-[220px_1fr] 
      lg:grid-cols-[280px_1fr]">
                <div className="hidden md:block border-r bg-muted/40">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-14 items-center border-b px-4 lg:h-[60px]
             lg:px-6">
                            <Link href="/" className="flex item-center gap-2">
                                <Image src={Logo} alt="Logo" className="size-8" />
                                <p className="text-xl font-bold">
                                Avail<span className="text-primary">Mate</span>
                                    {/* Logo */}
                                </p>
                            </Link>
                        </div>
                        <div className="flex-1">
                            <nav className="grid items-start px-2 lg:px-4">
                                <DashboardLink />
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col ">
                    <header className="flex h-14 item-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6" >
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button className="md:hidden shrink-0"
                            size="icon"
                            variant="outline">
                                <Menu className="size-5"/>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <nav className = "grid gap-2 mt-10">
                                <DashboardLink />
                            </nav>
                        </SheetContent>
                    </Sheet>
                    <div className="ml-auto flex items-center gap-x-4">
                        <ThemeToggle />

                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button variant="secondary" size= "icon" className= "rounded-full" >
                                    <img src={session?.user?.image as string} alt= "profie Image" width={20} height={20} 
                                    className="w-full h-full rounded-full"/>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                                <DropdownMenuSeparator>
                                    <DropdownMenuItem asChild>
                                        <Link href="/dashboard/setting">Settings</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <form className="w-full" action={async () =>
                                            {
                                                "use server"
                                                await signOut()
                                            }
                                        }>  
                                            <button className="w-full text-left">
                                                log Out
                                            </button>
                                        </form>
                                    </DropdownMenuItem>
                                </DropdownMenuSeparator>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        {children}
                    </main>
                </div>
            </div>
            <Toaster richColors closeButton/>
        </>
    )
}