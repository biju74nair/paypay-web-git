var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/qrappdb');

// private constructor:

var Session = module.exports = function Session(_node) {
	this._node = _node;
};

// public instance properties:

Object.defineProperty(Session.prototype, 'id', {
	get : function() {
		return this._node.id;
	}
});

Object.defineProperty(Session.prototype, 'merchantid', {
	get : function() {
		return this._node.data['merchantid'];
	},
	set : function(merchantid) {
		this._node.data['merchantid'] = merchantid;
	}
});

Object.defineProperty(Session.prototype, 'customerid', {
	get : function() {
		return this._node.data['customerid'];
	},
	set : function(customerid) {
		this._node.data['customerid'] = customerid;
	}
});

Object.defineProperty(Session.prototype, 'paycode', {
	get : function() {
		return this._node.data['paycode'];
	},
	set : function(paycode) {
		this._node.data['paycode'] = paycode;
	}
});

Session.create = function(session, callback) {
	// Set our collection
	var collection = db.get('sessions');

	// remove if already exist
	collection.insert({
		"merchantid" : session.merchantid,
		"customerid" : session.customerid,
		"paycode" : session.paycode
	}, function(err, session) {
		callback(err, session);
	});

};

Session.remove = function(merchantid, callback) {
	// Set our collection
	var collection = db.get('sessions');

	// Submit to the DB
	collection.remove({
		merchantid : merchantid
	}, function(err, numberOfRemovedDocs) {
		if (err)
			callback(err);
		else
			callback(undefined, (numberOfRemovedDocs === 1));
	});
};

Session.getByMerchantId = function(merchantid, callback) {
	var collection = db.get('sessions');
	collection.findOne({
		merchantid : merchantid
	}, function(err, session) {
		callback(err, session);
	});
};
