import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { FullConversationType } from "../types";
import { User } from "@prisma/client";

/* 这个钩子将帮助我们从对话中选择其他用户。 因为如果你想一想：当我们加载对话时，取决于哪个用户正在查看它们。 
我们不想将当前用户显示为我们想要向其他用户显示的对话的名称。 */

const useOtherUser = (conversation: FullConversationType | { users: User[] }) => {
  const session = useSession();

  const otherUser = useMemo(() => {
    const currentUserEmail = session.data?.user?.email;

    // 只留下不是我们当前用户的用户，这就是我们找到其他用户的方式——与当前登录的用户相反。
    const otherUser = conversation.users.filter((user) => user.email !== currentUserEmail);

    return otherUser[0];
  }, [session.data?.user?.email, conversation.users]);

  return otherUser;
};

export default useOtherUser;
