#!/bin/bash
set -e

# Definir variáveis do banco de dados
POSTGRES_USER=${POSTGRES_USER:-postgres}
POSTGRES_DB=${POSTGRES_DB:-postgres}
PROD_DB=${PROD_POSTGRES_DB:-prod_db}
TEST_DB=${TEST_POSTGRES_DB:-test_db}

# Verificar e criar banco de dados de produção, se não existir
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -tc \
"SELECT 1 FROM pg_database WHERE datname = '$PROD_DB'" | grep -q 1 || \
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -c \
"CREATE DATABASE $PROD_DB"

# Verificar e criar banco de dados de teste, se não existir
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -tc \
"SELECT 1 FROM pg_database WHERE datname = '$TEST_DB'" | grep -q 1 || \
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" -c \
"CREATE DATABASE $TEST_DB"

echo "Bancos de dados $PROD_DB e $TEST_DB verificados e criados (se necessário)."
