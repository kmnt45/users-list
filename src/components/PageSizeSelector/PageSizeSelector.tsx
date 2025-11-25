import type { FC } from 'react';

import { InputNumber } from 'antd';

type PageSizeSelectorProps = {
  pageSize: number;
  onChange: (value: number | null) => void;
};

export const PageSizeSelector: FC<PageSizeSelectorProps> = ({ pageSize, onChange }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10 }}>
    <span>Записей на странице:</span>
    <InputNumber min={1} max={100} value={pageSize} onChange={onChange} style={{ width: 70 }} />
  </div>
);
