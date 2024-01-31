const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const md5 = require('js-md5');
require('dotenv').config();

const app = express();
app.use(express.json())

const supabaseUrl = 'https://qkwmgymjtzsaxlejkfiq.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

app.listen(3000, () => console.log('Server has started'));

app.get("/", (req, res) => {
    res.send("Backend for the OCS Test of Pulkit, send a GET request to /login with parameters username and password");
});

app.get('/login', async (req, res) => {

    const { username, password } = req.query;
    if (username===undefined || password===undefined) {res.status(422).send('Incomplete Input'); return}

    const passwordHash = md5(password)

    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('*');
        if (error) {
            throw error;
        }

        found=false

        users.forEach((user)=>{
            if (user.userid == username) {
                found=true
                if (user.password_hash == passwordHash) {
                    if (user.role=='admin') res.status(200).send(users)
                    else res.status(200).send(user)
                }
                else {
                    res.status(401).send("Authentication Failed")
                }
            }
        })

        if (!found) {
            res.status(404).send("User not found")
        }

    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = app