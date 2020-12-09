require('dotenv').config();
const pool = require('../app/config'); 

const createUserAnonymouslyTag = async (req, res) => {
    
    try {
        const expires_on = new Date(Date.now() + 2592000000).toISOString();
        const { username, contacts, onetimeuse } = req.body;

        await pool.query(`SELECT * FROM usertags WHERE usertag like '${username}%' `, async (error, results) => {
            if (error) {
                res.status(500).json({ message: 'Internal error', error: error });
                console.log(error);
            } else if (results.rowCount > 0) {
    
                var digitsUsed = [];
                results.rows.forEach(digits => {
                    digitsUsed.push(digits.usertag.split('#')[1]);
                });
    
                randomDigits = Math.floor(1000 + Math.random() * 9000);
    
                while (digitsUsed.includes(randomDigits)) {
                    randomDigits = Math.floor(1000 + Math.random() * 9000);
                }
    
                var usertag = `${username}#${randomDigits}`;

                await pool.query(`INSERT INTO usertags (usertag, contacts, expires_on, onetimeuse) VALUES ($1, $2, $3, $4)`, [usertag, contacts, expires_on, onetimeuse], (error, result) => {
                    if (error) {
                        res.status(400).json({ message: 'Something went wrong', error: error });
                        console.log(error);
                    } else if (result.rowCount > 0) {
                        res.status(201).json({ message: 'Created usertag successfully', usertag: usertag, info: result.rows[0] });
                        console.log(result);
                    } else {
                        res.status(400).json({ message: 'Something went wrong' });
                    }
                })
            } else {
                randomDigits = Math.floor(1000 + Math.random() * 9000);

                var usertag = `${username}#${randomDigits}`;
                
                await pool.query(`INSERT INTO usertags (usertag, contacts, expires_on, onetimeuse) VALUES ($1, $2, $3, $4)`, [usertag, contacts, expires_on, onetimeuse], (error, result) => {
                    if (error) {
                        res.status(400).json({ message: 'Something went wrong', error: error });
                        console.log(error);
                    } else if (result.rowCount > 0) {
                        res.status(201).json({ message: 'Created usertag successfully', usertag: usertag, info: result.rows[0] });
                        console.log(result.rows);
                    } else {
                        res.status(400).json({ message: 'Something went wrong' });
                    }
                });
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal error', error: error });
        console.log(error);
    }
}

const createUserTag = async (req, res) => {
    try {
        const { username, contacts, days_to_expire, onetimeuse } = req.body;
        const { user_id } = req.user;
        const expires_on = new Date(Date.now() + (days_to_expire * 86400000)).toISOString();

        await pool.query(`SELECT * FROM usertags WHERE usertag like '${username}%' `, async (error, results) => {
            if (error) {
                res.status(500).json({ message: 'Internal error', error: error });
                console.log(error);
            } else if (results.rowCount > 0) {
    
                var digitsUsed = [];
                results.rows.forEach(digits => {
                    digitsUsed.push(digits.usertag.split('#')[1]);
                });
    
                randomDigits = Math.floor(1000 + Math.random() * 9000);
    
                while (digitsUsed.includes(randomDigits)) {
                    randomDigits = Math.floor(1000 + Math.random() * 9000);
                }
    
                var usertag = `${username}#${randomDigits}`;

                await pool.query(`INSERT INTO usertags (usertag, contacts, expires_on, onetimeuse, user_id) VALUES ($1, $2, $3, $4, $5)`, [usertag, contacts, expires_on, onetimeuse, user_id], (error, result) => {
                    if (error) {
                        res.status(400).json({ message: 'Something went wrong', error: error });
                        console.log(error);
                    } else if (result.rowCount > 0) {
                        res.status(201).json({ message: 'Created usertag successfully', usertag: usertag, info: result.rows[0] });
                        console.log(result);
                    } else {
                        res.status(400).json({ message: 'Something went wrong' });
                    }
                });
            } else {
                randomDigits = Math.floor(1000 + Math.random() * 9000);

                var usertag = `${username}#${randomDigits}`;
                
                await pool.query(`INSERT INTO usertags (usertag, contacts, expires_on, onetimeuse, user_id) VALUES ($1, $2, $3, $4, $5)`, [usertag, contacts, expires_on, onetimeuse, user_id], (error, result) => {
                    if (error) {
                        res.status(400).json({ message: 'Something went wrong', error: error });
                        console.log(error);
                    } else if (result.rowCount > 0) {
                        res.status(201).json({ message: 'Created usertag successfully', usertag: usertag, info: result.rows[0] });
                        console.log(result.rows);
                    } else {
                        res.status(400).json({ message: 'Something went wrong' });
                    }
                });
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal error', error: error });
        console.log(error);
    }
}

const updateUserTag = async (req, res) => {
    try {
        const { usertag, contacts } = req.body;
        const { user_id } = req.user;

        await pool.query('UPDATE usertags SET contacts = $3 WHERE usertag = $1 AND user_id = $2', [usertag, user_id, contacts], (error, result) => {
            if (error) {
                res.status(500).json({ message: 'Something went wrong. Contact admin' });
                console.log(error);
            } else if (result.rowCount > 0) {
                res.status(200).json({ message: `Updated tag ${usertag}`, info: result.rows[0] });
            } else {
                res.status(400).json({ message: 'Something went wrong. Contact admin' });
            }
        })
    }
    catch (error) {
        res.status(500).json({ message: 'Internal error', error: error });
        console.log(error);
    }
}

const retrieveUserTag = async (req, res) => {
    try {
        const userTag = req.params.id;

        await pool.query('SELECT * FROM usertags WHERE usertag = $1', [userTag], async (error, result) => {
            if (error) {
                res.status(500).json({ message: 'Something went wrong. Contact admin' });
                console.log(error);
            } else if (result.rowCount > 0) {
                if (result.rows[0].onetimeuse) {
                    res.status(200).json({ usertag: result.rows[0].usertag, contacts: result.rows[0].contacts, message: 'It got deleted because you saw it' });
                    await pool.query('DELETE FROM usertags WHERE id = $1', [result.rows[0].id], (error, results) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log(results);
                        }
                    })
                } else {
                    res.status(200).json({ usertag: result.rows[0].usertag, contacts: result.rows[0].contacts });
                }
            } else {
                res.status(400).json({ message: `Could not find user with tag ${userTag}` });
            }
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Internal error', error: error });
        console.log(error);
    }
}

module.exports = {
    createUserAnonymouslyTag,
    createUserTag,
    updateUserTag,
    retrieveUserTag,
}