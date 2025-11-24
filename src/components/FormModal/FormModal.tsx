'use client';

import { type FC, useEffect, useState } from 'react';

import { UserAddOutlined } from '@ant-design/icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Button, Select, Form } from 'antd';
import { useForm } from 'react-hook-form';

import { FormField } from '@/components/FormField';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import type { User } from '@/models';
import { addUser, updateUser } from '@/service';
import { userSchema, type UserFormValues } from '@/validation';

const { Option } = Select;

type FormModalProps = {
  editingUser?: User;
  onCloseAction?: () => void;
  openButton?: boolean;
};

export const FormModal: FC<FormModalProps> = ({ editingUser, onCloseAction, openButton = true }) => {
  const dispatch = useAppDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

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

      setIsModalOpen(true);
    }
  }, [editingUser, reset]);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    reset();

    setIsModalOpen(false);

    onCloseAction?.();
  };

  const onSubmit = async (data: UserFormValues) => {
    setLoading(true);

    try {
      if (editingUser) {
        await dispatch(updateUser({ ...editingUser, ...data })).unwrap();
      } else {
        await dispatch(addUser(data)).unwrap();
      }

      closeModal();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {openButton && (
        <Button size='large' type='primary' onClick={openModal} icon={<UserAddOutlined />} loading={loading}>
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
          <FormField name='name' label='Имя' control={control} placeholder='Введите имя' />
          <FormField name='email' label='Email' control={control} placeholder='Введите email' />
          <FormField name='phone' label='Телефон' control={control} placeholder='Введите телефон' />
          <FormField
            name='role'
            label='Роль'
            control={control}
            component={({ ...props }) => (
              <Select {...props}>
                <Option value='Admin'>Admin</Option>
                <Option value='User'>User</Option>
                <Option value='Manager'>Manager</Option>
              </Select>
            )}
          />
        </Form>
      </Modal>
    </>
  );
};
