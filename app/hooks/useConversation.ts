// 这个钩子处理用户在线对话。

import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConversation = () => {
  const params = useParams();

  const conversationId = useMemo(() => {
    // 将在这些参数中搜索对话 ID。
    if (!params?.conversationId) {
      return ''
    }

    return params.conversationId as string
  }, [params?.conversationId]);

  // 两个感叹号 turn this string into Boolean
  const isOpen = useMemo(() => !!conversationId, [conversationId]);

  return useMemo(() => ({ isOpen, conversationId }), [isOpen, conversationId]); // 结果被记住
}



export default useConversation;