import getCurrentUser from "@/app/actions/getCurrentUser";

import { NextResponse } from "next/server";

import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

export async function POST(request: Request) {

  try {
    const currentUser = await getCurrentUser();
    const body = await request.json();
    /* 我们将解构创建新对话时可以发送的所有可能的属性。 如果我们要创建一对一的对话，则需要用户 ID。 但如果我们要创建一个组
    我们还需要成员，并且需要该群聊的名称。 因为如果我们只使用用户 ID，那么每个用户的聊天名称都会不同。 
    
    */
    const { userId, isGroup, members, name } = body;

    if (!currentUser?.id || !currentUser?.email) {
      return new NextResponse('Unauthorized', { status: 401 });
    };

    if (isGroup && (!members || members.length < 2 || !name)) {
      return new NextResponse('Invalid data', { status: 400 });
    };

    // 创建群聊的代码
    if (isGroup) {
      const newConversation = await prisma.conversation.create({
        data: {
          name, isGroup, users: {
            connect: [
              ...members.map((member: { value: string }) => ({
                id: member.value
              })),
              // 单独添加当前用户组的成员
              { id: currentUser.id }
            ]
          }
        },
        /*当我们获取对话时，它会填充用户。 因此，默认情况下，当您进行新对话时，您不会获得该群聊内用户的对象数组，您只会获得 ID。
         但是，如果您想与这些用户一起工作，例如显示他们的图像或显示他们的姓名，则需要在 Prisma 中填充它们。 
         我们使用 include 我们想要填充的字段和 true 来做到这一点，如下所示。*/
        include: { users: true }
      });

      // 用新对话更新所有连接
      newConversation.users.forEach((user) => {
        if (user.email) {
          pusherServer.trigger(user.email, 'conversation:new', newConversation);
        }
      })

      return NextResponse.json(newConversation);
    };

    /* 单个一对一对话创建
    注意：对于单个一对一对话，我们必须检查是否存在与该用户的现有对话。

    为什么使用 findMany 而不是使用 findUnique ？
    因为将使用一个特殊的查询，不幸的是，该查询仅在 findMany 中受支持。  */

    const existingConversations = await prisma.conversation.findMany({
      where: {
        OR: [
          {
            userIds: { equals: [currentUser.id, userId] }
          },
          {
            userIds: { equals: [userId, currentUser.id] }
          },

        ]
      }
    });

    const singleConversation = existingConversations[0];
    if (singleConversation) return NextResponse.json(singleConversation);

    const newConversation = await prisma.conversation.create({
      data: {
        users: {
          connect: [
            { id: currentUser.id },
            { id: userId }
          ]
        }
      },
      include: { users: true }
    });

    // 用新对话更新所有连接
    newConversation.users.map((user) => {
      if (user.email) {
        pusherServer.trigger(user.email, 'conversation:new', newConversation);
      }
    });

    return NextResponse.json(newConversation);

  } catch (error: any) {
    return new NextResponse('Internal Error', { status: 500 })
  }
}