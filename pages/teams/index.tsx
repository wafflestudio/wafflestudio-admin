import React, { Fragment } from 'react';

import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Table } from 'semantic-ui-react';
import styled from 'styled-components';

import { TEAM_LIST_SHEET_KEY } from '../../constants/google-spreadsheet';
import type { GoogleSheetResponse } from '../../types/GoogleSheetResponse';

interface Props {
  data: GoogleSheetResponse;
}

const HIDE_COLUMN_LIST = [0, 4];
const MULTILINE_COLUMN_LIST = [5, 9];

const TeamsPage: NextPage<Props> = ({ data }) => {
  const router = useRouter();

  const renderCell = (
    cell: { v: string | boolean } | null,
    cellIndex: number,
  ): JSX.Element => {
    if (cell === null) return <></>;
    if (!MULTILINE_COLUMN_LIST.includes(cellIndex)) return <>{cell.v}</>;
    const elements = (cell.v as string)
      .replace(/\s/g, '')
      .split(',')
      .map((item, i) => (
        <span
          key={i}
          onClick={() =>
            cellIndex === 5
              ? router.push(`/users/${item}`)
              : cellIndex === 9
              ? router.push(`https://github.com/wafflestudio/${item}`)
              : null
          }
        >
          {item}
          <br />
        </span>
      ));
    return React.createElement(Fragment, null, ...elements);
  };

  return (
    <Table>
      <Table.Header>
        <Table.Row>
          {data.table.cols.map(
            (item, i) =>
              !HIDE_COLUMN_LIST.includes(i) && (
                <Table.HeaderCell key={i}>{item.label}</Table.HeaderCell>
              ),
          )}
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {data.table.rows.map((row, rowIndex) => (
          <Table.Row key={rowIndex}>
            {row.c.map(
              (cell, cellIndex) =>
                !HIDE_COLUMN_LIST.includes(cellIndex) && (
                  <Cell key={cellIndex}>{renderCell(cell, cellIndex)}</Cell>
                ),
            )}
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export async function getServerSideProps() {
  const res = await axios.get<string>(
    `https://docs.google.com/spreadsheets/d/${TEAM_LIST_SHEET_KEY}/gviz/tq?`,
  );

  const prefixParsed = res.data.replace(
    '/*O_o*/\ngoogle.visualization.Query.setResponse(',
    '',
  );

  const data = JSON.parse(prefixParsed.substr(0, prefixParsed.length - 2));

  return { props: { data } };
}

export default TeamsPage;

// styles

const Cell = styled(Table.Cell)`
  white-space: pre-wrap;
`;
