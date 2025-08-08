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
  pgm.createTable('failed_email_attempts', {
    id: 'id',
    type: {
      type: 'varchar(50)',
      notNull: true
    },
    recipient: {
      type: 'varchar(255)',
      notNull: true
    },
    data: {
      type: 'jsonb',
      notNull: true
    },
    enrollment_id: {
      type: 'uuid',
      references: 'enrollments(id)',
      onDelete: 'SET NULL'
    },
    user_id: {
      type: 'uuid',
      references: 'users(id)',
      onDelete: 'SET NULL'
    },
    retry_count: {
      type: 'integer',
      notNull: true,
      default: 0
    },
    last_retry: {
      type: 'timestamptz'
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('NOW()')
    }
  })

  // Add indexes for performance
  pgm.createIndex('failed_email_attempts', 'recipient')
  pgm.createIndex('failed_email_attempts', 'type')
  pgm.createIndex('failed_email_attempts', ['retry_count', 'created_at'])
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  pgm.dropTable('failed_email_attempts')
};