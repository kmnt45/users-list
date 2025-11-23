import type { FC } from 'react';

import { FormModal } from '@/components/FormModal';
import { Header } from '@/components/Header';

import styles from './page.module.scss';

const Home: FC = () => {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <Header title='Список пользователей' />
        <FormModal />
      </div>
    </main>
  );
};

export default Home;
