import bcrypt from 'bcrypt';
import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import prisma from "@/app/libs/prismadb";

// 导出非常重要，因为我们稍后需要 authOptions 来创建服务器会话
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' }
      },
      async authorize(credentials) {
        // 检查电子邮件和密码是否已从表单中传递
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        // 搜索用户
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        });

        /* 发生这种情况的情况：我们已经通过了电子邮件，并且我们已经在此注册表单中传递了密码。 
        但是我们传递的电子邮件在我们的数据库中不存在，这意味着将找不到该用户。

        为什么哈希密码不能存在？
        用户已使用 Google 或 GitHub 注册，因此尚未设置显式密码。 我们无法使用包含电子邮件和密码的注册表单来登录该用户。 
        我们能够使用凭据提供程序登录的唯一用户是在此处使用姓名、电子邮件和密码注册的用户，而不是使用 Google 或 GitHub 的用户。 
        这就是我们必须进行此检查的原因。*/
        if (!user || !user?.hashedPassword) {
          throw new Error('Invalid credentials');
        }

        // 检查用户是否输入了正确的密码
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashedPassword
        );

        // 检查密码是否错误
        if (!isCorrectPassword) {
          throw new Error('Invalid credentials');
        };

        return user;
      }
    })
  ],
  // 只有在开发环境，才会打开调试模式。在终端中，您将看到一堆有关您的身份验证状态的有用信息。
  debug: process.env.NODE_ENV === 'development',
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };