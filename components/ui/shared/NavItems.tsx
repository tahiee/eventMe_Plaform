'use client'
import { headerLinks } from "@/constant";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavItems = () => {
  const pathName = usePathname();
  return (
    <div>
      <ul className="md:flex-between flex w-full flex-col gap-5 items-start md:flex-row">
        {headerLinks.map((links) => {
          const isActive = pathName == links.route;
          return (
            <li key={links.route} className={`${isActive && 'text-primary-500'} flex-center p-medium-16 whitespace-nowrap`}>
              <Link href={links.route}>{links.label}</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NavItems;
