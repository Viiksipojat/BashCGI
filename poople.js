function Pooper(name, when) {
	var self = this
	self.name  = name
	self.when = ko.observableArray(times)
}


function PoopleViewModel() {
    var self = this

	self.db = new Firebase("https://poople.firebaseIO.com/")

	self.what  = ko.observable()
	self.where = ko.observable()
	self.when  = ko.observableArray()
	self.who   = ko.observableArray()

    // Behaviours
    // self.goToFolder = function(folder) { location.hash = folder }
    // self.goToMail = function(mail) { location.hash = mail.folder + '/' + mail.id }

	var showPoop = function(data) {
		console.log("WELCOME TO NEW POOP WORLD", data.val())
		var poople = data.val()

		// DO ACTUAL POOP
		self.what(poople.what)
		self.where(poople.where)
		self.when(poople.when)
		self.who(poople.who)
	}

	Sammy(function() {
		this.get("#new", function() {
			// MAIN, GENERATE NEW EVENT UPDATE LOLS
			console.log("MAIN")
		})
		this.get("#/event/:eventid", function() { // /event/ is useless BUT FUTURE PROOF
			// get event stuff from firebase
			var poopid = this.params.eventid
			console.log("EVENT", poopid)
			var poop = db.child(poopid)
			poop.on("value", showPoop)
		})

	    this.get("", function() { this.app.runRoute("get", "#new") })

	}).run()

}

ko.applyBindings(PoopleViewModel())

