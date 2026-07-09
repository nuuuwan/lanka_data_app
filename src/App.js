import React, { useEffect, useMemo, useState } from 'react';
import Alert from '@mui/material/Alert';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import { buildCommand, fetchHelp, runCommand } from './api';
import ResultView from './ResultView';

const theme = createTheme({
  palette: { mode: 'light', primary: { main: '#0b6e4f' } },
});

export default function App() {
  const [help, setHelp] = useState(null);
  const [helpError, setHelpError] = useState(null);

  const [what, setWhat] = useState('Religion');
  const [when, setWhen] = useState('2024');
  const [where, setWhere] = useState('LK');
  const [how, setHow] = useState('JSON');

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    fetchHelp()
      .then((data) => {
        if (active) setHelp(data);
      })
      .catch((err) => {
        if (active) setHelpError(err.message);
      });
    return () => {
      active = false;
    };
  }, []);

  const whatOptions = useMemo(
    () => (help ? Object.keys(help.what_to_whens).sort() : []),
    [help]
  );
  const whenOptions = useMemo(
    () => (help && help.what_to_whens[what] ? help.what_to_whens[what] : []),
    [help, what]
  );
  const howOptions = useMemo(() => (help ? help.how.bases : []), [help]);
  const whereExamples = useMemo(() => (help ? help.where.examples : []), [help]);

  const command = buildCommand({ what, when, where, how });

  const onRun = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await runCommand(command);
      setResult(data);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={0.5} sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1">
            Lanka Data
          </Typography>
          <Typography variant="body2" color="text.secondary">
            A minimal client for the{' '}
            <Link
              href="https://github.com/nuuuwan/lanka_data"
              target="_blank"
              rel="noopener noreferrer"
            >
              Lanka Data API
            </Link>
            . Build a <code>What / When / Where / How</code> command and run it.
          </Typography>
        </Stack>

        {helpError && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Could not load options from the API ({helpError}). You can still type
            values manually.
          </Alert>
        )}

        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
          <Stack spacing={2}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Autocomplete
                freeSolo
                fullWidth
                options={whatOptions}
                value={what}
                onChange={(event, value) => setWhat(value || '')}
                onInputChange={(event, value) => setWhat(value)}
                renderInput={(params) => (
                  <TextField {...params} label="What" placeholder="Religion" />
                )}
              />
              <Autocomplete
                freeSolo
                fullWidth
                options={whenOptions}
                value={when}
                onChange={(event, value) => setWhen(value || '')}
                onInputChange={(event, value) => setWhen(value)}
                renderInput={(params) => (
                  <TextField {...params} label="When" placeholder="2024" />
                )}
              />
            </Stack>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Autocomplete
                freeSolo
                fullWidth
                options={whereExamples}
                value={where}
                onChange={(event, value) => setWhere(value || '')}
                onInputChange={(event, value) => setWhere(value)}
                renderInput={(params) => (
                  <TextField {...params} label="Where" placeholder="LK" />
                )}
              />
              <Autocomplete
                freeSolo
                fullWidth
                options={howOptions}
                value={how}
                onChange={(event, value) => setHow(value || '')}
                onInputChange={(event, value) => setHow(value)}
                renderInput={(params) => (
                  <TextField {...params} label="How" placeholder="JSON" />
                )}
              />
            </Stack>

            <Divider />

            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{
                alignItems: { xs: 'stretch', sm: 'center' },
                justifyContent: 'space-between',
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}
              >
                {command || 'What/When/Where/How'}
              </Typography>
              <Button
                variant="contained"
                onClick={onRun}
                disabled={loading || !command}
                startIcon={
                  loading ? <CircularProgress size={16} color="inherit" /> : null
                }
              >
                Run
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <ResultView data={result} />
      </Container>
    </ThemeProvider>
  );
}
