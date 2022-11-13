// implement your posts router here
const express = require('express');
const Post = require('./posts-model');
const router = express.Router();

router.get('/', (req, res) => {
    Post.find()
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(500).json({
                message: "The posts information could not be recieved",
                error: err
            })
        })
})
router.get('/:id', (req, res) => {
    const id = req.params.id
    Post.findById(id)
        .then((data) => {
            if (!data) {
                res.status(404).json({
                    message: "There is no data found with specific ID"
                })
            }
            res.status(200).json(data)
        })
        .catch((err) => {
            res.status(500).json({
                message: "Could not find particular post by id",
                error: err
            })
        })
})

router.post('/', (req, res) => {
    const { title, contents } = req.body;
    if (!title || !contents) {
        res.status(400).json({
            message: 'Please provide title and contents for the post'
        })
    } else {
        Post.insert({ title, contents })
            .then(({ id }) => {
                return Post.findById(id)
            }).then((post) => {
                res.status(201).json(post)
            }).catch((err) => {
                res.status(500).json({
                    message: "There is a problem saving the items to the database",
                    error: err.message,
                    stack: err.stack
                })
            })
    }
})

router.delete('/:id', (req, res) => {
    const { id } = req.params
    Post.findById(id)
        .then((post) => {
            if (!post) {
                res.status(404).json({
                    message: 'The post with the specified ID does not exist'
                })
            } else {
                res.status(200).json(post)
                return Post.remove(id)
            }
        }).catch((err) => {
            res.status(500).json({
                message: "The post could not be deleted",
                err: err.message,
                stack: err.stack
            })
        })
})


router.put('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then((post) => {
            if (!post) {
                res.status(404).json({
                    message: "The post with the specified ID does not exist"
                })
            } else {
                return Post.update(req.params.id, req.body);
            }
        }).then((post) => {
            if (post) {
                return Post.findById(req.params.id)
            }
        })
        .then((post) => {
            if (post) {
                res.json(post)
            }
        })
        .catch((err) => {
            res.status(500).json({
                message: "The posts information count not be recieved",
                err: err.message,
                stack: err.stack
            })
        })
})

router.get('/:id/messages', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            res.status(400).json({
                message: "the post with the specified does not exist"
            })
        } else {
            const messages = await Post.findPostComments(req.params.id)
            res.json(messages)
        }
    } catch (err) {
        res.status(500).json({
            message: "The comments information could not be retrieved",
            err: err.message,
            stack: err.stack
        })
    }
})

module.exports = router;