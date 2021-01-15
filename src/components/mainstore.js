import { makeAutoObservable } from "mobx";

class MainstoreSingleton {
	constructor() {
		makeAutoObservable(this);
	}
	userDataSet = [];
	init = () => {
		this.userDataSet = this.loadUserData();
	};
	sortUsersByPriority = () => {
		this.userDataSet = this.userDataSet.sort(
			(a, b) =>
				b.dateOfBirth +
				(b.prioritized ? 10000000000 : 0) -
				(a.dateOfBirth + (a.prioritized ? 10000000000 : 0))
		);
	};

	loadUserData = () => {
		//Request Here
		const userDataResult = [
			{
				userId: 21345,
				dateOfBirth: -303684000,
				prioritized: true,
				extendedDataId: 1,
				name: "Kevin",
			},
			{
				userId: 21545,
				dateOfBirth: -303680000,
				prioritized: false,
				extendedDataId: 2,
				name: "Kurt",
			},
			{
				userId: 21555,
				dateOfBirth: -303284000,
				prioritized: true,
				extendedDataId: 3,
				name: "Karen",
			},
			{
				userId: 21445,
				dateOfBirth: -303288000,
				prioritized: true,
				extendedDataId: 4,
				name: "Kenobi",
			},
			{
				userId: 21447,
				dateOfBirth: -303218000,
				prioritized: false,
				extendedDataId: 5,
				name: "Leroy",
			},
		];
		const userData = userDataResult.map(
			(data) =>
				(data = {
					...data,
					...this.loadExtendedUserData(data.extendedDataId),
				})
		);
		return userData;
	};
	loadExtendedUserData = (extendedDataId) => {
		const extendedData = [
			{
				id: 1,
				patientStory: ["halbes hirn fehlt", "lungenkrebs"],
				coronaInfection: false,
				previousCoronaInfection: false,
			},
			{
				id: 2,
				patientStory: [],
				coronaInfection: false,
				previousCoronaInfection: false,
			},
			{
				id: 3,
				patientStory: [],
				coronaInfection: true,
				previousCoronaInfection: false,
			},
			{
				id: 3,
				patientStory: [],
				coronaInfection: true,
				previousCoronaInfection: true,
			},
		];
		return extendedData.find((dataitem) => dataitem.id === extendedDataId);
	};
}
export const MainStore = new MainstoreSingleton();
