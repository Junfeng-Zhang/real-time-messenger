import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";

// 这不是 API 路由，而是服务端操作
const getCurrentUser = async() => {
  try {
    const session = await getSession();

    if (!session?.user?.email) return null; // 检查当前会话是否存在
    
    // 使用该电子邮件搜索当前用户
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string
      }
    });

    if (!currentUser) return null; // 如果当前用户不存在

    return currentUser

  } catch (error:any) {
    return null;
  }
};

export default getCurrentUser;