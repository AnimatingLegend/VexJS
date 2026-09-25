# Contributing to Vex.js

Hello! Thank you for your interest in contributing to the Vex.js GitHub Repository! Please follow the guidelines listed below to get started.

## Requirements

Before you begin, make sure you have these things first.

- **[Node.js](https://nodejs.org/en/download)**
  - This is the main environment that you use to run the engine. Make sure you get the **v24 (LTS)** release for better stability.
- **[Project Dependencies](#included-dependencies)**
  - These are the libraries the engine needs to work. like `electron` for the connection or `sqlite3` for database.

## Fork the Repository

Run the following commands in your terminal to fork Vex's Repository:

```bash
git clone https://github.com/AnimatingLegend/VexJS.git
cd VexJS
```

## Project Dependencies

Once you forked your Repository and entered the project's directory, you will now have to install some libraries that are required for this engine.

Run the following commands to install Vex's required dependencies

```bash
npm install
```

> [!TIP]
>
> If you ever notice a specific feature isn't working, it might be because a package is missing.
>
> You can manually install it by typing: `npm install <package-name>` (e.g. `npm install prettier`)

### Included Dependencies:

`eslint`, `prettier`, `serve`, `vitest`.

## Create a new branch

Your work shouldn't actively be done on the `main` branch, given that the branch is frequenetly worked on by other devs, and may cause merge conflicts with the changes you are making.

### Example:

```bash
# Conventional layout for making a branch name.
<type>/<subject>

# EXAMPLE:
feat/impl-text-rendering
```

## Editing / Testing your changes

> [!IMPORTANT]
>
> When editing your code, it is ideal that it follows the **[Programming Style Guide](../source/) (COMING SOON)**.
> This keeps your code consistent with the rest of the codebase.

If you're adding a feature to an already existing class, make sure to test your changes in the corresponding `/test/[specified-test-directory]/name.js`, or create a new directory and file under `test/` to keep the work space clean and concise for you, and other contributors.

If you're creating a new VexClass within the `source/` directory, make sure to import the class in source entry point (**[index.js](../index.js)**) to prevent **everything** from breaking.

### Example:

**Your Class**

```js
export default class VexClass {
  ...
}
```

**Source Entry Point (index.js)**

```js
export { default as VexClass } from "./source/VexClass.js";
```

When done writing your code, run `npm run dev` to start the dev server and test your changes.

## Commit your changes

Once you feel like your changes are complete, and your files are formatted, write a clear and meaningful commit message.

> [!IMPORTANT]
>
> This Repository follows the [**Conventional Commits**](https://www.conventionalcommits.org/en/v1.0.0/) format for commit messages, issues, and pull requests.

### Example:

```bash
# Conventional way for making a commit message.
<type>(<scope>): <subject>
<description>

# EXAMPLE:
docs(contributing): added 2 new sections & update Issue/PR templates

* Added "Maintaining your Pull Request" section.
* Added "Editing / Testing your changes" section.
* Added CONTRIBUTING.md guidelines to Issue/PR templates.
```

- `<type>`: Is **REQUIRED**
- `<scope>`: Is required **ONLY** if you're working on an existing file.
- `<subject>`: Is a short description of the change your commiting.
- `<description>`: Adding a description to your commit message is optional, but prefered.

## Maintaing your Pull Request

Keep your PR's clean and concise to make reviewing easier for the developers.

### Merge Conflicts

Merge conflics are usually small modifications done to files that may overlap with pull requests or commits. This can easily be avoided by fixing them in your code editor, or on the GitHub page itself.

- If we require changes to your PR, we will label your PR `status: needs revision`.
- Following the `status needs revision` label, we will also leave a comment stating some of the changes you should make.
- If you receive a comment, you have 30 - 60 days to implement the requested changes.
- If you dont submit the changes on time, your PR will be closed for inactivity, and labeled as `status: state`.

### Rebasing

When the `main` branch is active, your PR may fall behind when it comes to commits. In order to avoid this, you will have to perform a **[`git rebase`](https://docs.github.com/en/get-started/using-git/about-git-rebase)**. What this does is put the changes you made on the top of your updated branch, making it up-to-date, and ready to merge to the `main` branch.

> [!TIP]
> If your commit history becomes too long, you can also use `git rebase` to `sqaush` your PR's commits into a single commit.

## Final Notes

This project is meant to be simple, clean and easy to build upon.
Contributions that improve the engines, functionality, and readability are always appreciated

**Thank you for contributing! ദ്ദി◝ ⩊ ◜)**
