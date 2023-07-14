// 此组件在当前没有会话是显示

const EmptyState = () => {
  return (
    <div className="flex items-center justify-center h-full px-4 py-10 bg-gray-100 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <h3 className="mt-2 text-2xl font-semibold text-gray-900">
          请选择一位联系人进行新的会话
        </h3>
      </div>
    </div>
  )
}

export default EmptyState