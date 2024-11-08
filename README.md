# mostval Platform

## Package management

This project uses [pnpm](https://pnpm.io/) as the package manager. You can install it with the following command:

```bash
npm install -g pnpm
```

## Global dependencies

This project uses the following global dependencies to run tasks and enforce code quality:

```bash
npm install -g @commitlint/cli @commitlint/config-conventional @commitlint/config-nx-scopes eslint@~8.48.0 ts-node ts-jest lint-staged husky @commitlint/types
```

## Running tasks

To execute tasks with Nx use the following syntax:

```bash
nx <target> <project> <...options>
```

You can also run multiple targets:

```bash
nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```bash
nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/features/run-tasks).

## Explore the Project Graph

Run `nx graph` to show the graph of the workspace.
It will show tasks that you can run with Nx.

- [Learn more about Exploring the Project Graph](https://nx.dev/core-features/explore-graph)

## Generate code

If you happen to use Nx plugins, you can leverage code generators that might come with it.

Run `nx list` to get a list of available plugins and whether they have generators. Then run `nx list <plugin-name>` to see what generators are available.

Learn more about [Nx generators on the docs](https://nx.dev/features/generate-code).
# Mention Platform

## Package management

This project uses [pnpm](https://pnpm.io/) as the package manager. You can install it with the following command:

```bash
npm install -g pnpm
```

## Global dependencies

This project uses the following global dependencies to run tasks and enforce code quality:

```bash
npm install -g @commitlint/cli @commitlint/config-conventional @commitlint/config-nx-scopes eslint@~8.48.0 ts-node ts-jest lint-staged husky @commitlint/types
```

## Running tasks

To execute tasks with Nx use the following syntax:

```bash
nx <target> <project> <...options>
```

You can also run multiple targets:

```bash
nx run-many -t <target1> <target2>
```

..or add `-p` to filter specific projects

```bash
nx run-many -t <target1> <target2> -p <proj1> <proj2>
```

Targets can be defined in the `package.json` or `projects.json`. Learn more [in the docs](https://nx.dev/features/run-tasks).

## Explore the Project Graph

Run `nx graph` to show the graph of the workspace.
It will show tasks that you can run with Nx.

- [Learn more about Exploring the Project Graph](https://nx.dev/core-features/explore-graph)

## Generate code

If you happen to use Nx plugins, you can leverage code generators that might come with it.

Run `nx list` to get a list of available plugins and whether they have generators. Then run `nx list <plugin-name>` to see what generators are available.

Learn more about [Nx generators on the docs](https://nx.dev/features/generate-code).

## Generate NestJS Application

### It is recommended to use the Nx Console extension of vscode, the use of the extension exempts the execution of the following commands to create the app.

Install dependencies:

    ```bash
        pnpm install
    ```

### By convension one should use the api suffix in the directory to define that it is an api and not front-end.

To generate a NestJS application, run the following command:

    ```bash
        pnpm exec nx generate @nx/nest:application --name=my-app --directory=apps/my-app-api --e2eTestRunner=none --projectNameAndRootFormat=as-provided --strict=true --no-interactive
    ```

## Generate Container

Execute the following command to install container dependencies for a project:

    ```bash
        pnpm add -D @nx-tools/nx-container @nx-tools/container-metadata
    ```

To create container metadata for a project, run the following command:

    ```bash
        pnpm exec nx g @nx-tools/nx-container:init my-app --template nest --engine docker
    ```

## Generate Dockerfile

To generate a Dockerfile for a project, run the following command:

    ```bash
        pnpm exec nx g @nx-tools/nx-container:init my-app --template nest --engine docker
    ```

Change the COPY command in the dockerfile where is only the one in the "my-app" to copy the project root files.
    of: COPY my-app
    for: COPY .npmrc package.json pnpm-lock.yaml ./

Change command RUN to install the dependencies in the project.
    of: RUN npm install --omit=dev
    for: RUN pnpm install --frozen-lockfile --prod --ignore-scripts