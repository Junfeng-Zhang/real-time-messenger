"use client";
import { useState } from "react";
import useRoutes from "@/app/hooks/useRoutes"
import DesktopItem from "./DesktopItem";

import { User } from "@prisma/client";
import Avatar from "../Avatar";
import SettingModal from "./SettingModal";



interface DesktopSidebarProps {
  currentUser: User
}

const DesktopSidebar: React.FC<DesktopSidebarProps> = ({ currentUser }) => {
  const routes = useRoutes();
  const [isOpen, setIsOpen] = useState(false);

  console.log({ currentUser });


  return (
    <>
    <SettingModal 
      currentUser={currentUser}
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
    />
      <div
        className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 
        lg:w-20 xl:px-6 lg:overflow-y-auto lg:bg-white lg:border-r-[1px] 
        lg-pb-4 lg:flex lg:flex-col justify-between"
      >
        <nav className="flex flex-col justify-between mt-4">
          <ul role="list" className="flex flex-col items-center space-y-1">
            {/* 遍历所有路线 */}
            {routes.map((item) => (
              <DesktopItem
                key={item.label}
                href={item.href}
                label={item.label}
                icon={item.icon}
                active={item.active}
                onClick={item.onClick}
              />
            ))}
          </ul>
        </nav>

        <nav className="flex flex-col items-center justify-between mt-4">
          <div
            onClick={() => setIsOpen(true)}
            className="transition cursor-pointer hover:opacity-75"
          >
            <Avatar user={currentUser} />
          </div>
        </nav>
      </div>
    </>

  )
}

export default DesktopSidebar