import type { FC } from 'react';

import { Modal } from 'antd';

import type { User } from '@/models';

type DeleteModalProps = {
  open: boolean;
  user?: User | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export const DeleteModal: FC<DeleteModalProps> = ({ open, user, onConfirm, onCancel }) => (
  <Modal
    open={open}
    onOk={onConfirm}
    onCancel={onCancel}
    okText='Удалить'
    cancelText='Отмена'
    title='Подтверждение удаления'
  >
    Удалить пользователя <b>{user?.name}</b>?
  </Modal>
);
