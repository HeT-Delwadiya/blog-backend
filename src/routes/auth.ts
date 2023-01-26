import express from "express";
const router = express.Router();
const {register, login, logout} = require("../controllers/auth");
const { check } = require('express-validator');

router.post("/register", [
     check('name').isLength({ min: 5 }).withMessage('Name must be at least 5 characters long!'),
     check('email').isEmail().withMessage('Enter valid email!'),
     check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 chars long!')
     ], register);

router.post("/login", [
     check('email').isEmail().withMessage('Enter valid email!'),
     check('password').isLength({ min: 5 }).withMessage('Password must contain more than 5 letters!')
     ], login);

router.get("/logout", logout);

module.exports = router;