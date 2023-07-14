'use client';

import { User } from "@prisma/client";
import { FullConversationType } from "@/app/types";
import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import useConversation from "@/app/hooks/useConversation";
import clsx from "clsx";
import { MdOutlineGroupAdd } from 'react-icons/md';
import ConversationBox from "./ConversationBox";
import GroupChatModal from "./GroupChatModal";
import { useSession } from "next-auth/react";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface ConversationListProps {
  // 使用 Pusher 实时更新这些项目，Pusher 使用底层的套接字。
  initialItems: FullConversationType[];
  users: User[];
  // title?: string;
}

const ConversationList: React.FC<ConversationListProps> = ({ initialItems, users }) => {

  const [items, setItems] = useState(initialItems);
  const [isModalOpen, setIsModalOpen] = useState(false)

  const router = useRouter();
  const session = useSession()

  const { conversationId, isOpen } = useConversation();

  const pusherKey = useMemo(() => {
    return session.data?.user?.email;
  }, [session.data?.user?.email]);

  useEffect(() => {
    if (!pusherKey) return; // 检查我们是否有 PusherKey

    pusherClient.subscribe(pusherKey);

    const newHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        if (find(current, { id: conversation.id })) return current;
        return [conversation, ...current];
      })
    };

    const updateHandler = (conversation: FullConversationType) => {
      setItems((current) => current.map((currentConversation) => {
        // conversation.id from Pusher,  currentConversation.id from current array
        if (currentConversation.id === conversation.id) {
          return {
            ...currentConversation,
            messages: conversation.messages
          }
        }
        return currentConversation;
      }))
    };

    const removeHandler = (conversation: FullConversationType) => {
      setItems((current) => {
        return [...current.filter((convo) => convo.id !== conversation.id)]
      });

      if (conversationId === conversation.id) { // 删除会话后，跳转到会话主页
        router.push('/conversations');
      }
    };

    pusherClient.bind('conversation: new', newHandler);
    pusherClient.bind('conversation: update', updateHandler); // 选择用户后，显示最后一条消息
    pusherClient.bind('conversation: remove', removeHandler);
    

    return () => {
      pusherClient.unsubscribe(pusherKey);
      pusherClient.unbind('conversation: new', newHandler);
      pusherClient.unbind('conversation: update', updateHandler);
      pusherClient.unbind('conversation: remove', removeHandler);
    }
  }, [pusherKey, conversationId, router]);




  return (
    <>
      <GroupChatModal
        users={users}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <aside
        className={clsx(`
        fixed inset-y-0 pb-20 lg:pb-0 lg:left-20 
        lg:w-80 lg:block overflow-y-auto border-r border-gray-200
      `, isOpen ? "hidden" : "block w-full left-0")}
      >
        <div className="px-5">
          <div className="flex justify-between pt-4 mb-4">
            <div className="text-2xl font-bold text-neutral-800">消息列表</div>
            <div
              onClick={() => setIsModalOpen(true)}
              className="p-2 text-gray-600 transition bg-gray-100 rounded-full cursor-pointer hover:opacity-75"
            >
              <MdOutlineGroupAdd size={20} />
            </div>
          </div>

          {/* iteration over our items */}
          {items.map((item) => (
            <ConversationBox
              key={item.id}
              data={item}
              selected={conversationId === item.id}
            />
          ))}
        </div>
      </aside>
    </>

  )
}

export default ConversationList