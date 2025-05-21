"use client";
import React from "react";
import Image from "next/image";
import Logo from "/public/images/logos/logo.svg";
import Link from "next/link";

interface FullLogoProps {
  handleClose: () => void;
}

const FullLogo = ({ handleClose } : FullLogoProps) => {
  return (
    // <Link href={"/"} onClick={handleClose}>
    //   {/* Dark Logo   */}
    //   <Image src={Logo} alt="logo" className="block dark:hidden rtl:scale-x-[-1]" />
    //   {/* Light Logo  */}
    //   <Image src={Logowhite} alt="logo" className="hidden dark:block rtl:scale-x-[-1]" />
    // </Link>
    <div className="flex items-center">
                <Image src={Logo} width={40} alt="真爱密盒" className="h-10 mr-2"/>
                <h1 className="text-[#F9DB6D] font-bold text-xl">真爱密盒<span className="text-sm ml-1 font-normal">家庭版</span></h1>
            </div>
  );
};

export default FullLogo;
