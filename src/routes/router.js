const express = require('express');
const router = express.Router();
const sanitize = require('mongo-sanitize');
const service = require('../service/service');


/*Get a post
requires postId
if not found gives 404*/
router.get('/getpostbyid/:pid', (req, res, next) => {
	let pid = sanitize(req.params.id);
	service.getPostById(pid).then(pdata => {
		res.json(pdata);
	}).catch(err => next(err))
})

/*submit a post
req.body requires a post object having title, content
req.body requires the email of logged in user who is posting
error 406 is returned in case of invalid inputs*/
router.post('/submitpost', (req, res, next) => {
	service.submitPost(req.body.post, req.body.email).then(status => {
		res.json(status);
	}).catch(err => next(err))
})

/*Put a like to a post
req.body requires a user email who is performing the like operation
req.body requires the pid of post
error 406 on invalid inputs*/
router.put('/addliketopost', (req, res, next) => {
	service.addLikeToPost(req.body.email, req.body.pid).then(plikedData => {
		res.json(plikedData);
	}).catch(err => next(err))
})


/*Put a like to a comment of a post
req.body requires the user email who is performing the like
req.body requires postid and commentid
error 406 on invalid inputs*/
router.put('/addliketocomment', (req, res, next) => {
	service.addLikeToComment(req.body.email, req.body.cid, req.body.pid).then(cLikedData => {
		res.json(cLikedData);
	}).catch(err => next(err))
})

/*Post a comment to a post
req.body requries the user email
req.body requries the post id, comment content
error 406 on invalid inputs*/
router.post('/submitcomment', (req, res, next) => {
	service.addComment(req.body.email, req.body.pid, req.body.content).then(status => {
		res.json(status);
	}).catch(err => next(err))
})

/*Remove like from a comment in a post
req.body requires user email, post id, comment id
error 406, for invalid input*/
router.put('/removelikefromcomment', (req, res, next) => {
	service.removeLikeFromComment(req.body.email, req.body.cid, req.body.pid).then(newCLikedData => {
		res.json(newCLikedData);
	}).catch(err => next(err))
})

/*Remove like from a post
req.body requries user email, post id
error 406, for invalid input*/
router.put('/removelikefrompost', (req, res, next) => {
	service.removeLikeFromPost(req.body.email, req.body.pid).then(newPLikedData => {
		res.json(newPLikedData);
	}).catch(err => next(err))
})


/*user sign up
	require req body object email, name and password returns the same object back
	else returns error with 406 status */
router.post('/signup',(req, res, next) => {
	let User = sanitize(req.body);
	service.signUpUser(User).then(status => {
		res.json(status);
	}).catch(err => next(err));
})
	
	
/*post request for logging in
	require req body object with email and password
	return user data if creds are valid, else 406 error */
router.post('/login', (req, res, next) => {
	console.log(req.body);
	let creds = sanitize(req.body);
	service.logInUser(creds).then(udata => {
		res.json(udata);
	}).catch(err => next(err));
})

module.exports = router;