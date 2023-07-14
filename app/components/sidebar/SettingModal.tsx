"use client";

import { User } from '@prisma/client';
import axios from 'axios';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import Image from 'next/image';
import Modal from '../Modal';
import Input from '../Input/Input';
import { CldUploadButton } from 'next-cloudinary';
import Button from '../Button';

interface SettingsModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: User;
}


const SettingModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, currentUser }) => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // useForm
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      image: currentUser?.image
    }
  });

  const image = watch('image'); // 定义一个自定义变量，它将观察我们的图像

  const handleUpload = (result: any) => {
    setValue('image', result?.info?.secure_url, {
      shouldValidate: true
    })
  };

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios.post('/api/settings', data).then(() => {
      router.refresh();
      onClose()
    }).catch(() => toast.error('Something went wrong')).finally(() => setIsLoading(false))
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          {/* 900/10 意味着 opacity 10 */}
          <div className="pb-12 border-b border-gray-900/10">
            <h2 className='text-base font-semibold leading-7 text-gray-900'> 个人信息 </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>更改您的信息</p>

            <div className="flex flex-col mt-10 gap-y-8">
              <Input
                disabled={isLoading}
                label="名称"
                id="name"
                errors={errors}
                required
                register={register}
              />
              <div>
                <label className='block text-sm font-medium leading-6 text-gray-900'> 图片 </label>
                <div className="flex items-center mt-2 gap-x-3">
                  <Image
                    width="48"
                    height="48"
                    className="rounded-full"
                    src={image || currentUser?.image || '/images/placeholder.jpg'}
                    alt="Avatar"
                  />
                  <CldUploadButton
                    options={{maxFiles: 1}}
                    onUpload={handleUpload}
                    uploadPreset='okif4jmz'
                  >
                    <Button disabled={isLoading} secondary type='button'>
                      更改个人头像
                    </Button>
                  </CldUploadButton>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end mt-6 gap-x-6">
            <Button disabled={isLoading} secondary onClick={onClose}> 取消 </Button>
            <Button disabled={isLoading} type='submit' onClick={onClose}> 保存 </Button>
          </div>

        </div>
      </form>
    </Modal>
  )
}

export default SettingModal;