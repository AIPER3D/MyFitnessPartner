export default class RepetitionCounter {
	private targetClass : string;
	private enterThreshold : number;
	private exitThreshold : number;

	private poseEntered : boolean;

	private _nRepeats : number;

	constructor(targetClass : string, enterThreshold : number, exitThreshold : number) {
		this.targetClass = targetClass;
		this.enterThreshold = enterThreshold;
		this.exitThreshold = exitThreshold;

		this.poseEntered = false;
		this._nRepeats = 0;
	}

	get nRepeats() {
		return this._nRepeats;
	}

	/*

		[
			{
				className : squatTrue,
				score : 0.xx
			},
			{
				className : squatDown,
				score : 0.xx
			},
		]

		{
			sqautTrue : 0.xx,
			sqautDown : 0.xx
		}

	*/

	public count(poseClassification : any) : number {
		let poseConfidence = 0.0;

		// targetClass의 score로 초기화
		// if (poseClassification  this.targetClass) {
		// 	poseConfidence = poseClassification[this.targetClass];
		// }
		poseClassification.forEach( ({className, probability} : {className : string, probability : number}) => {
			if (className == this.targetClass) {
				poseConfidence = probability;
				return;
			}
		});

		if (!this.poseEntered) {
			this.poseEntered = poseConfidence > this.enterThreshold;
			return this._nRepeats;
		}

		if (poseConfidence < this.exitThreshold) {
			this._nRepeats++;
			this.poseEntered = false;
		}

		return this._nRepeats;
	}
}

