import React from 'react';

import axios from 'axios';
import type { NextPage } from 'next';

import { TEAM_LIST_SHEET_KEY } from '../../constants/google-spreadsheet';
import type { GoogleSheetResponse } from '../../types/GoogleSheetResponse';

interface Props {
  data: GoogleSheetResponse;
}

const TeamsPage: NextPage<Props> = ({ data }) => {
  console.log(data);
  return null;
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
