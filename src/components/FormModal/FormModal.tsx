'use client';

import { type FC, useEffect, useState } from 'react';

import { UserAddOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, Input, Select, Form } from 'antd';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { addUser, updateUser } from '@/asyncThunks';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import type { User } from '@/models';

const { Option } = Select;

const userSchema = z.object({
  name: z.string().min(2, { message: 'Имя должно содержать минимум 2 символа' }),
  email: z.string().email({ message: 'Введите корректный email' }),
  phone: z.string().regex(/^(\+7|7|8)?[\s-]?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}$/, {
    message: 'Введите корректный телефонный номер',
  }),
  role: z.enum(['Admin', 'User', 'Manager'] as const),
});

type UserFormValues = z.infer<typeof userSchema>;

type FormModalProps = {
  editingUser?: User;
  onCloseAction?: () => void;
  openButton?: boolean;
};

export const FormModal: FC<FormModalProps> = ({
  editingUser,
  onCloseAction,
  openButton = true,
}) => {
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const { control, handleSubmit, reset } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'User',
    },
    mode: 'onBlur',
  });

  useEffect(() => {
    if (editingUser) {
      reset(editingUser);

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsModalOpen(true);
    }
  }, [editingUser, reset]);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    reset();

    setIsModalOpen(false);

    onCloseAction?.();
  };

  const onSubmit = (data: UserFormValues) => {
    if (editingUser) {
      dispatch(updateUser({ ...editingUser, ...data }));
    } else {
      dispatch(addUser(data));
    }

    closeModal();
  };

  return (
    <>
      {openButton && (
        <Button size='large' type='primary' onClick={openModal} icon={<UserAddOutlined />}>
          Добавить пользователя
        </Button>
      )}
      <Modal
        title={editingUser ? 'Редактировать пользователя' : 'Добавить пользователя'}
        open={isModalOpen}
        onOk={handleSubmit(onSubmit)}
        onCancel={closeModal}
        okText={editingUser ? 'Сохранить' : 'Добавить'}
        cancelText='Отмена'
      >
        <Form layout='vertical'>
          <Controller
            name='name'
            control={control}
            render={({ field, fieldState }) => (
              <Form.Item
                label='Имя'
                validateStatus={fieldState.error ? 'error' : ''}
                help={fieldState.error?.message}
              >
                <Input {...field} placeholder='Введите имя' />
              </Form.Item>
            )}
          />
          <Controller
            name='email'
            control={control}
            render={({ field, fieldState }) => (
              <Form.Item
                label='Email'
                validateStatus={fieldState.error ? 'error' : ''}
                help={fieldState.error?.message}
              >
                <Input {...field} placeholder='Введите email' />
              </Form.Item>
            )}
          />
          <Controller
            name='phone'
            control={control}
            render={({ field, fieldState }) => (
              <Form.Item
                label='Телефон'
                validateStatus={fieldState.error ? 'error' : ''}
                help={fieldState.error?.message}
              >
                <Input {...field} placeholder='Введите телефон' />
              </Form.Item>
            )}
          />
          <Controller
            name='role'
            control={control}
            render={({ field, fieldState }) => (
              <Form.Item
                label='Роль'
                validateStatus={fieldState.error ? 'error' : ''}
                help={fieldState.error?.message}
              >
                <Select {...field} placeholder='Выберите роль'>
                  <Option value='Admin'>Admin</Option>
                  <Option value='User'>User</Option>
                  <Option value='Manager'>Manager</Option>
                </Select>
              </Form.Item>
            )}
          />
        </Form>
      </Modal>
    </>
  );
};
