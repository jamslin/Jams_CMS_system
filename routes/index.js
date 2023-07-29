const express = require('express')
const router = express.Router()

router.get('/', (req, res)=>{
        console.log(req)
    res.render('index', {title: "Home page"})
})

module.exports = router