// Imports 
const express = require('express');
const postRouter = require('./data/posts/post-router.js');

// Create Server
const server = express();

// Parse our requests into json
server.use(express.json());

// Use our postRouter
server.use('/api/posts', postRouter)

// Server Test
server.get('/', (req, res) => {
    res.status(200).json('I am alive!')
})

const port = 8000;
server.listen(port, () => {
    console.log(`\n*** Server is running on port ${port} ***\n`)
})