export function timer(isLog : boolean) {
	var start : Date;
	var _isLog : boolean = isLog;
	var _name : string | undefined;
	return {
		start: function(name? : string) {
			_name = name;
			start = new Date();

			return start.getTime();
		},

		stamp: function() {
			return new Date().getTime();
		},

		stop: function() {
			var end = new Date();
			var time = end.getTime() - start.getTime();
			if (_isLog) {
				console.log('Timer:', _name, 'finished in', time, 'ms');
			}

			return time;
		},
	};
}
