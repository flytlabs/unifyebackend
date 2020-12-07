require('dotenv').config();
const pool = require('../app/config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateAuthToken = (user) => {
    return jwt.sign(user, process.env.TOKEN_SECRET);
}

const registerUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const created_on = new Date(Date.now()).toISOString();
        const hashPassword = await bcrypt.hash(password, 10);

        await pool.query('SELECT * FROM users WHERE email = $1', [email], async (error, result) => {
            if (error) {
                res.status(500).json({ message: 'Internal error', error: error });
                console.log(error);
            } else if (result.rowCount > 0) {
                res.status(400).json({ message: 'A user with the email already exists' });
            } else {
                await pool.query('INSERT INTO users (username, email, password, created_on) VALUES($1, $2, $3, $4)', [username, email, hashPassword, created_on], (error, result) => {
                    if (error) {
                        res.status(500).json({ message: 'Could not create the user', error: error });
                        console.log(error);
                    } else {
                        res.status(201).json({ status: 'success', message: 'Created the user' });
                    }
                });
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal error', error: error });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        await pool.query('SELECT * FROM users WHERE email = $1', [email], async (error, result) => {
            if (error) {
                res.status(500).json({ message: 'Internal error', error: error});
                console.log(error);
            } else if (result.rowCount === 0) {
                res.status(400).json({ message: 'Incorrect login details' });
            } else {
                await bcrypt.compare(password, result.rows[0].password, async (error, check) => {
                    if (error) {
                        res.status(500).json({ message: 'Internal error', error: error});
                        console.log(error);
                    } else if (check) {
                        const user = {
                            user_id: result.rows[0].id,
                            username: result.rows[0].username,
                            email: result.rows[0].email,
                        }
                        const token = generateAuthToken(user);
                        await pool.query('UPDATE users SET tokens[1] = $1 WHERE email = $2', [token, email], (error, results) => {
                            if (error) {
                                res.status(500).json({ message: 'Internal error', error: error });
                                console.log(error);
                            } else if (results) {
                                res.cookie('authcookie', token, { maxAge: 2592000000 , httpOnly: true, secure: process.env.NODE_ENV === 'produtcion' ? true : false, sameSite: 'none' });
                                res.status(200).json({ message: 'Logged in successfully'});
                            }
                        });
                    } else {
                        res.status(400).json({ message: 'Incorrect login details '});
                    }
                });
            }
        });
    }
    catch (error) {

    }
}

module.exports = {
    registerUser,
    loginUser,
}