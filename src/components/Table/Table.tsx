'use client';

import { type FC, useEffect, useState } from 'react';

import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Table as AntTable, Button, Space, Tooltip, InputNumber } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import { FormModal } from '@/components/FormModal';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useAppSelector } from '@/hooks/useAppSelector';
import type { User } from '@/models';
import { fetchUsers, deleteUser } from '@/service';
import { selectLoading, selectUsersReversed } from '@/slices';

export const Table: FC = () => {
  const dispatch = useAppDispatch();

  const users = useAppSelector(selectUsersReversed);

  const loading = useAppSelector(selectLoading);

  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [pageSize, setPageSize] = useState(10);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchUsers());
  }, []);

  const handleDelete = (id: number) => () => {
    dispatch(deleteUser(id));
  };

  const handleClose = () => {
    setEditingUser(null);
  };

  const handleEdit = (user: User) => () => setEditingUser(user);

  const handlePageChange = (page: number, size?: number) => {
    setCurrentPage(page);

    if (size) setPageSize(size);
  };

  const handlePageSizeChange = (value: number | null) => {
    setPageSize(value || 1);

    setCurrentPage(1);
  };

  const columns: ColumnsType<User> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
      showSorterTooltip: false,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      width: 150,
      ellipsis: { showTitle: false },
      showSorterTooltip: false,
      render: (name) => <Tooltip title={name}>{name}</Tooltip>,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 200,
      ellipsis: { showTitle: false },
      showSorterTooltip: false,
      render: (email) => <Tooltip title={email}>{email}</Tooltip>,
      sorter: (a, b) => a.email.localeCompare(b.email),
      filters: Array.from(new Set(users.map((u) => u.email.split('@')[1]))).map((domain) => ({
        text: domain,
        value: domain,
      })),
      onFilter: (value, record) => record.email.endsWith(value as string),
    },
    {
      title: 'Телефон',
      dataIndex: 'phone',
      key: 'phone',
      width: 140,
      ellipsis: { showTitle: false },
      showSorterTooltip: false,
      render: (phone) => <Tooltip title={phone}>{phone}</Tooltip>,
      sorter: (a, b) => a.phone.localeCompare(b.phone),
      filters: [
        { text: '+7', value: '+7' },
        { text: '8', value: '8' },
      ],
      onFilter: (value, record) => record.phone.startsWith(value as string),
    },
    {
      title: 'Роль',
      dataIndex: 'role',
      key: 'role',
      width: 100,
      ellipsis: { showTitle: false },
      showSorterTooltip: false,
      render: (role) => <Tooltip title={role}>{role}</Tooltip>,
      sorter: (a, b) => a.role.localeCompare(b.role),
      filters: Array.from(new Set(users.map((user) => user.role))).map((role) => ({ text: role, value: role })),
      onFilter: (value, record) => record.role === value,
    },
    {
      title: 'Действия',
      key: 'actions',
      width: 120,
      render: (_, record: User) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={handleEdit(record)} type='default' />
          <Button icon={<DeleteOutlined />} onClick={handleDelete(record.id)} danger />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <AntTable
        rowKey='id'
        columns={columns}
        dataSource={users}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize,
          showSizeChanger: false,
          total: users.length,
          onChange: handlePageChange,
        }}
        scroll={{ x: '100%' }}
        footer={() => (
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
            <span>Записей на странице:</span>
            <InputNumber min={1} max={100} value={pageSize} onChange={handlePageSizeChange} style={{ width: 70 }} />
          </div>
        )}
      />

      {editingUser && <FormModal editingUser={editingUser} onCloseAction={handleClose} openButton={false} />}
    </div>
  );
};
