import jwt from 'jsonwebtoken';
const { verify, sign } = jwt
import dotenv from 'dotenv';

dotenv.config();

const secretToken = process.env.MARIADB_ROOT_PASSWORD; // The token secret saved in our env variable

function Verify(req, userId) {
  const authorizationHeader = req.headers.authorization; // Bearer token ex: bearer eyJhbGciOiJIUz...
  const token = authorizationHeader.split(" ")[1]; // Split the string to get the token after the word bearer
  const decoded = verify(token, secretToken) // Return the decoded payload
  if (userId && decoded.user.userId != userId) {
    // If the userId is passed and the decoded userId is not the same as the passed userId
    throw new Error('User id does not match!'); // Throw an error
  }
}

function Sign(user) {
  return sign({ user: { user } }, secretToken, {expiresIn: "2h"}); // Sign the token and add the userId to it
}

export { Verify, Sign };
