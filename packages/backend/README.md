# Perfectify Backend

## Dev

### Setup

Install dependencies using uv:

```sh
cd packages/backend
uv sync --all-extras
```

This will create a virtual environment in `.venv` and install all dependencies including dev tools (pytest, mypy).

### Run the development server

Note: you will need to install the [firebase cli](https://firebase.google.com/docs/cli) first

```
firebase emulators:start
```

### Running commands with uv

To run commands in the virtual environment, use `uv run`:

```sh
uv run pytest
uv run mypy src
```
