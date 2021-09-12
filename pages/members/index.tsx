import React from 'react';

import axios from 'axios';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Table } from 'semantic-ui-react';

import type { GoogleSheetResponse } from '../../types/GoogleSheetResponse';

interface Props {
  data: GoogleSheetResponse;
}

const HIDE_COLUMN_LIST = [0, 1, 4, 6, 7, 8];

const MembersPage: NextPage<Props> = ({ data }) => {
  const router = useRouter();

  const renderCell = (cell: { v: string | boolean } | null): JSX.Element => {
    if (cell === null) return <></>;
    return <>{cell.v}</>;
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
                  <Table.Cell key={cellIndex}>{renderCell(cell)}</Table.Cell>
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
    `https://docs.google.com/spreadsheets/d/${process.env.MEMBER_LIST_SHEET_KEY}/gviz/tq?`,
  );

  const prefixParsed = res.data.replace(
    '/*O_o*/\ngoogle.visualization.Query.setResponse(',
    '',
  );

  const data = JSON.parse(prefixParsed.substr(0, prefixParsed.length - 2));

  return { props: { data } };
}

export default MembersPage;
