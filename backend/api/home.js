const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(express.json())

app.use(cors({
    origin: '*',
    credentials: true,
}));

const supabaseUrl = 'https://qkwmgymjtzsaxlejkfiq.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey);

app.listen(3000, () => console.log('Server has started'));

app.get("/", (req, res) => {
    res.json({'message':"Backend for the OCS Test of Pulkit, send a GET request to login with parameters username and password"});
});

app.get('/login', async (req, res) => {

    const { username, passwordHash } = req.query;
    if (username===undefined || passwordHash===undefined) {res.status(422).json({error:'Incomplete Input'}); return}

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
                    if (user.role=='admin') res.status(200).json(users)
                    else res.status(200).json(user)
                }
                else {
                    res.status(401).json({error:"Authentication Failed"})
                }
            }
        })

        if (!found) {
            res.status(404).json({error:"User not found"})
        }

    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = app