

import prisma from "@/app/libs/prismadb";
import getCurrentUser from "./getCurrentUser";

const getConversations = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser?.id) return [];

  try {
    const conversations = await prisma.conversation.findMany({
      /* 按新对话中发送的最新消息对新对话进行排序。 所以我们不会按最新顺序订购它们。 我们将按最新活动顺序订购它们。 
      因此，如果用户在其中一个对话中发送了一条消息，那么该消息将成为我们最热门的对话 */
      orderBy: { lastMessageAt: 'desc' },

      /* 我们将加载包括当前用户在内的每一个对话，其中包括单个一对一对话和群聊，因此通过这个非常简单的查询，处理了所有这些情况 */
      where: {
        userIds: { has: currentUser.id }
      },

      include: {
        users: true,
        messages: {
          include: {
            sender: true, // sender是消息的作者
            seen: true // seen 是在观看最后一条消息的用户
          }
        }
      }
    });

    return conversations;
  } catch (error) {
    return []
  }
};

export default getConversations;