export type GoogleSheetResponse = {
  reqId: string;
  sig: string;
  status: string;
  version: string;
  table: {
    cols: GoogleSheetCol[];
    parsedNumHeaders: number;
    rows: GoogleSheetRow[];
  };
};

export type GoogleSheetCol = {
  id: string;
  label: string;
  type: 'string' | 'boolean' | 'datetime';
};

export type GoogleSheetRow = {
  c: ({ v: string | boolean; f?: string } | null)[];
};
