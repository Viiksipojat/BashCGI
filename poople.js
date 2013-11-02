// 2x UUID HELPERS
function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}


function Pooper(name, when, globalWhen) {
	var self = this
	self.name  = name
	self.when = ko.observableArray();
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
	self.newpooper = null

	self.what  = ko.observable()
	self.where = ko.observable()
	self.when  = ko.observableArray()
	self.who   = ko.observableArray()

	// EMPTY ADDER FUCKERS
	self.newDate = ko.observable()
	self.newWho  = ko.observable()
	self.newWhen = ko.observableArray([])

	self.when2d = ko.computed(function() {
		var computedWhen = {}

		var whens = self.when()

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

	self.compWho = ko.computed(function() {
		var computed = [];
		for (var dude in self.who()) {
			if (self.who()[dude].name != self.newWho()) {
				if (self.who()[dude].when)
					computed.push(new Pooper(self.who()[dude].name, self.who()[dude].when, self.when()));
				else
					computed.push(new Pooper(self.who()[dude].name, [], self.when()))
				}
		}
		return computed;
	})

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
				self.when(data.val() || [])
			});
			poop.child("who").on("value", function(data) {
				self.who(data.val());
			});
		})

	    this.get("", function() {
	    	var eventid = guid();

	    	location.hash = "/event/" + eventid;
	    })

	}).run()

	// AUTOMAGICAL SAVING TO FIREBASE
	var saver = function(prop, val) {
		self.poop.child(prop).set(val);
	}
	var saveNewPooper = function() {
		console.log("newpooper", self.newpooper)
		if (! self.newpooper) {
			self.newpooper = self.poop.child("who").push({
				"name": self.newWho(),
				"when": self.newWhen()
			})
		}
		else {
			self.newpooper.set({
				"name": self.newWho(),
				"when": self.newWhen()
			})
		}
	}

	// TODO: beautify
	self.what.subscribe(function(newWhat) {
		saver("what", newWhat);
	});
	self.where.subscribe(function(newWhere) {
		saver("where", newWhere);
	});

	self.newDate.subscribe(function(newDate) {
		console.log("NEW DATE POOPED", newDate)
		console.log("NEW", self.when())
		self.when.push(newDate)
		console.log("NEW", self.when())
		saver("when", self.when());
	});
	self.newWho.subscribe(function(newNewWho) {
		saveNewPooper()
	})
	self.newWhen.subscribe(function(newNewWhen) {
		saveNewPooper()
	});
	self.when2d.subscribe(function(newWhen) {
		// TODO
	});

}

ko.applyBindings(PoopleViewModel())

