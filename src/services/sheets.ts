import { ProblemReport } from '../types';

export interface SheetMetadata {
  spreadsheetId: string;
  spreadsheetUrl: string;
  title: string;
}

const STORAGE_KEY_SPREADSHEET = 'dhamti_google_sheet_id';

export const getStoredSpreadsheetId = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEY_SPREADSHEET);
  } catch {
    return null;
  }
};

export const setStoredSpreadsheetId = (id: string | null) => {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEY_SPREADSHEET, id);
    } else {
      localStorage.removeItem(STORAGE_KEY_SPREADSHEET);
    }
  } catch {
    // Ignore storage issues
  }
};

const SHEET_HEADERS = [
  'Tracking Code',
  'Title',
  'Ward / Area',
  'Category',
  'Urgency',
  'Status',
  'Specific Location',
  'Citizen Name',
  'Phone Number',
  'Submission Date',
  'Assigned Officer',
  'Official Action / Resolution Note',
];

export const createCivicSpreadsheet = async (
  accessToken: string,
  customTitle?: string
): Promise<SheetMetadata> => {
  const title = customTitle || 'আমাদের ধামতী আমরাই গড়ব - নাগরিক অভিযোগ ও সেবা ট্র্যাকার';

  // 1. Create Spreadsheet via Google Sheets API
  const response = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        title,
      },
      sheets: [
        {
          properties: {
            title: 'Citizen Complaints',
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to create Google Sheet: ${errorText}`);
  }

  const data = await response.json();
  const spreadsheetId = data.spreadsheetId;
  const spreadsheetUrl = data.spreadsheetUrl || `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 2. Add header row
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Citizen Complaints'!A1:L1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [SHEET_HEADERS],
      }),
    }
  );

  setStoredSpreadsheetId(spreadsheetId);

  return {
    spreadsheetId,
    spreadsheetUrl,
    title,
  };
};

export const formatProblemRow = (p: ProblemReport): (string | number)[] => {
  return [
    p.trackingCode,
    p.title,
    p.ward,
    p.category,
    p.urgency,
    p.status,
    p.specificLocation,
    p.isAnonymous ? 'Anonymous' : p.citizenName || 'Local Resident',
    p.phone || 'N/A',
    new Date(p.createdAt).toLocaleString(),
    p.assignedOfficer || 'Md. Anwar Hossain Bhuiyan Civic Cell',
    p.resolutionNote || 'Under active monitoring',
  ];
};

export const appendProblemToSheet = async (
  accessToken: string,
  spreadsheetId: string,
  problem: ProblemReport
): Promise<boolean> => {
  try {
    const row = formatProblemRow(problem);

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Citizen Complaints'!A:L:append?valueInputOption=USER_ENTERED`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: [row],
        }),
      }
    );

    return res.ok;
  } catch (err) {
    console.error('Error appending problem to Google Sheet:', err);
    return false;
  }
};

export const syncAllProblemsToSheet = async (
  accessToken: string,
  spreadsheetId: string,
  problems: ProblemReport[]
): Promise<{ success: boolean; count: number }> => {
  // First ensure headers exist
  await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Citizen Complaints'!A1:L1?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [SHEET_HEADERS],
      }),
    }
  );

  // Format all rows
  const rows = problems.map((p) => formatProblemRow(p));

  // Write all rows starting at row 2
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'Citizen Complaints'!A2:L${rows.length + 1}?valueInputOption=USER_ENTERED`,
    {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: rows,
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Failed to sync problems: ${err}`);
  }

  return { success: true, count: rows.length };
};
