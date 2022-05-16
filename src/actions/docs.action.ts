import { readdirSync, cpSync, existsSync, writeFileSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { emptyDirSync } from 'fs-extra';

export type DocsOpts = {
  /** The path of the workspaces. */
  workspaces: string;
};

const getDocsTemplate = (title: string, description: string, git: string) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/docsify@4/lib/themes/vue.css">
  </head>
  <body>
    <div id="app"></div>
    <script>
      window.$docsify = {
        name: '${title}',
        repo: '${git}',
        loadSidebar: 'sidebar.md',
        subMaxLevel: 3,
        search: 'auto'
      }
    </script>
    <script src="https://cdn.jsdelivr.net/npm/docsify@4"></script>
    <script src="https://unpkg.com/docsify-copy-code@2"></script>
  </body>
  </html>
  `;
};

/** Bundles the doc folders from workspaces. */
export const docsAction = async ({ workspaces }: DocsOpts) => {
  const cwd = process.cwd();
  const sidebar = [];

  emptyDirSync(resolve(cwd, 'docs'));

  for (const workspace of workspaces.split(',')) {
    sidebar.push(`- ${workspace}`);
    for (const project of readdirSync(resolve(cwd, workspace))) {
      const docsPath = resolve(cwd, workspace, project, 'docs');

      if (existsSync(docsPath)) {
        cpSync(docsPath, resolve(cwd, 'docs', project), { recursive: true });
        sidebar.push(`  - [${project}](${project}/index.md)`);
      }
    }
  }

  const { name, description, repository } = JSON.parse(
    readFileSync(resolve(cwd, 'package.json')).toString(),
  );

  cpSync(resolve(cwd, 'README.md'), resolve(cwd, 'docs', 'README.md'));
  writeFileSync(resolve(cwd, 'docs', 'sidebar.md'), sidebar.join('\n'));
  writeFileSync(resolve(cwd, 'docs', 'index.html'), getDocsTemplate(name, description, repository));
};
