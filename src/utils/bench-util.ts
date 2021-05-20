export function timer() {
	var start : Date;
	var _name : string;
	return {
		start: function(name : string) {
			_name = name;
			start = new Date();
		},

		stop: function() {
			var end = new Date();
			var time = end.getTime() - start.getTime();
			console.log('Timer:', _name, 'finished in', time, 'ms');
		},
	};
}
