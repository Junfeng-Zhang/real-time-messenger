import {withAuth} from "next-auth/middleware";

export default withAuth({
  pages: {
    // 初始化登录页
    signIn: '/'
  }
});

// 写一个配置来保护路由 登出情况下 跳转/users  会自动跳转回登录首页
export const config = {
  matcher: [
    // 保护用户内部的所有路由。
    "/users/:path*",
    "/conversations/:path*" // 如果您在对话屏幕上，这将防止您注销。
  ]
}