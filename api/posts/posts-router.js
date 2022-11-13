// implement your posts router here
const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.send("Test");
})
router.get('/:id', (req, res) => {

})
router.post('/', (req, res) => {

})
router.delete('/:id', (req, res) => {

})
router.put('/:id', (req, res) => {

})

router.get('/', (req, res) => {

})

module.exports = router;