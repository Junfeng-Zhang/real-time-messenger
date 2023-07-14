// 该组件适用于 PC 和移动设备，具体取决于屏幕的分辨率。

import getCurrentUser from "@/app/actions/getCurrentUser";
import DesktopSidebar from "./DesktopSidebar";
import MobileFooter from "./MobileFooter";

async function Sidebar({ children }: {
  children: React.ReactNode;
}) {

  const currentUser = await getCurrentUser();

  return (
    <div className="h-full">
      {/* 用户有可能为空。 */}
      <DesktopSidebar currentUser={currentUser!} />
      <MobileFooter />
      <main className="h-full lg:pl-20">
        {children}
      </main>
    </div>
  )
}

export default Sidebar;