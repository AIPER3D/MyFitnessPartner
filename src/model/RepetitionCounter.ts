export default class RepetitionCounter {
	private className : string;
	private enterThreshold : number;
	private exitThreshold : number;

	private poseEntered : boolean;

	private _nRepeats : number;

	constructor(className : string, enterThreshold : number, exitThreshold : number) {
		this.className = className;
		this.enterThreshold = enterThreshold;
		this.exitThreshold = exitThreshold;

		this.poseEntered = false;
		this._nRepeats = 0;
	}

	get nRepeats() {
		return this._nRepeats;
	}

	public count(poseClassification : any) : number {
		let poseConfidence = 0.0;

		if (poseClassification.has(this.className)) {
			poseConfidence = poseClassification[this.className];
		}

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

