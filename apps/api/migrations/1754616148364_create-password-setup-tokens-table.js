/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
  pgm.createTable('password_setup_tokens', {
    id: 'id',
    token: {
      type: 'varchar(255)',
      notNull: true,
      unique: true
    },
    email: {
      type: 'varchar(255)',
      notNull: true,
      unique: true
    },
    expires_at: {
      type: 'timestamptz',
      notNull: true
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('NOW()')
    }
  })

  // Add indexes for performance
  pgm.createIndex('password_setup_tokens', 'token')
  pgm.createIndex('password_setup_tokens', 'email')
  pgm.createIndex('password_setup_tokens', 'expires_at')
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('password_setup_tokens')
};
