module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'perf',
        'test',
        'chore',
        'revert',
        'ci',
        'build',
        'release',
        'deps',
        'config',
        'security',
        'breaking',
        'wip',
        'release',
      ],
    ],
    'header-max-length': [1, 'always', 120],
    'body-max-length': [0, 'always', 120],
    'body-max-line-length': [0, 'always', 120],
  },
};
