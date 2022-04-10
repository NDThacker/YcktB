const connection = require('../utilities/connection');
const NewPost = require('./NewPost');
const NewUser = require('./NewUser');
const NewComment = require('./NewComment');
const latestuserCount = -10;

function generateNewId() {
	let s = Math.random();
	s = s * (10e16) / (new Date().getTime())
	s = s.toString(36).replace('.', '');
	return s;
}

const model = {};


//Signing up an User
model.signUpUser = (User) => {
	let newUser = new NewUser(User);
	return connection.getUserCollection().then(db => {
		return db.create(newUser).then(udata => {
			if (udata) {
				return true;
			}

			else return null;
		})
	})
}

//Logging an User
model.logInUser = (email, password) => {
	return connection.getUserCollection().then(db => {
		return db.findById(email).then(udata => {
			if (udata && udata.password == password) {
				delete udata.password;
				return udata;
			}
			else return null;
		})
	})
}

//Get a post by id
model.getPostById = (pid) => {
	return connection.getPostsCollection().then(db => {
		return db.findById(pid).then(pdata => {
			return pdata;
		})
	})
}

//Submitting a Post into Post Collection
model.submitPost = (post) => {
	return connection.getPostsCollection().then(db => {
		let postObj = new NewPost(post);
		postObj._id = generateNewId();
		return db.create(postObj).then(pdata => {
			if(pdata) return pdata._id;
			else return null;
		})
	})
}

//Submitting a Post into User Collection
//Subsequently be called after Submitting the same post into User Collection
model.submitPostToUser = (post, pid, email) => {
	return connection.getUserCollection().then(db => {
		let postObj = new NewPost(post);
		postObj._id = pid;
		return db.findByIdAndUpdate(email, { $push: { postCreated: postObj }}, { new: true }).then(udata => {
			if(udata) return true;
			else return null;
		})
	})
}


//Adding a liked to post to an User
model.addPostLiked = (email, pid) => {
	return connection.getUserCollection().then(db => {
		return db.findByIdAndUpdate(email, { $push: { postLiked: pid }}, { select: postLiked }).then(postLiked => {
			if(postLiked) return postLiked;
			else return null;
		})
	})
}

//Updating postLiked for an User
model.updatePostLikedInUser = (postLiked, email) => {
	return connection.getUserCollection().then(db => {
		return db.findByIdAndUpdate(email, { $set: { postLiked: postLiked }}, { select: postLiked }).then(postLiked => {
			if(postLiked) return true;
			else return null;
		})
	})
}

//Updating postCreated list in User collection
model.updatePostCreatedInUser = (postCreated, email) => {
	return connection.getUserCollection().then(db => {
		return db.findByIdAndUpdate(email, { $set: { postCreated: postCreated }}, { select: postCreated}).then(postCreated => {
			if(postCreated) return true;
			else return null;
		})
	})
}

//Add Comment Liked
model.addCommentLiked = (email, cid) => {
	return connection.getUserCollection().then(db => {
		return db.findByIdAndUpdate(email, { $push: { commentLiked: cid }}, { select: commentLiked }).then(commentLiked => {
			if(commentLiked) return commentLiked;
			else return null;
		})
	})
}

//Updating commentLiked for an User
model.updateCommentLikedInUser = (commentLiked, email) => {
	return connection.getUserCollection().then(db => {
		return db.findByIdAndUpdate(email, { $set: { commentLiked: commentLiked }}, { select: commentLiked }).then(commentLiked => {
			if(commentLiked) return true;
			else return null;
		})
	})
}

//Adding User to postLikers
model.addUserToPostLikers = (email, name, pid) => {
	return connection.getPostsCollection().then(db => {
		return db.findByIdAndUpdate(pid, { $push: { postLikers: {email: email, name: name}}}, { select: postLikers}).then(pLikers => {
			if(pLikers) return true;
			else return null;
		})
	})
}


//Adding an user's like to comment in post collection
model.addUserToCommentLikers = (email, name, cid, pid) => {
	return connection.getPostsCollection().then(db => {
		return db.findById(pid).then(pdata => {
			let comments = pdata["comments"];
			let updatedComments = comments.map((cobj) => {
				if(cobj[_id] == cid)
				{
					cobj["commentLikers"].push({email: email, name: name});
					cobj["commentLikesCounter"]++;
				}
				return cobj;
			});
			return db,findByIdAndUpdate(pid, { $set: { comments: updatedComments}}, { select: comments }).then(comments => {
				if(comments) return true;
				else return null;
			})
		})
	})
}

