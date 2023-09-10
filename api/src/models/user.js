import client from "../../db.js"
import bcrypt from "bcrypt"

export const user = {
  login: String,
  password: String,
}

export class UserModel{
  async index(login) {
    try {
      const connection = await client.getConnection();
      const sql = 'SELECT * FROM topics WHERE login=(?)';
      const topics = await connection.query(sql, [login]);

      // client.end()
      return topics;
    } catch (error) {
      throw new Error(
        `Failed to get the topics with the following error: ${error}`
      );
    }
  }
  async show(login, topics){
    try {
      const connection = await client.getConnection();
      const sql = 'SELECT id, login, message FROM messages WHERE login=(?) AND topics=(?)';
      const sqlto = 'SELECT id, login, message FROM messages_to WHERE login=(?) AND topics=(?)';
      const messages = await connection.query(sql, [login, topics]);
      const messagesTo = await connection.query(sqlto, [login, topics]);
      // client.end()
      return {messages, messagesTo};
    } catch (error) {
      throw new Error(
        `Failed to get the selected topic with the following error: ${error}`
      );
    }
  }
  async authenticate(login, password){
    try {
      const connection = await client.getConnection();
      const sql = 'SELECT * FROM authorizations WHERE login=(?)';
      const result = await connection.query(sql, [login]);
      const user = result[0];
      if (user) {
        if (bcrypt.compareSync(password , user.password)) {
          return user;
        }
      }
      // client.end()
      return null;
    } catch (error) {
      throw new Error(
        `Failed to sign in as user with the following error: ${error}`
      );
    }
  }
}