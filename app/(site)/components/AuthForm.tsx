/* 因为要使其具有交互性，所以我们需要输入。我们将有一些按钮，一些使用效果，以及一堆不可用的东西
与服务器组件兼容。 Next13 知道这是一个客户端组件，不会将其视为服务器组件 */
"use client";

import axios from "axios";
import { BsGithub, BsGoogle } from 'react-icons/bs';

import { useCallback, useState, useEffect } from "react";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";

import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation"; // next.13
import Input from "@/app/components/Input/Input";
import Button from "@/app/components/Button";



// 定义Variant类型。 并使用这个Variant来定义 useState 的可能性
type Variant = 'LOGIN' | 'REGISTER';

const AuthForm = () => {

  const session = useSession(); // session hook
  const router = useRouter()
  const [variant, setVariant] = useState<Variant>('LOGIN');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // 当前会话状态是否已通过身份验证
    if (session?.status === 'authenticated') {
      router.push('/users');

    }
  }, [session?.status, router])


  const toggleVariant = useCallback(() => {
    // 根据variant的当前状态更改variant
    variant === 'LOGIN' ? setVariant('REGISTER') : setVariant('LOGIN')

  }, [variant]); // useCallback FN 来记住这个FN

  // 创建你的react-hook-form 提交FN && 其他FN
  const { register, handleSubmit, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  });

  // 常规邮箱注册登录
  const onSubmit: SubmitHandler<FieldValues> = (data) => { // 从react-hook-form获取数据
    setIsLoading(true);

    if (variant === 'REGISTER') {
      // Axios Register    登录&注册后跳转用户页面
      axios.post('/api/register', data)
        .then(() => signIn('credentials', data))
        .catch(() => toast.error('Something went wrong!')) // 触发错误函数
        .finally(() => setIsLoading(false))
    };

    if (variant === 'LOGIN') {
      // NextAuth Login
      signIn('credentials', {
        ...data,
        redirect: false
      }).then((callback) => {
        if (callback?.error) {
          toast.error('Invalid credentials');
        };
        if (callback?.ok && !callback?.error) {
          toast.success('Logged in!');
          router.push('/users');
        }
      }).finally(() => setIsLoading(false))
    }
  }

  // 关联平台登录
  const socialAction = (action: string) => {
    setIsLoading(true);

    // NextAuth Social Sign In
    signIn(action, { redirect: false }).then((callback) => {
      if (callback?.error) {
        toast.error('Invalid credentials')
      };
      if (callback?.ok && !callback?.error) {
        toast.success('Logged in!')
      }
    }).finally(() => setIsLoading(false))
  }


  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="px-4 py-8 bg-white shadow sm:rounded-lg sm:px-10">
        {/* remove action, because not using PHP */}
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} >
          {variant === 'REGISTER' && (
            <Input disabled={isLoading} register={register} errors={errors} required id="name" label="用户名" />
          )}
          <Input disabled={isLoading} register={register} errors={errors} required id="email" label="邮箱" type="email" />
          <Input disabled={isLoading} register={register} errors={errors} required id="password" label="密码" type="password" />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === 'LOGIN' ? '登录' : '注册'}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center ">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 text-gray-500 bg-white">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <AuthSocialButton icon={BsGithub} onClick={() => socialAction('github')} />
            <AuthSocialButton icon={BsGoogle} onClick={() => socialAction('google')} />
          </div>
        </div>
        <div
          className="flex justify-center gap-2 px-2 mt-6 text-sm text-gray-500 "
        >
          <div> {variant === 'LOGIN' ? '未注册帐户?' : '已拥有帐户'} </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === 'LOGIN' ? '新建用户' : '登录'}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;