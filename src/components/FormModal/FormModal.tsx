'use client';

import { type FC, useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Modal, Select, Form } from 'antd';
import { useForm } from 'react-hook-form';

import { ChiefSelect } from '@/components/ChiefSelect';
import { FormField } from '@/components/FormField';
import { useAllowedChiefs } from '@/components/FormModal/useAllowedManagers';
import { OpenButton } from '@/components/OpenButton';
import { roles } from '@/constants';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import type { User } from '@/models';
import { addUser, updateUser } from '@/service';
import { selectUsers } from '@/slices';
import { isChiefValid } from '@/utils';
import { userSchema, type UserFormValues } from '@/validation';

const { Option } = Select;

type FormModalProps = {
  editingUser?: User;
  onCloseAction?: () => void;
  openButton?: boolean;
};

export const FormModal: FC<FormModalProps> = ({ editingUser, onCloseAction, openButton = true }) => {
  const dispatch = useAppDispatch();

  const users = useAppSelector(selectUsers);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, reset, watch, setValue } = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '', phone: '', role: roles[0], chiefId: '' },
    mode: 'onBlur',
  });

  const currentRole = watch('role');

  const allowedManagers = useAllowedChiefs(users, currentRole, editingUser);

  useEffect(() => {
    if (editingUser) {
      reset(editingUser);

      setIsModalOpen(true);
    }
  }, [editingUser, reset]);

  const chiefId = watch('chiefId');

  useEffect(() => {
    const manager = users.find((user) => user.id === chiefId);

    if (manager && roles.indexOf(manager.role) <= roles.indexOf(currentRole)) {
      setValue('chiefId', '');
    }
  }, [currentRole, setValue, users, chiefId]);

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    reset();

    setIsModalOpen(false);

    onCloseAction?.();
  };

  const onSubmit = async (data: UserFormValues) => {
    setLoading(true);

    closeModal();

    try {
      if (editingUser) {
        await dispatch(updateUser({ ...editingUser, ...data })).unwrap();

        const subordinates = users.filter((user) => user.chiefId === editingUser.id);

        for (const sub of subordinates) {
          if (!isChiefValid(data.role, sub.role)) {
            await dispatch(updateUser({ ...sub, chiefId: '' })).unwrap();
          }
        }
      } else {
        await dispatch(addUser(data)).unwrap();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {openButton && <OpenButton onClick={openModal} loading={loading} />}
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
                {roles.map((role) => (
                  <Option key={role} value={role}>
                    {role}
                  </Option>
                ))}
              </Select>
            )}
          />
          <ChiefSelect control={control} allowedManagers={allowedManagers} currentRole={currentRole} />
        </Form>
      </Modal>
    </>
  );
};
