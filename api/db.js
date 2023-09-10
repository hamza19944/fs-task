import { createPool } from "mariadb";
import dotenv from 'dotenv';

dotenv.config();

const { MARIADB_USER, MARIADB_PASSWORD, MARIADB_DATABASE } = process.env

var client = createPool({
    host: "127.0.0.1",
    port: 3366,
    user: MARIADB_USER,
    password: MARIADB_PASSWORD,
    database: MARIADB_DATABASE
});

export default client;