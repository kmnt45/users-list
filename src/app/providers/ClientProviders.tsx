'use client';
import React from 'react';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, theme } from 'antd';
import { Provider } from 'react-redux';

import { store } from '@/store';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: { colorPrimary: '#722ed1' },
          components: {
            Typography: {
              titleMarginBottom: '0',
            },
          },
        }}
      >
        <Provider store={store}>{children}</Provider>
      </ConfigProvider>
    </AntdRegistry>
  );
}
