"use client";

import Avatar from "@/app/components/Avatar";
import useOtherUser from "@/app/hooks/useOtherUser";
import { Conversation, User } from "@prisma/client";
import Link from "next/link";
import { useState, useMemo } from "react";
import { HiChevronLeft, HiEllipsisHorizontal } from 'react-icons/hi2';
import ProfileDrawer from "./ProfileDrawer";
import AvatarGroup from "@/app/components/AvatarGroup";
import useActiveList from "@/app/hooks/useActiveList";


interface HeaderProps {
  conversation: Conversation & {
    users: User[]
  }
}

const Header: React.FC<HeaderProps> = ({ conversation }) => {
  
  const otherUser = useOtherUser(conversation); // 在标题中显示用户名

  const [drawerOpen, setDrawerOpen] = useState(false); // 控制按钮的状态

  const { members } = useActiveList();
  const isActive = members.indexOf(otherUser?.email!) !== -1;

  // 定义状态文本
  const statusText = useMemo(() => {
    if (conversation.isGroup) return `${conversation.users.length} members`;

    return isActive ? '在线' : '离线'; // 判断用户是否在线
  }, [conversation, isActive])

  return (
    <>
      <ProfileDrawer
        data={conversation}
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div className="bg-white w-full flex border-b-[1px] sm:px-4 py-3 px-4 lg:px-6 justify-between items-center shadow-sm">
        <div className="flex items-center gap-3">
          {/* 移动端显示 */}
          <Link href="/conversations" className="block transition cursor-pointer lg:hidden text-sky-500 hover:text-sky-600">
            <HiChevronLeft size={32} />
          </Link>

          {conversation.isGroup ? (
            <AvatarGroup users={conversation.users} />
          ) : (<Avatar user={otherUser} />)}


          <div className="flex flex-col">
            <div> {conversation.name || otherUser.name} </div>
            <div className="text-sm font-light text-neutral-500">{statusText}</div>
          </div>
        </div>

        <HiEllipsisHorizontal
          size={32}
          onClick={() => setDrawerOpen(true)}
          className="transition cursor-pointer text-sky-500 hover:text-sky-600"
        />
      </div>
    </>
  )
}

export default Header