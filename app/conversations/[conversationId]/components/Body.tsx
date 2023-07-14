"use client";

import { useEffect, useRef, useState } from "react";
import { FullMessageType } from "@/app/types";

import useConversation from "@/app/hooks/useConversation";
import MessageBox from "./MessageBox";
import axios from "axios";
import { pusherClient } from "@/app/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialMessages: FullMessageType[];
}


const Body: React.FC<BodyProps> = ({ initialMessages }) => {

  const [messages, setMessages] = useState(initialMessages);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { conversationId } = useConversation(); // 使用useConversation来提取conversationId

  useEffect(() => {
    /* 每次我们打开这个body组件或加载这个确切的页面时，我们都会发送一个帖子路由来已读最后一条消息。 */
    axios.post(`/api/conversations/${conversationId}/seen`);
  }, [conversationId]);

  useEffect(() => {
    pusherClient.subscribe(conversationId);
    bottomRef?.current?.scrollIntoView();

    //  messageHandler 它将从 The Pusher 接收新消息
    const messageHandler = (message: FullMessageType) => {
      /* 在这里输入我们设置的消息，我们将在这里访问当前的消息列表。 我们将把当前的消息列表与这个特殊的查询进行比较，
      该查询将搜索当前数组中是否有任何消息； 已经有这条新消息的 ID。 这即将到来，所以我们只是想确保在执行此功能时不会意外地发出重复的消息。
      */
      axios.post(`/api/conversations/${conversationId}/seen`);
      setMessages((current) => {
        if (find(current, { id: message.id })) return current;
        return [...current, message];
      });

      bottomRef?.current?.scrollIntoView();
    };

    /* 为了实时更新消息，到底要在消息中实时更新什么呢？
    我们更新其场景数组，因此当我在群聊中时，我希望看到实时更新。
    如果登录的人看到了我的消息，那么我希望它出现在该消息的下方。*/
    // 检测用户是否已读消息  
    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) => current.map((currentMessage) => {
        if (currentMessage.id === newMessage.id) return newMessage;

        return currentMessage;
      }))
    }

    pusherClient.bind('messages:new', messageHandler);
    pusherClient.bind('message:update', updateMessageHandler)

    return () => {
      pusherClient.unsubscribe(conversationId);
      pusherClient.unbind('messages:new', messageHandler);
      pusherClient.unbind('messages:update', updateMessageHandler);
    }
  }, [conversationId])

  return (
    <div className="flex-1 overflow-y-auto">
      {/* iteration of our messages */}
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}  // 如果 currentMessage 是最后一条消息
          key={message.id}
          data={message}
        />
      ))}
      <div ref={bottomRef} className="pt-24" />
    </div>
  )
}

export default Body