//removing an user's like from a comment from posts
model.removeUserFromCommentLikers = (email, cid, pid) => {
	return connection.getPostsCollection().then(db => {
		return db.findById(pid).then(pdata => {
			let comments = pdata["comments"];
			let updatedComments = comments.map((cobj) => {
				if(cobj[_id] == cid)
				{
					updatedCommentLikers = cobj["commentLikers"].filter(user => {
						return user.email != email;
					});
					cobj["commentLikers"] = updatedCommentLikers;
					cobj["commentLikersCounter"]--;
				}
				return cobj;
			});
			return db,findByIdAndUpdate(pid, { $set: { comments: updatedComments}}, { selecr: comments }).then(comments => {
				if(comment) return true;
				else return null;
			})
		})
	})
}

//removing an user's comment like from user collection
model.removeUserCommentLike = (email, cid) => {
	return connection.getUserCollection().then(db => {
		return db.findById(email).then(udata => {
			let cLiked = udata["commentLiked"].filter(cids => {
				return cids != cid;
			});
			return db.findByIdAndUpdate(email, { $set: { commentLiked: cLiked}}, { select: commentLiked}).then(newCLiked => {
				if(newCLiked) return newCLiked;
				else return null;

			})
		})
	})
}

//removing an user's post like from post collection
model.removeUserFromPostLikers = (email, pid) => {
	return connection.getPostsCollection().then(db => {
		return db.findById(pid).then(pdata => {
			let pLiked = pdata[postLikers].filter(users => {
				return users.email != email;
			});
			return db.findByIdAndUpdate(pid, { $set: { postLikers: pLiked, postLikedCounter: pdata.postLikedCounter - 1 }}, { select: postLikers}).then(postLikers => {
				if(postLikers) return true;
				else return null;
			})

		})
	})
}

//removing an user's post like from user collection
model.removeUserPostLike = (email, pid) => {
	return connection.getUserCollection().then(db => {
		return db.findById(email).then(udata => {
			let pLiked = udata["postLiked"].filter(pids =>{
				return pids != pid;
			});
			return db.findByIdAndUpdate(email, { $set: { postLiked: pLiked}}, { select: postLiked}).then(newPLiked => {
				if(newPLiked) return newPLiked;
				else return null;

			})
		})
	})
}

//Add a comment to a post
model.addCommentToPost = (email, pid, content) => {
	return connection.getPostsCollection().then(db => {
		let newComment = new NewComment(email, content);
		newComment._id = generateNewId();
		newComment.postId = pid;
		return db.findByIdAndUpdate(pid, { $push: { comments: newComment}}, { select: comments}).then(comments => {
			if(comments) return true;
			else return null;
		})
	})
}

//Add a comment to User collection
model.addCommentToUser = (email, pid, content) => {
	return connection.getUserCollection().then(db => {
		let newComment = new NewComment(email, content);
		newComment._id = generateNewId();
		newComment.postId = pid;
		return db.findByIdAndUpdate(email, { $push: { commentCreated: newComment}}, { select: commentCreated}).then(commentCreated => {
			if(commentCreated) return newComment;
			else return null;
		})
	})
}

//Get latest pid for an User
model.getLatestPostId = (email) => {
	return connection.getUserCollection().then(db => {
		return db.findById(email).then(uData => {
			if(udata && uData["postCreated"].pop()) return uData["postCreated"].pop()["_id"];
			else return null;
		})
	})
}


//Get latest cid and pid for an user
model.getLatestCommentIdAndPostId = (email) => {
	return connection.getUserCollection().then(db => {
		return db.findById(email).then(uData => {
			if(udata && uData["commentCreated"].pop()) {
				let lastComment = uData["commentCreated"].pop();
				return { cid: lastComment["_id"], pid: lastComment["pid"] }
			}
			else return null;
		})
	})
}

//Get latest likes on a pid
model.getLatestLikesOnPost = (pid) => {
	return connection.getPostsCollection().then(db => {
		return db.findById(pid).then(pdata =>{
			let latestUsers = pdata["postLikers"].slice(latestuserCount);
			latestUsers.map(user => {
				return user.name;
			})
			return latestUsers;
		})
	})
}

//Get latest likes on comment of a post
model.getLatestLikesOnComment = (cid, pid) => {
	return connection.getPostsCollection().then(db => {
		return db.findById(pid).then(pdata => {
			if(pdata) {
				let reqComment = pdata.comments.filter(comm => {
					return comm._id == cid;
				})

				if(reqComment == []) return null;
				let latestUsers = reqComment[0].commentLikers.slice(latestuserCount);
				latestUsers.map(user => {
					return user.name;
				})
				return latestUsers;
			}
			else return null;
		})
	})
}


//Get latest comment on a post
model.getLatestCommentsOnPost = (pid) => {
	return connection.getPostsCollection().then(db => {
		return db.findById(pid).then(pdata =>{
			if(pdata) {
				let latestUsers = pdata["comments"].slice(latestuserCount);
				latestUsers.map(comment => {
					return comment.author;
				})
				return latestUsers;
			}
			else return null;
		})
	})
}
module.exports = model;