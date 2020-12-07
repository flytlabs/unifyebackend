const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/users');
const usertagsRouter = require('./routes/usertags');

const app = express();
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin: [
        'http://localhost:5500',
        'http://127.0.0.1:5500'
    ],
    credentials: true,
    exposedHeaders: ['set-cookie'],
}));

app.get('/', (req, res) => {
    res.status(200).json({ info: 'The Unifye REST Api is up and running!'});
});

app.use('/users', userRouter);
app.use('/usertags', usertagsRouter);

app.listen(process.env.PORT || 3000, () => {
    console.log(`Server listening on ${process.env.PORT || 3000}`);
});