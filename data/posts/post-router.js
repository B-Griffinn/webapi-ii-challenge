// Separate the endpoints that begin with /api/posts into this router
/* BEGIN CODE */

// Imports
const express = require('express');
const Posts = require('../db.js');

// Create Router
const router = express.Router();
router.use(express.json());

// When the client makes a POST request to /api/posts: ** 
//      It Creates a post using the information sent inside the request body.
// >>> /api/posts
// insert(): calling insert passing it a post object will add it to the database and return an object with the id of the inserted post. The object looks like this: { id: 123 }.

router.post('/', (req, res) => {
    const body = req.body;

    if(!body.title || !body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })   
    } else {
        Posts.insert(body)
        .then(post => {
            res.status(201).json({ newPost: post})
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the post to the database" })
        })
    }
});

// When the client makes a ** POST ** request to /api/posts/:id/comments:

router.post('/:id/comments', (req, res) => {
    // need rew.params.id
    const postId = req.params.id;
    const body = req.body;
    console.log(body)
    if(!postId) {
        res.status(404).json({ message: "The post with the specified ID does not exist." })
    } else if(!body.text) {
        res.status(400).json({ errorMessage: "Please provide text for the comment." })
    } else {
        Posts.insertComment(body)
        .then(comment => {
            res.status(201).json({ newComment: comment })
        })
        .catch(err => {
            res.status(500).json({ error: "There was an error while saving the comment to the database" })
        })
    }
});


// GET ** /api/posts
// Returns an array of all the post objects contained in the database.
router.get('/', (req, res) => {
    Posts.find()
    .then(post => {
        res.status(200).json(post);
    })
    .catch(err => {
        res.status(500).json({ message: "The post with the specified ID does not exist." })
    })
})

// GET** /api/posts/:id	Returns the post object with the specified id
router.get('/:id', (req, res) => {
    const postID = req.params.id;
    Posts.findById(postID)
    .then(post => {
        if(postID) {
            res.status(200).json(post)
        } else {
            res.status(404).json({ message: "The post with the specified ID does not exist." })
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The post information could not be retrieved." })
    })
})


// GET** /api/posts/:id/comments
router.get('/:id/comments', (req, res) => {
    const commentId = req.params.id;

    Posts.findCommentById(commentId)
    .then(comment => {
        if(comment) {
            res.status(200).json({ postComment: comment })
        } else {
            res.status(404).json({ message: "The post with the given ID does not exist"})
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The post information with given id could not be retrieved." })
    })
})



// Always EXPORT
module.exports = router;