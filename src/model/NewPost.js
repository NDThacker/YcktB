class NewPost {
	constructor(obj) {
		//this.visibility = obj.visibility;
		this.postContent = obj.content;
		this.title = obj.title;
		this.author = obj.author;
		this.createTime = new Date();
		this.postLikesCounter = obj.postLikesCounter;
	}
}

module.exports = NewPost;