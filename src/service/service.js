const model = require('../model/model');


const service = {};


//sign up service
service.signUpUser = (User) => {
	return model.signUpUser(User).then(status => {
		if(status) return status;
		else {
			let error = new Error("Signing up failed");
			error.status = 406;
			throw error;
		}
	})
}


//login service
service.logInUser = (creds) => {
	return model.logInUser(creds.email, creds.password).then(udata => {
		if(udata) return udata;
		else {
			let error = new Error("Email or Password incorrect");
			error.status = 406;
			throw error;
		}
	})
}

//service to get a post by its id
service.getPostById = (pid) => {
	return model.getPostById(pid).then(pdata => {
		if(pdata) return pdata;
		else {
			let err = new error("No such Post found");
			err.status = 404;
			throw err;
		}
	})
}

//service to submit a post
service.submitPost = (post, email) => {
	return model.submitPost(post).then(pid => {
		if(pid)
		{
			return model.submitPostToUser(post, pid, email).then(status => {
				if(status) return status;
				else {
					let err = new error("Invalid User");
					err.status = 406;
					throw err;
				}
			})
		}
		else {
			let err = new error("Cannot submit the post, pls check post object");
			err.status = 406;
			throw err;
		}
	})
}


//Service to Add a Like to a post
service.addLikeToPost = (email, name, pid) => {
	return model.addUserToPostLikers(email, name, pid).then(status => {
		if(status)
		{
			return model.addPostLiked(email, pid).then(pLikedData => {
				if(pLikedData) return pLikedData;
				else {
					let err = new error("Invalid User");
					err.status = 406;
					throw err;
				}
			})
		}
		else {
			let err = new error("Invalid Post");
			err.status = 406;
			throw err;
		}
	})
}


//Service to add a like to a comment in a post
service.addLikeToComment = (email, name, cid, pid) => {
	return model.addUserToCommentLikers(email, name, cid, pid).then(status => {
		if(status)
		{
			return model.addCommentLiked(email, cid).then(cLikedData => {
				if(cLikedData) return cLikedData;
				else {
					let err = new error("Invalid User");
					err.status = 406;
					throw err;
				}
			})
		}
		else {
			let err = new error("Invalid Post OR Comment");
			err.status = 406;
			throw err;
		}
	})
}


//Remove a like from a post
service.removeLikeFromPost = (email, pid) => {
	return model.removeUserFromPostLikers(email, pid).then(status => {
		if(status)
		{
			return model.removeUserPostLike(email, pid).then(newPLikedData => {
				if(newPLikedData) return newPLikedData;
				else {
					let err = new error("Invalid User");
					err.status = 406;
					throw err;
				}
			})
		}
		else {
			let err = new error("Invalid Post");
			err.status = 406;
			throw err;
		}
	})
}

//Remove a like from a comment in a post
service.removeLikeFromComment = (email, cid, pid) => {
	return model.removeUserFromCommentLikers(userObj, cid, pid).then(status => {
		if(status)
		{
			return model.removeUserCommentLike(email, cid).then(newCLikedData => {
				if(newCLikedData) return newCLikedData;
				else {
					let err = new error("Invalid User");
					err.status = 406;
					throw err;
				}
			})
		}
		else {
			let err = new error("Invalid Post OR Comment");
			err.status = 406;
			throw err;
		}
	})
}

//Service to add a comment to a post
service.addComment = (email, pid, content) => {
	return model.addCommentToPost(email, pid, content).then(status => {
		if(status) {
			return model.addCommentToUser(email, pid, content).then(commentCreated => {
				if(commentCreated) return commentCreated;
				else{
					let err = new error("Invalid User");
					err.status = 406;
					throw err;
				}
			})
		}
		else {
			let err = new error("Invalid Post");
			err.status = 406;
			throw err;
		}
	})
}


//Service to get lastet users liking latest post
service.getLatestLikersOfPost = (email) => {
	return model.getLatestPostId(email).then(pid => {
		if(pid) {
			return model.getLatestLikesOnPost(pid).then(latestUsers => {
				if(latestUsers) return latestUsers;
				else{
					let err = new error("Invalid User");
					err.status = 406;
					throw err;
				}
			})
		}
		else 
		{
			let err = new error("Invalid user or User has no Posts yet");
			err.status = 406;
			throw err;
		}
	})
}


//Service to get latest likers of latest comment of user
service.getLatestLikersOfLatestComment = (email) => {
	return model.getLatestCommentIdAndPostId(email).then(cpObj => {
		if(cpObj) {
			return model.getLatestLikesOnComment(cpObj.cid, cpObj.pid).then(latestUsers => {
				if(latestUsers != null) return latestUsers;
				else {
					let err = new error("User has no Comment yet");
					err.status = 406;
					throw err;
				}
			})
		}
		else {
			let err = new error("Invalid user or User has no Comment yet");
			err.status = 406;
			throw err;
		}
	})
}

//Service to get latest likers of comment of any post
service.getLatestLikersOfComment = (cid, pid) => {
	return model.getLatestLikesOnComment(cid, pid).then(latestUsers => {
		if(latestUsers != null) return latestUsers;
		else {
			let err = new error("User has no Comment yet");
			err.status = 406;
			throw err;
		}
	})
}


//Service to get latest comments on any post
service.getLatestCommentsOfPost = (pid) => {
	return model.getLatestCommentsOnPost(pid).then(latestUsers => {
		if(latestUsers != null) return latestUsers;
		else {
			let err = new error("User has no post yet or no comments yet on given post");
			err.status = 406;
			throw err;
		}
	})
}

//Service to get latest comments on user latet post
service.getLatestCommentsOfLatestPost = (email) => {
	return model.getLatestPostId(email).then(pid => {
		if(pid)
		{
			return model.getLatestCommentsOnPost(pid).then(latestUsers => {
				if(latestUsers != null) return latestUsers;
				else {
					let err = new error("User has no post yet or no comments yet on given post");
					err.status = 406;
					throw err;
				}
			})	
		}
		else{
			let err = new error("User has no post yet");
			err.status = 406;
			throw err;
		}
	})
}

module.exports = service;