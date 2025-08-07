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
  // Create user_role enum type
  pgm.createType('user_role', ['student', 'admin']);

  // Create users table
  pgm.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      default: pgm.func('gen_random_uuid()')
    },
    full_name: {
      type: 'varchar(255)',
      notNull: true
    },
    email: {
      type: 'varchar(255)',
      notNull: true,
      unique: true
    },
    password_hash: {
      type: 'varchar(255)',
      notNull: true
    },
    role: {
      type: 'user_role',
      notNull: true,
      default: 'student'
    },
    ai_credits: {
      type: 'integer',
      notNull: true,
      default: 500
    },
    target_band_score: {
      type: 'decimal(2,1)'
    },
    target_test_date: {
      type: 'date'
    },
    interface_language: {
      type: 'varchar(10)',
      notNull: true,
      default: 'en'
    },
    ai_feedback_language: {
      type: 'varchar(10)',
      notNull: true,
      default: 'bn'
    },
    gamification_opt_out: {
      type: 'boolean',
      notNull: true,
      default: false
    },
    gamification_is_anonymous: {
      type: 'boolean',
      notNull: true,
      default: false
    },
    current_streak: {
      type: 'integer',
      notNull: true,
      default: 0
    },
    points_balance: {
      type: 'integer',
      notNull: true,
      default: 0
    },
    created_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()')
    },
    updated_at: {
      type: 'timestamptz',
      notNull: true,
      default: pgm.func('now()')
    }
  });

  // Create index on email for faster lookups
  pgm.createIndex('users', 'email');
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
  // Drop users table (this will also drop the index)
  pgm.dropTable('users');
  
  // Drop user_role enum type
  pgm.dropType('user_role');
};
