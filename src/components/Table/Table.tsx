'use client';

import { type FC, useEffect, useState } from 'react';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table as AntTable, Button, Space } from 'antd';

import { fetchUsers, deleteUser } from '@/asyncThunks';
import { FormModal } from '@/components/FormModal';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import type { User } from '@/models';

export const Table: FC = () => {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((state) => state.users);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(deleteUser(id));
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id' },
    { title: 'Имя', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Телефон', dataIndex: 'phone', key: 'phone' },
    { title: 'Роль', dataIndex: 'role', key: 'role' },
    {
      title: 'Действия',
      key: 'actions',
      render: (_: unknown, record: User) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => setEditingUser(record)} type='default' />
          <Button icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)} danger />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <AntTable
        rowKey='id'
        columns={columns}
        dataSource={[...users].reverse()}
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      {editingUser && (
        <FormModal editingUser={editingUser} onCloseAction={() => setEditingUser(null)} openButton={false} />
      )}
    </div>
  );
};
