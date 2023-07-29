const express = require('express')
const router = express.Router()
const CommonModel = require('../models/allData');

router.get('/', async (req, res)=>{
    let data
    try {
        data = await CommonModel.find()
      } catch {
        data = ['shit']
      }
    console.log(data)

    res.render('index.ejs', {title: "Home page", data: data})
})

module.exports = router