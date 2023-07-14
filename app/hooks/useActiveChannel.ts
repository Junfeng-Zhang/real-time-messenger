import { useState, useEffect } from 'react';
import useActiveList from "./useActiveList";
import { Channel, Members } from 'pusher-js';
import { pusherClient } from '../libs/pusher';

const useActiveChannel = () => {
  // 从 Zustand Store 解构这些操作。
  const { set, add, remove } = useActiveList();

  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);

  // 这将监听所有加入当前频道或离开的人的声音。

  useEffect(() => {
    let channel = activeChannel;

    if (!channel) {
      channel = pusherClient.subscribe('presence-messager')
    };
    setActiveChannel(channel);
    channel.bind('pusher:subscription_succeeded', (members: Members) => {
      const initialMembers: string[] = [];
      // members 是 Pusher 的特殊类型和类
      members.each((member: Record<string, any>) => initialMembers.push(member.id));
      set(initialMembers);
    });

    // 当用户被删除或添加时
    channel.bind("pusher:member_added", (member: Record<string, any>) => { add(member.id) });
    channel.bind("pusher:member_removed", (member: Record<string, any>) => { remove(member.id) });

    return () => {
      if (activeChannel) {
        pusherClient.unsubscribe('presence-messenger');
        setActiveChannel(null);
      }
    }

  }, [activeChannel, set, add, remove])

};

export default useActiveChannel;