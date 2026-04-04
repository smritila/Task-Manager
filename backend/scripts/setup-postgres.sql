CREATE USER taskmanager_user WITH PASSWORD 'taskmanager_pass';
CREATE DATABASE taskmanager_db OWNER taskmanager_user;
GRANT ALL PRIVILEGES ON DATABASE taskmanager_db TO taskmanager_user;
