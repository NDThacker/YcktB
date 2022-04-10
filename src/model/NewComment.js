class NewComment {
	constructor(email, content)
	{
		this.commentContent = content;
		this.author = email;
		this.commentLikesCOunter = 0;
	}
}

module.exports = NewComment;