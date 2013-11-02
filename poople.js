function Pooper(name, when, globalWhen) {
	var self = this
	self.name  = name
	self.when = ko.observableArray();
	console.log(when, globalWhen)
	for (var i = 0; i < globalWhen.length; i++) {
		if (when.indexOf(globalWhen[i]) != -1)
			self.when.push(true)
		else
			self.when.push(false)
	}
}

function Date2d(date, times) {
	this.date = date;
	this.times = ko.observableArray(times);
}

function PoopleViewModel() {
    var self = this

	self.db = new Firebase("https://poople.firebaseIO.com/")

	self.poopid = null
	self.poop = null

	self.what  = ko.observable()
	self.where = ko.observable()
	self.when  = ko.observableArray()
	self.who   = ko.observableArray()
	self.newGuy = ko.observable()

	self.when2d = ko.computed(function() {
		var computedWhen = {}

		var whens = self.when();
		for (var i = 0; i < whens.length; i++) {
			var datetime = whens[i].split("T");
			var date = datetime[0]
			var time = datetime[1]
			if ( ! (date in computedWhen) ) {
				computedWhen[date] = []
			}
			computedWhen[date].push(time)
		}

		var doubleComputed = ko.observableArray();
		for (var date in computedWhen) {
			doubleComputed.push(new Date2d(date, computedWhen[date]));
		}
		return doubleComputed;
	})

	// var updateData = function(data) {
	// 	console.log("WELCOME TO NEW POOP WORLD", data.val())
	// 	var poople = data.val()

	// 	// DO ACTUAL POOP
	// 	self.what(poople.what)
	// 	self.where(poople.where)
	// 	self.when(poople.when)
	// 	for (var i = 0; i < poople.who.length; i++) {
	// 		self.who.push(new Pooper(poople.who[i].name, poople.who[i].when, poople.when));
	// 	}
	// 	//self.who(poople.who)

	// 	console.log("JOSONN", ko.toJSON({
	// 		what: self.what,
	// 		where: self.where
	// 	}));
	// }

	Sammy(function() {
		this.get("#new", function() {
			// MAIN, GENERATE NEW EVENT UPDATE LOLS
			console.log("MAIN")
		})
		this.get("#/event/:eventid", function() { // /event/ is useless BUT FUTURE PROOF
			// get event stuff from firebase
			self.poopid = this.params.eventid
			console.log("EVENT", poopid)
			self.poop = db.child(poopid)
			poop.child("what").on("value", function(data) {
				self.what(data.val())
			});
			poop.child("where").on("value", function(data) {
				self.where(data.val())
			});
			poop.child("when").on("value", function(data) {
				self.when(data.val())
			});
			poop.child("who").on("value", function(data) {
				var who = data.val();
				self.who.removeAll();
				for (var dude in who) {
					console.log("DUDE", who[dude], self.when())
					self.who.push(new Pooper(who[dude].name, who[dude].when, self.when()));
				}
			});
		})

	    this.get("", function() { this.app.runRoute("get", "#new") })

	}).run()

	// AUTOMAGICAL SAVING TO FIREBASE
	var saver = function(prop, val) {
		self.poop.child(prop).set(val);
	}
	// TODO: beautify
	self.what.subscribe(function(newWhat) {
		saver("what", newWhat);
	});
	self.where.subscribe(function(newWhere) {
		saver("where", newWhere);
	});
	self.newGuy.subscribe(function(newNewGuy) {
		console.log("NEWGUY")
		self.poop.child("who").push({
			"name": newNewGuy,
			"when": [ "titties", "hookers"]
		})
	})
	self.when2d.subscribe(function(newWhen) {
		// TODO
	});
	self.who.subscribe(function(newWho) {
		// TODO
	});

}

ko.applyBindings(PoopleViewModel())

