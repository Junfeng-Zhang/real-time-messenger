
import { NextResponse } from "next/server";
import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
  conversationId?: string,
};

// delete conversation endpoint
export async function DELETE(request: Request, { params }: { params: IParams }) {

  try {

    const { conversationId } = params;
    const currentUser = await getCurrentUser();

    if (!currentUser) return new NextResponse('Unauthorized', { status: 401 });

    const existingConversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
      include: { users: true },
    });

    if (!existingConversation) return new NextResponse('Invalid ID', { status: 400 });

    const deletedConversation = await prisma.conversation.deleteMany({
      where: {
        id: conversationId,
        // 只有属于该组的用户才能删除该组
        userIds: {
          hasSome: [currentUser.id]
        }
      },
    });

    existingConversation.users.forEach((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:remove', existingConversation)
      }
    })


    return NextResponse.json(deletedConversation);

  } catch (error: any) {
    console.log(error, "ERROR_CONVERSATION_DELETE");
    return new NextResponse('Internal Error', { status: 500 })
  }
}