'use client';

import React from 'react';

import { AntdRegistry } from '@ant-design/nextjs-registry';
import { ConfigProvider, theme } from 'antd';
import { Provider } from 'react-redux';

import { store } from '@/store';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
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
          {children}
        </ConfigProvider>
      </AntdRegistry>
    </Provider>
  );
}
