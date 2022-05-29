const User = require('./model')

exports.renderFirstPage = async (req, res, next) => {
    res.render('./main.html')
}

exports.loginUser = async (req, res, next) => {
    const user = await User.find({ "name": req.body.name })

    req.user = user;

    res.status(200).json({
        sucess: true,
        user
    })
}

exports.createUser = async (req, res, next) => {
    const user = await User.create(req.body)

    res.status(200).json({
        sucess: true,
        user
    })
}

exports.getAllUsers = async (req, res, next) => {
    const users = await User.find();

    res.status(200).json({
        sucess: true,
        users
    })
}

exports.getHighScore = async (req, res, next) => {
    const users = await User.find();

    let maxScore = 0;

    users.forEach(user => {
        user.scores.forEach(score => {
            if(score.score>maxScore) maxScore = score.score
        })
    })

    res.status(200).json({
        sucess: true,
        maxScore
    })
}

exports.updateScore = async (req, res, next) => {
    const user = await User.findOne({ "name": req.body.name })

    const score = { "score": req.body.score }


    if (user && user.scores) {
        user.scores.push(score)
    } else {
        user.scores = [score]
    }

    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        sucess: true,
        user
    })
}