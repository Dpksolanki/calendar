import Image from "next/image";
import Link from "next/link";
import Logo from "../../../../public/logo.png";
import { AuthModal } from "./authModal";

export function Navbar(){
    return(
        <div className="flex py-5 items-center justify-between ">
            <Link href="/" className="flex items-center gap-2">
                <Image src={Logo} alt="logo" className="size-10" />
            <h4>Avail <span className="text-blue-500 ">Mate</span></h4>
            </Link>
            {/* <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
                <Link href="/">Sign in</Link>
            </button> */}
            <AuthModal />
        </div>
    );
}