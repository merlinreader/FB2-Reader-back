const express = require("express");
const { Pool } = require("pg");
const bodyParser = require('body-parser');

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
});

const app = new express();
app.use(express.static('pub'));
app.use(express.json());
app.post("/books", async (req, res) => {
    const words = req.body.words.map(data => data.toLowerCase());
    const r = await pool.query(`SELECT b.url, b.name, array_agg(c.word) as words, array_agg(c.count) as cnt
                                FROM UNNEST($1::varchar[]) as u
                                         LEFT JOIN words_count c ON (u = c.word)
                                         INNER JOIN books b ON (c.book_id = b.id)
                                GROUP BY b.url, b.name
                                ORDER BY COUNT(c.word) DESC, SUM(c.count) DESC LIMIT 10;`, [words]);
    if (r.rows === undefined) {
        res.status(400).end();
        return;
    }
    const mp = [];
    for (const re of r.rows) {
        const arr = {
            url: re.url,
            name: re.name,
            arr: new Array(words.length)
        };
        for (let i = 0; i < re.words.length; i++) {
            for(let j = 0; j < words.length; j++) {
                if(re.words[i] === words[j]) {
                    arr.arr[j] = re.cnt[i];
                    break;
                }
            }
        }
        mp.push(arr);
    }

    res.status(200).send(mp);
});

app.listen(3000, () => {})
