# 项目指南

### 获取项目源码

```shell
git clone https://github.com/Junfeng-Zhang/real-time-messenger.git
```

### 安装依赖

```shell
npm i
```

### 设置环境变量 在根目录下 添加 .env


```js
DATABASE_URL=
NEXTAUTH_SECRET=

NEXT_PUBLIC_PUSHER_APP_KEY=
PUSHER_APP_ID=
PUSHER_SECRET=

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=

GITHUB_ID=
GITHUB_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### 设置 Prisma

添加 MongoDB 数据库

```shell
npx prisma db push
```

### 启动项目

```shell
npm run dev
```

## 项目截图
![登录页](https://github.com/Junfeng-Zhang/real-time-messenger/assets/60849891/ca581e28-8419-4fdb-bbf4-a6b3a7d6cc85)
![通讯录](https://github.com/Junfeng-Zhang/real-time-messenger/assets/60849891/66e7517c-19c2-4cc8-8ae9-5ccac4b421b5)
![消息列表](https://github.com/Junfeng-Zhang/real-time-messenger/assets/60849891/3a4f90e1-2b72-463c-8e65-f47ff60d5b33)
![更改资料](https://github.com/Junfeng-Zhang/real-time-messenger/assets/60849891/0908c04f-6395-43f2-bc9b-7f3e7c11a2a4)
![在线 离线](https://github.com/Junfeng-Zhang/real-time-messenger/assets/60849891/f1947a8e-fd9a-4f7a-84bb-06ecda549d29)
![群聊](https://github.com/Junfeng-Zhang/real-time-messenger/assets/60849891/b453f86b-ed9e-41a5-89ee-0ca3eb415f66)
