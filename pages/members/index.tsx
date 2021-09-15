import React from 'react';

import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Table } from 'semantic-ui-react';

import PageHeader from '../../components/PageHeader/PageHeader';
import type { GoogleSheetResponse } from '../../types/GoogleSheetResponse';

interface Props {
  teamList: GoogleSheetResponse;
  memberList: GoogleSheetResponse;
}

const HIDE_COLUMN_LIST = [0, 1, 4, 6, 7, 8];

const ADMIN_GITHUB_USERNAME_LIST = [
  'woohm402',
  'gina0605',
  'yblee2001',
  'Jhvictor4',
  'gyusang',
];

const ELSE_GITHUB_USERNAME_LIST = [
  'Hank-Choi',
  'veldic',
  'woohm402',
  'Jhvictor4',
  'JSKeum',
  'Ethan-MoBeau',
];

const MembersPage: NextPage<Props> = ({ memberList, teamList }) => {
  const router = useRouter();

  const renderCell = (cell: { v: string | boolean } | null): JSX.Element => {
    if (cell === null) return <></>;
    return <>{cell.v}</>;
  };

  const activeMemberAll = (
    teamList.table.rows
      .filter((item) => item.c[7]?.v === true)
      .map((item) => item.c[5]?.v)
      .reduce((acc, cur) => cur + ', ' + acc) as string
  )
    .replace(/\s/g, '')
    .split(',')
    .concat(ADMIN_GITHUB_USERNAME_LIST)
    .concat(ELSE_GITHUB_USERNAME_LIST);

  const activeMemberList: string[] = activeMemberAll.filter(
    (item, i) => activeMemberAll.indexOf(item) === i,
  );

  return (
    <>
      <PageHeader />
      <h1>활동회원 총원 {activeMemberList.length} 명</h1>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>순번</Table.HeaderCell>
            {memberList.table.cols.map(
              (item, i) =>
                !HIDE_COLUMN_LIST.includes(i) && (
                  <Table.HeaderCell key={i}>{item.label}</Table.HeaderCell>
                ),
            )}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {memberList.table.rows
            .filter((item) => activeMemberList.includes(item.c[3]?.v as string))
            .map((row, rowIndex) => (
              <Table.Row key={rowIndex}>
                <Table.Cell>{rowIndex + 1}</Table.Cell>
                {row.c.map(
                  (cell, cellIndex) =>
                    !HIDE_COLUMN_LIST.includes(cellIndex) && (
                      <Table.Cell key={cellIndex}>
                        {renderCell(cell)}
                      </Table.Cell>
                    ),
                )}
              </Table.Row>
            ))}
        </Table.Body>
      </Table>
      <section>
        누락:{' '}
        {activeMemberList
          .filter(
            (item) =>
              !memberList.table.rows.map((item) => item.c[3]?.v).includes(item),
          )
          .map((item, i) => (
            <p key={i}>{item}</p>
          ))}
      </section>
    </>
  );
};

export async function getServerSideProps() {
  const teamListResponse = await axios.get<string>(
    `https://docs.google.com/spreadsheets/d/${process.env.TEAM_LIST_SHEET_KEY}/gviz/tq?`,
  );

  const memberListResponse = await axios.get<string>(
    `https://docs.google.com/spreadsheets/d/${process.env.MEMBER_LIST_SHEET_KEY}/gviz/tq?`,
  );

  const tPrefixParsed = teamListResponse.data.replace(
    '/*O_o*/\ngoogle.visualization.Query.setResponse(',
    '',
  );

  const mPrefixParsed = memberListResponse.data.replace(
    '/*O_o*/\ngoogle.visualization.Query.setResponse(',
    '',
  );

  return {
    props: {
      teamList: JSON.parse(tPrefixParsed.substr(0, tPrefixParsed.length - 2)),
      memberList: JSON.parse(mPrefixParsed.substr(0, mPrefixParsed.length - 2)),
    },
  };
}

export default MembersPage;
