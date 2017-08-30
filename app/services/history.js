var singleton = function singleton() {
    const TAG = 'services.history'
	var history = []

	this.getHistory = function(){
		return history
	}
	
	this.addHistory = function(request){
		history.push({
			query: request.query,
			url: request.url,
			method: request.method
		})
	}
}
singleton.instance = null

singleton.getInstance = function() {
    if (this.instance === null) {
        this.instance = new singleton()
    }
    return this.instance
}


module.exports = singleton.getInstance()