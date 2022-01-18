const express = require('express')
const router = express.Router()
const User = require('../models/Signup')
const Contestant = require('../models/Contestants')
const Comment = require('../models/Comments')
const Like = require('../models/Likes')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, `${req.session.username}-${file.originalname}`)
    }
})
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
})

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.get('/dashboard', (req, res) => {
    if (!req.session.username && !req.session.password) {
        res.redirect('/login')
    } else {
        Contestant.find({}, (err, contestants) => {
            if (err) {
                res.json({
                    message: 'Error',
                    err
                })
            } else {
                res.render('dashboard', {username: req.session.username, pic: req.session.pic, contestants: contestants})
            }
        })
    }
})

router.post('/signup', (req, res) => {
    User.findOne({ username: req.body.username }, (err, user) => {
        if (err) {
            res.json({
                message: 'Error',
                err
            })
        }
        if (user == null) {
            User.create(req.body, (err, user) => {
                if (err) {
                    res.json({
                        message: 'Error',
                        err
                    })
                } else {
                    res.status(200).json({
                        message: 'Success',
                        user
                    })
                }
            })
        } else {
            res.json({
                message: 'Username already exists!',
                user
            })
        }
    })
})

router.post('/login', (req, res) => {
    User.findOne({ username: req.body.username, password: req.body.password }, (err, user) => {
        if (err) {
            res.json({
                message: 'Error',
                err
            })
        }
        if (user == null) {
            res.json({
                message: 'User does not exist!'
            })
        } else {
            req.session.username = req.body.username
            req.session.password = req.body.password
            req.session.pic = ''
            res.status(200).json({
                message: 'Success',
                user
            })
           
        }
    })
})

router.post('/contest', upload.single('pic'), (req, res) => {
    const paths = req.file.path.split('\\')
    const actualPath = paths[1] + '\\' + paths[2]
    req.session.pic = actualPath
    let data = {
        pic: actualPath,
        username: req.session.username
    }
    Contestant.create(data, (err, user) => {
        if (err) {
            res.json({
                message: 'Upload Error!',
                err
            })
        } else {
            res.redirect('/dashboard')
        }
    })
})

router.post('/comment', (req, res) => {
    Comment.create(req.body, (err, comment) => {
        if (err) {
            res.json({
                message: 'Error!',
                err
            })
        } else {
            res.status(200).json({
                message: 'Success',
                comment
            })
        }
    })
})

router.get('/comments', (req, res) => {
    Comment.find({}, (err, comments) => {
        if (err) {
            res.json({
                message: 'Error',
                err
            })
        } else {
            res.status(200).json({
                message: 'Success',
                comments
            })
        }
    })
})

router.post('/like', (req, res) => {
    Like.findOne({ user: req.body.user, contestant: req.body.contestant }, (err, like) => {
        if (err) {
            res.json({
                message: 'Error',
                err
            })
        }
        if (like == null) {
            Like.create(req.body, (err, like) => {
                if(err) {
                    res.json({
                        message: 'Error',
                        err
                    })
                } else {
                    res.status(200).json({
                        message: 'Success',
                        like
                    })
                }
            })
        } else {
            Like.deleteOne({ user: req.body.user, contestant: req.body.contestant }, (err, deletedLike) => {
                if(err) {
                    res.json({
                        message: 'Error',
                        err
                    })
                } else {
                    res.status(200).json({
                        message: 'Like Deleted',
                        deletedLike
                    })
                }
            })
        }
    })
    
})

router.get('/likes', (req, res) => {
    Like.find({}, (err, likes) => {
        if (err) {
            res.json({
                message: 'Error',
                err
            })
        } else {
            res.status(200).json({
                message: 'Success', 
                likes
            })
        }
    })
})

module.exports = router