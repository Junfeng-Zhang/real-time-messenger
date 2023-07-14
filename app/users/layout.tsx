/* 我们为所有用户路线定义一个通用布局，因此该用户内的每条路线都将共享这个确切的布局。
这与我们拥有的根布局不同。
但 Root-Layout 当然也是共享的。 但我们想要的具体设计是在我们的用户页面的布局中。


*/

import getUsers from "../actions/getUser"
import Sidebar from "../components/sidebar/SideBar"

import UserList from "./components/UserList"

/* 将其创建为异步函数的原因是因为将来我们将使用此服务器组件直接从数据库获取用户。 */ 
export default async function UsersLayout({ children }: {
  children: React.ReactNode
}) {
  const users = await getUsers()
  return (
    <Sidebar>
      <div className="h-full">
        <UserList items={users} />
        {children}
      </div>
    </Sidebar>
  )
}