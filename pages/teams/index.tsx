import React, { Fragment } from 'react';

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

const HIDE_COLUMN_LIST = [0, 1, 4];
const MULTILINE_COLUMN_LIST = [5, 9];

const TeamsPage: NextPage<Props> = ({ teamList, memberList }) => {
  const router = useRouter();

  const renderCell = (
    cell: { v: string | boolean } | null,
    cellIndex: number,
  ): JSX.Element => {
    if (cell === null) return <></>;
    if (!MULTILINE_COLUMN_LIST.includes(cellIndex))
      return <>{cell.v.toString()}</>;
    const elements = (cell.v as string)
      .replace(/\s/g, '')
      .split(',')
      .map((item, i) => (
        <span
          key={i}
          onClick={() =>
            cellIndex === 5
              ? router.push(`/members/${item}`)
              : cellIndex === 9
              ? router.push(`https://github.com/wafflestudio/${item}`)
              : null
          }
        >
          {cellIndex === 5
            ? `${
                memberList.table.rows.find((member) => member.c[3]?.v === item)
                  ?.c[2]?.v ?? '--------'
              } (${item})`
            : item}
          <br />
        </span>
      ));
    return React.createElement(Fragment, null, ...elements);
  };

  return (
    <>
      <PageHeader />
      <Table>
        <Table.Header>
          <Table.Row>
            {teamList.table.cols.map(
              (item, i) =>
                !HIDE_COLUMN_LIST.includes(i) && (
                  <Table.HeaderCell key={i}>{item.label}</Table.HeaderCell>
                ),
            )}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {teamList.table.rows.map((row, rowIndex) => (
            <Table.Row key={rowIndex} disabled={row.c[7]?.v === false}>
              {row.c.map(
                (cell, cellIndex) =>
                  !HIDE_COLUMN_LIST.includes(cellIndex) && (
                    <Table.Cell key={cellIndex}>
                      {renderCell(cell, cellIndex)}
                    </Table.Cell>
                  ),
              )}
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
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

export default TeamsPage;
