class NewUser {
	constructor(obj)
	{
		this._id = obj.email;
		this.name = obj.name;
		this.password = obj.password;
	}
}

module.exports = NewUser;