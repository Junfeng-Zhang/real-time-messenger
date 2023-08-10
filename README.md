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

