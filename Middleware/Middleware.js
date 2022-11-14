const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

exports.middle = function (req, res, next)
{
    if (!req.headers.authorization)
    {
        return next(res.status(401).send({ message: "Unauthorized access" }))
    } else
    {

        let jwtSecretKey = process.env.JWT_SECRET_KEY;
        decryptedToken = jwt.verify(req.headers.authorization, jwtSecretKey)
        if (decryptedToken)
        {
            next()
        } else
        {
            res.status(401).send({ message: 'Invlaid Access Token' })
        }
    }
}