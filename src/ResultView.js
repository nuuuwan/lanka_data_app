import React from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

// Detect the common "list of regions with values" JSON shape.
function isRegionList(result) {
  return (
    Array.isArray(result) &&
    result.length > 0 &&
    result.every((row) => row && typeof row === 'object' && 'values' in row)
  );
}

// Build the ordered set of value columns across all regions, most significant
// (largest total) first, so the table stays readable even when there are many
// categories.
function valueColumns(rows) {
  const totals = {};
  rows.forEach((row) => {
    Object.entries(row.values || {}).forEach(([key, value]) => {
      totals[key] = (totals[key] || 0) + (Number(value) || 0);
    });
  });
  return Object.keys(totals).sort((a, b) => totals[b] - totals[a]);
}

function formatNumber(value) {
  if (typeof value === 'number') {
    return value.toLocaleString();
  }
  return value ?? '';
}

function RegionTable({ rows }) {
  const columns = valueColumns(rows);
  return (
    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 480 }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Region</TableCell>
            {columns.map((column) => (
              <TableCell key={column} align="right">
                {column}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={row.region_id || index} hover>
              <TableCell component="th" scope="row">
                {row.region_name || row.region_id}
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column} align="right">
                  {formatNumber(row.values?.[column])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function JsonBlock({ value }) {
  return (
    <Paper
      variant="outlined"
      component="pre"
      sx={{
        p: 2,
        m: 0,
        overflow: 'auto',
        maxHeight: 480,
        fontSize: 13,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}
    >
      {JSON.stringify(value, null, 2)}
    </Paper>
  );
}

export default function ResultView({ data }) {
  if (!data) {
    return null;
  }

  const { command_str: commandStr, result, sources, query_time_ms: queryTimeMs } = data;

  return (
    <Stack spacing={1.5}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexWrap: 'wrap' }} useFlexGap>
        {commandStr && <Chip label={commandStr} color="primary" variant="outlined" />}
        {typeof queryTimeMs === 'number' && (
          <Typography variant="caption" color="text.secondary">
            {queryTimeMs} ms
          </Typography>
        )}
      </Stack>

      {isRegionList(result) ? <RegionTable rows={result} /> : <JsonBlock value={result} />}

      {Array.isArray(sources) && sources.length > 0 && (
        <Box>
          <Typography variant="caption" color="text.secondary">
            Sources:{' '}
          </Typography>
          {sources.map((source, index) => (
            <Typography key={index} variant="caption" color="text.secondary">
              {index > 0 && ', '}
              {source.url ? (
                <Link href={source.url} target="_blank" rel="noopener noreferrer">
                  {source.name || source.url}
                </Link>
              ) : (
                source.name
              )}
            </Typography>
          ))}
        </Box>
      )}
    </Stack>
  );
}
