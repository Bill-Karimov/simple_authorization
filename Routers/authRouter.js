const Router = require('express');
const router = new Router();
const controller = require('../Controllers/authController');
const {check} = require('express-validator');
const authMiddlewaree = require('../middlewaree/authMiddlewaree');
const roleMiddlewaree = require('../middlewaree/roleMiddlewaree');

router.post('/registration', [
    check('username', 'username cannot be empty').notEmpty(),
    check('password', 'password must be longer than 8 characters').isLength({min:8})
], controller.registration);

router.post('/login', controller.login);
router.get('/users', roleMiddlewaree(["ADMIN"]), controller.getUsers);

module.exports = router;