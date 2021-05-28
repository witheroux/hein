export default {
  development: {
    client: "postgresql",
    connection: {
      database: "postgres",
      user: "postgres",
      password: "postgres"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "migrations",
      extension: "mjs",
      tableName: "knex_migrations"
    },
  },

  production: {
    client: "postgresql",
    connection: {
      database: process.env.PG_SQL_DB,
      user: process.env.PG_SQL_USER,
      password: process.env.PG_SQL_PASS,
      host: process.env.PG_SQL_HOST,
      port: process.env.PG_SQL_PORT,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: "migrations",
      extension: "mjs",
      tableName: "knex_migrations"
    }
  }
};
