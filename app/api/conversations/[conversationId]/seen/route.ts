import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId?: string,
};

export async function POST(request: Request, { params }: { params: IParams }) {
  try {
    const currentUser = await getCurrentUser();
    const { conversationId } = params;

    if (!currentUser?.id || !currentUser?.email) return new NextResponse('Unauthorized', { status: 401 });

    // 查找现有对话
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: {
          include: { seen: true }
        },
        users: true,
      }
    });

    // 检查是否成功获取此对话
    if (!conversation) return new NextResponse('Invalid ID', { status: 400 });

    // 通过现有消息查找最后一条消息。
    const lastMessage = conversation.messages[conversation.messages.length - 1];

    if (!lastMessage) return NextResponse.json(conversation);

    // 更新已读的最后一条消息
    const updatedMessage = await prisma.message.update({
      where: { id: lastMessage.id },
      include: { sender: true, seen: true },
      data: {
        seen: {
          connect: {
            id: currentUser.id
          }
        }
      }
    });

    // 更新所有连接用户的已读
    await pusherServer.trigger(currentUser.email, 'conversation:update', {
      id: conversationId,
      messages: [updatedMessage]
    });

    // 如果用户已读该消息，则无需进一步操作
    if (lastMessage.seenIds.indexOf(currentUser.id) !== -1) {
      return NextResponse.json(conversation);
    }

    // 更新最后已读
    await pusherServer.trigger(conversationId!, 'message:update', updatedMessage);

    return NextResponse.json(updatedMessage);

  } catch (error: any) {
    console.log(error, 'ERROR_MESSAGES_SEEN');
    return new NextResponse('Error', { status: 500 });
  }
}