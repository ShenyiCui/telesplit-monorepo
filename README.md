## TELESPLIT-MONOREPO

Welcome to the Telesplit Monorepo! This repository contains all the code for the Telesplit project, a tool for splitting bills with friends on Telegram.

## Getting Started

**Prerequisites: NodeJS LTS v20.11.1**

1. Install nvm on your machine
2. run `nvm install v20.11.1`
3. run `nvm use`

**Prerequisites: `pnpm` and `rush` package manager**

4. Install `pnpm` and `rush` globally:

```bash
npm install -g pnpm @microsoft/rush
```

5. Install the dependencies:

```bash
nvm use
rush update
```

6. Adding a [new package](https://rushjs.io/pages/commands/rush_add/):

```bash
rush add -p <package-name>
```

## Documentation

- [**Live Site**]()
- [**Demo Video**]()
- [**Frontend Documentation**](./apps/telesplit-frontend/README.md)
- [**Backend Documentation**](./apps/telesplit-backend/README.md)
- [**Bot Documentation**](./apps/telesplit-bot/README.md)

## Project Directory

- `apps/telesplit-frontend`: The Next.js frontend for the project.
- `apps/telesplit-backend`: The Nest.js backend for the project.
- `apps/telesplit-bot`: The Telegram bot for the project.

### Commit Message Convention

- Use [Gitmoji](https://gitmoji.dev/) to add emojis to your commit messages
- Use the following format for your commit messages
  - :sparkles: `feat(frontend): add new feature`
  - :bug: `fix(backend): fix a bug`
  - :recycle: `refactor(bot): refactor code`
  - :art: `style(bot): change styling`
  - :fire: `chore(frontend): remove unused code`
  - :memo: `docs(frontend): update documentation`
  - :package: `package(bot): update package`
  - :rocket: `deploy(bot): deploy to production`
  - :wastebasket: `waste(frontend): remove unused code`

## Screenshots

_[Placeholder]_
