import { NextResponse } from "next/server";

import getCurrentUser from "@/app/actions/getCurrentUser";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();

    const { message, image, conversationId } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    };

    const newMessage = await prisma.message.create({
      data: {
        body: message,
        image: image,
        conversation: {
          connect: { id: conversationId }
        },
        sender: {
          connect: { id: currentUser.id }
        },
        seen: {
          connect: { id: currentUser.id }
        }
      },
      include: {
        seen: true,
        sender: true
      }
    });

    // 添加 Pusher 后，需要这个端点
    const updatedConversation = await prisma.conversation.update({
      where: { id: conversationId },
      data: {
        /* 由于将新消息发送到此对话中，因此我们将更新最后一个消息添加字段。 
        因为这就是如何安排对话的方式 */
        lastMessageAt: new Date(),
        messages: {
          connect: { id: newMessage.id }
        }
      },
      include: {
        users: true,
        messages: {
          include: { seen: true }
        }
      }
    });

    await pusherServer.trigger(conversationId, 'messages:new', newMessage);

    const lastMessage = updatedConversation.messages[updatedConversation.messages.length - 1];

    updatedConversation.users.map((user) => {
      pusherServer.trigger(user.email!, 'conversation:update', {
        id: conversationId,
        messages: [lastMessage]
      });
    });

    return NextResponse.json(newMessage)

  } catch (error: any) {
    console.log(error, 'ERROR_MESSAGES');
    return new NextResponse('Internal Error', { status: 500 })
  }
}

