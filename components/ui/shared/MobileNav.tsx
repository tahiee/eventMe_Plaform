import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Image from "next/image";
import { Separator } from "../separator";
import NavItems from "./NavItems";

const MobileNav = () => {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger className="align-middle">
          <Image
            alt="menu"
            src="/assets/icons/menu.svg"
            width={24}
            height={24}
            className="cursor-pointer"
          ></Image>
        </SheetTrigger>
        <SheetContent className="flex flex-col gap-5 md:hidden bg-white">
          <Image
            alt="logo"
            src="/assets/images/logo2.png"
            height={38}
            width={128}
          />
          <Separator className="border border-gray-300" />
          <NavItems/> 
        </SheetContent>
      </Sheet>
    </nav>
  );
};

export default MobileNav;
