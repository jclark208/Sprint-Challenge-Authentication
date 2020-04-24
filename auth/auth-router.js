const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = require('express').Router();

const Users = require('../model.js');
const { jwtSecret } = require('../topsecretfolder/secrets');

router.post('/register', (req, res) => {
	const userInfo = req.body;
	const rounds = process.env.HASHING_ROUNDS || 10;
	const hash = bcrypt.hashSync(userInfo.password, rounds);

	userInfo.password = hash;

	Users.add(userInfo)
		.then(user => {
			res.status(200).json(user);
		})
		.catch(err => {
			console.log('Error adding user', err);
		});
});

router.post('/login', (req, res) => {
	const { username, password } = req.body;

	Users.findBy({ username })
		.then(([user]) => {
			if (user && bcrypt.compareSync(password, user.password)) {
				const token = generateToken(user);
				res.status(201).json({ message: 'Logged In', token });
			} else {
				res.status(401).json({ message: 'Error logging in' });
			}
		})
		.catch(err => {
			console.log('Error logging in', err);
		});
});

const generateToken = user => {
	const payload = {
		username: user.username,
		password: user.password
	};

	const options = {
		expiresIn: '1h'
	};

	return jwt.sign(payload, jwtSecret, options);
};

module.exports = router;