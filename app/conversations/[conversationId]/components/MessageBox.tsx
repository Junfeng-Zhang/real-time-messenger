"use client";

import Avatar from "@/app/components/Avatar";
import { FullMessageType } from "@/app/types";
import clsx from "clsx";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { format } from "date-fns";
import {useState} from 'react'
import ImageModal from "./ImageModal";

interface MessageBoxProps {
  data: FullMessageType;
  isLast?: boolean;
}

const MessageBox: React.FC<MessageBoxProps> = ({ data, isLast }) => {

  const session = useSession();
  const [imageModalOpen, setImageModalOpen] = useState(false);
  

  /* 用于识别该消息是我们自己的消息还是其他用户的消息的条件应该显示该消息已被某人看到或类似的东西。 */

  /* 将当前会话电子邮件与该消息发件人的电子邮件进行比较。

  我们如何从发件人那里收到这封电子邮件？
  在 getMessages 中，因为我们在那里填充了发件人，所以发件人不会是随机 ID。 
  它实际上将是一个完整的用户模型，您也可以检查这个完整的消息类型。 正如您所看到的，
  发件人是一个用户模型，因此我们知道它应该具有电子邮件类型。*/
  const isOwn = session.data?.user?.email === data?.sender?.email;
  const seenList = (data.seen || []).filter((user) => user.email != data?.sender?.email).map((user) => user.name).join(', ');

  // 动态类 显示
  const container = clsx("flex gap-3 p-4", isOwn && 'justify-end');
  const avatar = clsx(isOwn && "order-2");
  const body = clsx("flex flex-col gap-2", isOwn && "items-end");
  const message = clsx(
    "text-sm w-fit overflow-hidden",
    isOwn ? "bg-sky-500 text-white" : "bg-gray-100",
    data.image ? "rounded-md p-0" : "rounded-full py-2 px-3"
  );

  return (
    <div className={container}>
      <div className={avatar}> <Avatar user={data.sender} /> </div>

      <div className={body}>
        <div className="flex items-center gap-1">
          <div className="text-sm text-gray-500"> {data.sender.name} </div>
          <div className="text-xs text-gray-400">
            {/* 小写显示具体时间，大写显示具体日期 */}
            {format(new Date(data.createdAt), 'p')}
          </div>
        </div>

        <div className={message}>
          <ImageModal 
            src={data.image}
            isOpen={imageModalOpen}
            onClose={() => setImageModalOpen(false)}
          />

          {data.image ? (
            <Image 
              onClick={() => setImageModalOpen(true)}
              alt="Image"
              height="288"
              width="288"
              src={data.image}
              className="object-cover transition-colors cursor-pointer hover:scale-110 translate"
            />
          ) : (
            <div>{data.body}</div>
          )}
        </div>
        {isLast && isOwn && seenList.length > 0 && (
          <div className="text-xs font-light text-gray-500">
            {`Seen by ${seenList}`}
          </div>
        )}
      </div>
    </div>
  )
}

export default MessageBox