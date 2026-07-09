# Lanka Data App

A very minimalist [MUI](https://mui.com/) client for the
[Lanka Data API](https://github.com/nuuuwan/lanka_data) — "one API to rule them
all" for public data about Sri Lanka 🇱🇰.

## What it does

The Lanka Data API is driven by a single command grammar with four positional
fields:

```
What / When / Where / How
```

for example `Religion/2012-2024/LK:district/Map:Change`. The same string is both
the query and the URL path. This app lets you:

- Pick a **What** (measurement, e.g. `Religion`, `Parliamentary`) and **When**
  (year or interval). Options are loaded from the API's `Help` command.
- Enter a **Where** (region, e.g. `LK`, `LK:district`, `LK-1,LK-2`).
- Pick a **How** (output format, e.g. `JSON`, `Map`, `BarChart`).
- Run the command and view the result. `JSON` results that are a list of
  regions are rendered as a table; anything else is shown as formatted JSON,
  along with the sources and query time.

See the API's [README.md](https://github.com/nuuuwan/lanka_data/blob/main/README.md)
and [README.philosophy.md](https://github.com/nuuuwan/lanka_data/blob/main/README.philosophy.md)
for the full grammar.
