import React from 'react';

import type { NextPage } from 'next';
import { Header } from 'semantic-ui-react';

import PageHeader from '../components/PageHeader/PageHeader';

const Home: NextPage = () => {
  return (
    <>
      <PageHeader />
      <Header as={'h1'}>로그인을 넣어야 하는데 짜기 귀찮습니다</Header>
      <Header as={'h2'}>
        구글 스프레드시트가 느려서 페이지 이동이 느린데 어쩔 수 없습니다
      </Header>
    </>
  );
};

export default Home;
