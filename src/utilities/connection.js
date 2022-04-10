const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const connection = {};
const dbUrl = 'mongodb://localhost:27017/';

let userDetails = new Schema({
	email: { type: String, required: true },
	name: { type: String, required: true}
})

let commentSchema = new Schema({
	_id: { type: String },
	postId: { type: String },
	commentContent: { type: String, required: true },
	commentLikesCounter: { type: Number, default: 0 },
	commentLikers: { type: [userDetails], default: [] },
	author: { type: String, required: true },
	creationTime: { type: Date, default: new Date() }
}, { collection: 'Posts' });

let postSchema = new Schema({
	_id: { type: String },
	title: { type: String, required: true },
	author: { type: String, required: true },
	creationTime: { type: Date, default: new Date() },
	postContent: { type: String, required: true},
	comments: { type: [commentSchema], default: [] },
	postLikesCounter: { type: Number, default: 0 },
	postLikers: { type: [userDetails], default: [] },
	visibility: { type: String, enum: ['Public', 'Private'], default: 'Public' }
}, { collection: 'Posts' });

let userSchema = new Schema({
	_id: { type: String, required: true },
	password: { type: String, required: true },
	name: { type: String, required: true },
	postLiked: { type: [String], default: [] },
	commentLiked: { type: [String], default: [] },
	postCreated: { type: [postSchema], default: [] },
	commentCreated: { type: [commentSchema], default: [] }
}, { collection: 'Users' });

connection.getUserCollection = () => {
	return mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(conn => {
		return conn.model('Users', userSchema);
	})
}

connection.getPostsCollection = () => {
	return mongoose.connect(dbUrl, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(conn => {
		return conn.model('Posts', postSchema);
	})
};

module.exports = connection;