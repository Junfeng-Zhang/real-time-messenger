"use client";

import clsx from "clsx";
import useConversation from "../hooks/useConversation";
import EmptyState from "../components/EmptyState"; // 将其重新用于右侧新对话

const Home = () => {
  const {isOpen} = useConversation();

  return (
    <div className={clsx(
      "lg:pl-80 h-full lg:block",
      isOpen ? 'block' : 'hidden'
    )}>
      <EmptyState />
    </div>
  )
};

export default Home;