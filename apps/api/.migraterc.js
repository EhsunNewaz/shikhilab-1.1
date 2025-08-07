const path = require('path');

module.exports = {
  'migrations-dir': path.resolve(__dirname, 'migrations'),
  'create-schema': true,
  'schema': 'public',
  'migrations-table': 'pgmigrations',
  'migrations-schema': 'public',
  'check-order': true,
  'verbose': true,
  'ignore-pattern': '.*\\.d\\.ts',
  'template-file-name': path.resolve(__dirname, 'migration-template.js'),
  'database-url': process.env.DATABASE_URL || 'postgresql://username:password@localhost:5432/shikhilab'
};