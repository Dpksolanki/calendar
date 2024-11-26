"use client"

import { Button } from "@/components/ui/button";
import { useFormStatus } from "react-dom";
import Logo from "../../../public/github.svg";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
 
interface iAppProps {
    text: string;
    variant?: 
    "default" 
    | "destructive" 
    | "outline" 
    | "secondary" 
    | "ghost" 
    | "link" 
    | null 
    | undefined;
    className?: string;
}

export function GithubAuthButton() {
    const { pending } = useFormStatus()
    return (
        <>
            {
                pending ? (
                    <Button disabled>
                        <Loader2 className="size-4 mr-2 animate-spin" /> Please wait

                    </Button>
                ) : (
                    <Button variant = "outline" className="w-full">
                        <Image src={Logo} alt="logo" className="size-4 mr-2" />
                        Sign in with Github
                    </Button>
                )}
        </>
    )
}

export function SubmitButton({ text , variant, className }: iAppProps) {
    const {pending} = useFormStatus()

    return(
        <>
        {pending ? (<Button disabled variant='outline' className={cn("w-fit",className)}>
            <Loader2 className="size-4 mr-2 animate-spin"/> please wait
        </Button>):
        (
        <Button type="submit" variant={variant} className={cn("w-fit",className)}>{text}</Button>
        )}
        </>
    )
}