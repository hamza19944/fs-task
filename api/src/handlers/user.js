import { user, UserModel } from "../models/user.js";
import { Verify, Sign } from '../auth/jwtAuth.js';

const loginUser = new UserModel();
var token;

const index = async (req, res) => {
    let login = req.params.login;
    try {
        Verify(req);
        const topics = await loginUser.index(login); 
        res.send(topics);
    } catch (error) {
        const e = error;
        if (e.message.includes('Failed to get the topics')) {
            res.status(500).json(e.message);
        } else {
            res.status(401).json(e.message);
        }
    }
};

const chat = async (req, res) => {
    try {
        const { login, topics } = req.body
        if (!login || !topics) {
        return res
            .status(400)
            .send('Error, missing or malformed parameters. id required');
        }
        Verify(req);
        const result = await loginUser.show(login, topics);
        res.send({result});
    } catch (error) {
        const e = error;
        if (e.message.includes('Failed to get the messages')) {
        res.status(500).json(e.message);
        } else {
        res.status(401).json(e.message);
        }
    }
};

const authenticate = async (req, res) => {
    const { login, password } = req.body;
    if (!login || !password) {
        return res
        .status(400)
        .send('Error, missing or malformed parameters. login, password required');
    }
    try {
        const user = await loginUser.authenticate(login, password);
        if (user === null) {
            res.status(401);
            res.json('Incorrect user information');
        } else {
            token = Sign(user);
            res.json({user: user, token});
        }
    } catch (e) {
        res.status(401).send(e.message);
    }
};

const user_routes = (app) => {
    app.post('/auth', authenticate);
    app.post('/topics/:login%20:token', index);
    app.post('/chat', chat);
};

export default user_routes;