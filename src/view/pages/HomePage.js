import React, { useEffect, useMemo, useState } from "react";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useLocation, useNavigate } from "react-router-dom";

import { DEFAULT_COMMAND } from "../../nonview/cons";
import {
  buildCommand,
  commandToFields,
  encodeCommand,
  parseCommandFromPath,
} from "../../nonview/core/Command";
import { fetchHelp, runCommandCached } from "../../nonview/core/LankaDataAPI";
import {
  APP_INTRO_MIDDLE,
  APP_INTRO_PREFIX,
  APP_INTRO_SUFFIX,
  APP_TITLE,
  COMMAND_SYNTAX,
  HELP_ERROR_PREFIX,
  HELP_ERROR_SUFFIX,
  LANKA_DATA_API_LINK_TEXT,
  LANKA_DATA_REPO_URL,
} from "../_cons/content";
import CommandForm from "../moles/CommandForm";
import ResultView from "../moles/ResultView";

export default function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // The command lives in the URL path (after the /lanka_data_app basename).
  const pathCommand = parseCommandFromPath(location.pathname);

  const [help, setHelp] = useState(null);
  const [helpError, setHelpError] = useState(null);
  const [fields, setFields] = useState(DEFAULT_COMMAND);
  const [result, setResult] = useState(null);
  const [fromCache, setFromCache] = useState(false);
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

  const options = useMemo(
    () => ({
      what: help ? Object.keys(help.what_to_whens).sort() : [],
      when:
        help && help.what_to_whens[fields.what]
          ? help.what_to_whens[fields.what]
          : [],
      where: help ? help.where.examples : [],
      how: help ? help.how.bases : [],
    }),
    [help, fields.what],
  );

  // Whenever the command in the URL changes (deep link, back/forward, or a Run
  // that navigated), populate the form from it and run it.
  useEffect(() => {
    if (!pathCommand) {
      return undefined;
    }

    setFields(commandToFields(pathCommand));

    let active = true;
    setLoading(true);
    setError(null);
    setResult(null);
    runCommandCached(pathCommand)
      .then(({ data, fromCache: cached }) => {
        if (!active) return;
        setResult(data);
        setFromCache(cached);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message);
        setResult(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [pathCommand]);

  const command = buildCommand(fields);

  const onFieldChange = (name, value) =>
    setFields((prev) => ({ ...prev, [name]: value }));

  // Clicking Run updates the URL; the effect above performs the actual fetch.
  const onRun = () => {
    if (!command) {
      return;
    }
    navigate(`/${encodeCommand(command)}`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack spacing={0.5} sx={{ mb: 3 }}>
        <Typography variant="h4" component="h1">
          {APP_TITLE}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {APP_INTRO_PREFIX}
          <Link
            href={LANKA_DATA_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {LANKA_DATA_API_LINK_TEXT}
          </Link>
          {APP_INTRO_MIDDLE}
          <code>{COMMAND_SYNTAX}</code>
          {APP_INTRO_SUFFIX}
        </Typography>
      </Stack>

      {helpError && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {HELP_ERROR_PREFIX} ({helpError}){HELP_ERROR_SUFFIX}
        </Alert>
      )}

      <CommandForm
        fields={fields}
        options={options}
        command={command}
        loading={loading}
        onFieldChange={onFieldChange}
        onRun={onRun}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <ResultView data={result} fromCache={fromCache} />
      )}
    </Container>
  );
}
