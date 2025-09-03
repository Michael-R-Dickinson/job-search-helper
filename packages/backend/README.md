# Perfectify Backend

## Dev

You will need to create the venv for this project manually. This is because firebase only supports venv's in the dir `venv` and poetry creates venvs with the dir `.venv`. We may move to a setup script in the future for dealing with this, but for now, the process is as follows:

### Disable poetry create virtualenvs:

```
poetry config virtualenvs.create false --local
```

### Create a virtualenv in the backend directory and activate it

```sh
cd packages/backend
python -m venv venv
source venv/bin/activate - or whatever you do on windows
```

### Install poetry packages into this virtualenv:

```
poetry install
```

### Run the development server

Note: you will need to install the [firebase cli](https://firebase.google.com/docs/cli) first

```
firebase emulators:start
```
