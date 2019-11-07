const express = require('express');
const helmet = require('helmet');

const db = require('../data/db.js');

const server = express();

server.use(helmet());
server.use(express.json());

server.get('/', async (req, res) => {
  try {
    const shoutouts = await db('shoutouts');
    // This "message of the day" variable was created to demonstrate creating
    // environment variables in the Heroku platform. You can define environment
    // variables that Heroku will create in the OS environment is makes for your
    // app by clicking on the "Settings" tab for your app in Heroku.
    //
    // Our app will not be retrieving the PORT variable from a definition in
    // this way... Heroku automatically creates the PORT environment variable
    // for us (we don't need to tell it to). But there are times when we still
    // want other configuration environment variables that our app can use. And
    // since we don't have access to the shell environment before our
    // application is executed by Heroku, we need to define the variables we
    // want Heroku to create and export for our app using this feature
    // (Settings). 
    const motd = process.env.MOTD || 'Hi there!';

    res.status(200).json({ message: motd, shoutouts });
  } catch (error) {
    console.error('\nERROR', error);
    res.status(500).json({ error: 'Cannot retrieve the shoutouts' });
  }
});

server.post('/', async (req, res) => {
  try {
    const [id] = await db('shoutouts').insert(req.body);
    const shoutouts = await db('shoutouts');

    res.status(201).json(shoutouts);
  } catch (error) {
    console.error('\nERROR', error);
    res.status(500).json({ error: 'Cannot add the shoutout' });
  }
});

module.exports = server;
