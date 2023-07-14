'use client';

import { useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Conversation, Message, User } from "@prisma/client";
import { format } from "date-fns";
import clsx from "clsx";

import useOtherUser from "@/app/hooks/useOtherUser";
import Avatar from "@/app/components/Avatar";

import { FullConversationType } from "@/app/types";
import AvatarGroup from "@/app/components/AvatarGroup";

interface ConversationBoxProps {
  data: FullConversationType,
  selected?: boolean;
}

const ConversationBox: React.FC<ConversationBoxProps> = ({ data, selected }) => {
  const otherUser = useOtherUser(data);
  const session = useSession();
  const router = useRouter();

  const handleClick = useCallback(() => {
    router.push(`/conversations/${data.id}`)
  }, [data.id, router]);

  // 获取对话中发送的最后一条消息
  const lastMessage = useMemo(() => {
    const messages = data.messages || [];

    return messages[messages.length - 1]
  }, [data.messages]);

  const userEmail = useMemo(() => {
    return session.data?.user?.email
  }, [session.data?.user?.email]);

  // 常量，表示已看到的布尔值，无论用户是否已经看到此消息。
  const hasSeen = useMemo(() => {
  
    if (!lastMessage) return false; // 1. 检查是否存在最后一条消息。

    // 已读数组结构
    const seenArray = lastMessage.seen || []; // don't break sth accidentally, if .scene does not exist by chance

    /* 我们不能将 seenArray 与任何东西进行比较。 我们需要加载用户电子邮件，以便比较它是否在 seenArray 中 */
    if (!userEmail) return false;

    return seenArray.filter((user) => user.email === userEmail).length !== 0
  }, [userEmail, lastMessage]);

  const lastMessageText = useMemo(() => {
    // 1. 检查最后一条消息是否是图像，因为图像我们无法向用户显示任何文本。
    if (lastMessage?.image) return 'Sent an image';

    if (lastMessage?.body) return lastMessage?.body;

    return '开始聊天吧！';

  }, [lastMessage])

  return (
    <div
      onClick={handleClick}
      className={clsx(`
        w-full relative flex items-center space-x-3 p-3
        hover:bg-neutral-100 rounded-lg transition cursor-pointer
      `, selected ? 'bg-neutral-100' : 'bg-white')}
    >
      {/* 动态渲染 */}
      {data.isGroup ? (
        <AvatarGroup users={data.users}/>
      ) : (<Avatar user={otherUser} />)}

      <div className="flex-1 min-w-0">
        <div className="focus:outline-none">
          <div className="flex items-center justify-between mb-1">
            <p className="font-medium text-gray-900 text-md">
              {data.name || otherUser.name}
            </p>

            {/* 检查是否有最后一条消息 */}
            {lastMessage?.createdAt && (
              <p className="text-xs font-light text-gray-400">
                {format(new Date(lastMessage.createdAt), 'p')}
              </p>
            )}
          </div>
          <p className={clsx(`
            truncate text-sm
          `, hasSeen ? "text-gray-500" : "text-black font-medium")}>
            {lastMessageText}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ConversationBox