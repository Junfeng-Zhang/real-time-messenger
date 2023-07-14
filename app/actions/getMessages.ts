import prisma from "@/app/libs/prismadb";

const getMessages = async (conversationId: string) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        conversationId: conversationId
      },
      include: {
        sender: true,
        seen: true,
      },
      /* 当我们加载消息时，默认情况下最新的消息将位于顶部。 
      但 Messenger 的工作方式并不像 Messenger 在右下角显示最新版本。 
      这就是为什么我们不使用降序，而是像这样使用升序。 */ 
      orderBy: {
        createdAt: 'asc'
      }
    });

    return messages;
  } catch (error: any) {
    return [];
  }
};

export default getMessages;