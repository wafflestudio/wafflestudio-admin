import React from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';
import { Menu } from 'semantic-ui-react';
import styled from 'styled-components';

const PageHeaderWrapper = styled.header`
  height: 60px;
  display: flex;
  justify-content: space-between;
`;

const WaffleLogo = styled(Image)`
  margin-top: 10px;
`;

const PageHeader: React.FC = () => {
  const router = useRouter();
  return (
    <PageHeaderWrapper>
      <WaffleLogo
        src={
          'https://wafflestudio.com/_next/image?url=%2Fimages%2Ficon_intro.svg&w=256&q=75'
        }
        width={40}
        height={40}
      />
      <Menu>
        <Menu.Item onClick={() => router.push('/teams')}>팀 목록</Menu.Item>
        <Menu.Item onClick={() => router.push('/members')}>회원 목록</Menu.Item>
      </Menu>
    </PageHeaderWrapper>
  );
};

export default PageHeader;
