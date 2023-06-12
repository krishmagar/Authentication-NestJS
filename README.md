# COMPLETE AUTHENTICATION IN NESTJS

```env
# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings
# Database

DATABASE_URL="postgresql://postgres:prostgres@localhost:5000/auth?schema=public"

# JWT Token Secret Key

JWT_ACCESS_TOKEN_SECRET=atSecret
JWT_REFRESH_TOKEN_SECRET=rtSecret
REFRESH_TOKEN_HASH_SECRET=rtHashSecret

# JWT Token Expiration Time

JWT_ACCESS_TOKEN_EXPIRES_IN=15m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d
```
