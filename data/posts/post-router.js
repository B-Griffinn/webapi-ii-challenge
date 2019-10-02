// Separate the endpoints that begin with /api/posts into this router
/* BEGIN CODE */

// Imports
const express = require('express');
const Posts = require('../db.js');

// Create Router
const router = express.Router();
// Parse incoming requests
router.use(express.json());


// #1 POST ** >>> /api/posts
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


// #2 POST** >>> /api/posts/:id/comments
router.post('/:id/comments', (req, res) => {
    const postId = req.params.id;
    const body = req.body;
    if (!body.text) {
      res.status(400).json({ errorMessage: 'Please provide text for the comment.' });
    }


    Posts.findCommentById(postId)
    .then(id => {
      if (id.length === 0) {
        res.status(404).json({ message: 'The post with the specified ID does not exist.' });
      } else {
        Posts.insertComment(body)
        .then(id => {
            Posts.findCommentById(id.id)
            .then(newComment => {
              res.status(201).json(newComment);
            })
            .catch(err => {
              res.status(500).json({ error: 'The posts information could not be retrieved.' });
            });
        });
      }
    });
  });


// #3 GET ** /api/posts
// Returns an array of all the post objects contained in the database.
router.get('/', (req, res) => {
    Posts.find()
    .then(post => {
        res.status(200).json(post);
    })
    .catch(err => {
        res.status(500).json({ message: "The post with the specified ID does not exist." })
    })
});


// #4 GET** /api/posts/:id	Returns the post object with the specified id
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
});


// #5 GET** /api/posts/:id/comments	Returns an array of all the comment objects associated with the post with the specified id.
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
});



// #6 DELETE**	/api/posts/:id	Removes the post with the specified id and returns the deleted post object. You may need to make additional calls to the database in order to satisfy this requirement.
router.delete('/:id', (req, res) => {
    const delId = req.params.id;
    Posts.findById(delId)
    .then(post => {
        if(post.length > 0) {
            res.status(200).json({ deltedPost: post })
            Posts.remove(delId)
            .then()
            .catch(err => {
            res.status(500).json({ error: "The post could not be removed" })
           })
        } else {
            res.status(404).json({ message: 'The post with the specified ID does not exist.' })
        } 
    })
})

// #7 PUT** api/posts/:id Updates the post with the specified id using data from the request body. Returns the modified document, NOT the original.
// update(): accepts two arguments, the first is the id of the post to update and the second is an object with the changes to apply. It returns the count of updated records. If the count is 1 it means the record was updated correctly.

router.put('/:id', (req, res) => {
    const body = req.body;
    const id = req.params.id;

    if(!body.title || !body.contents) {
        res.status(400).json({ errorMessage: "Please provide title and contents for the post." })
    } else {
        Posts.update(id, body)
        .then(() => {
            Posts.findById(id)
            .then(post => {
                if(post) {
                    res.status(200).json(post)
                } else {
                    res.status(404).json({ message: "The post with the specified ID does not exist." })
                }
            })
            .catch(err => {
                res.status(500).json({ error: "The post information could not be modified." })
            })
        })
    }
})


// Always EXPORT
module.exports = router;