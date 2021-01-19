import { makeAutoObservable } from "mobx";

class MainstoreSingleton {
	constructor() {
		makeAutoObservable(this);
	}
	currentPage = "def";
	userDataSet = [];
	init = () => {
		this.userDataSet = this.loadUserData();
	};

	calculateSicknessPoints = (person) => {
		return person.patientStory.length * 1000;
	};
	isCoronaFree = (person) => {
		return !(person.coronaInfection || person.previousCoronaInfection);
	};

	calculateAge = (timestamp) => {
		const age = new Date().getFullYear - new Date(timestamp).getFullYear; //TODO
		return age;
	};

	categorize = (person) => {
		if (
			person.fragebogen.bewohner_von_seniorenheim ||
			this.calculateAge(person.dateOfBirth) >= 80 ||
			(person.fragebogen.personal_in_medizinischer_einrichtung &&
				person.fragebogen.expositionsrisiko > 2) ||
			(person.fragebogen.personal_in_medizinischer_einrichtung &&
				person.fragebogen.enger_kontakt_zu_personen_mit_hohem_risiko) ||
			person.fragebogen.pflegepersonal_in_altenpflege ||
			person.fragebogen.kontakt_zu_bewohner_in_seniorenheim
		) {
			return 1;
		} else if (
			this.calculateAge(person.dateOfBirth) >= 75 ||
			(person.fragebogen.personal_in_medizinischer_einrichtung &&
				person.fragebogen.expositionsrisiko > 1) ||
			person.fragebogen.geistige_behinderung ||
			person.fragebogen.versorgung_personen_geistige_behinderung ||
			person.fragebogen.down_syndrom
		) {
			return 2;
		} else if (
			this.calculateAge(person.dateOfBirth) >= 70 ||
			person.fragebogen.organtransplantation ||
			person.fragebogen.vorerkrankung_risiko > 2 ||
			person.fragebogen.bewohner_tätig_in_gemeinschaftsunterkunft ||
			person.fragebogen.enger_kontakt_zu_schwangeren ||
			person.fragebogen.enger_kontakt_zu_personen_mit_hohem_risiko ||
			((person.fragebogen.personal_in_medizinischer_einrichtung ||
				person.fragebogen
					.personal_für_aufrechterhaltung_Krankenhausinfrastruktur) &&
				person.fragebogen.expositionsrisiko > 1) ||
			person.fragebogen.teilbereich_ögd
		) {
			return 3;
		} else if (
			this.calculateAge(person.dateOfBirth) >= 65 ||
			person.fragebogen.vorerkrankung_risiko > 1 ||
			(person.fragebogen.personal_in_medizinischer_einrichtung &&
				person.fragebogen.expositionsrisiko > 0) ||
			person.fragebogen.lehrer_erzieher ||
			person.fragebogen.prekäre_bedingungen
		) {
			return 4;
		} else if (
			this.calculateAge(person.dateOfBirth) >= 60 ||
			person.fragebogen.schlüsselpositionen_der_landes_bundesregierung ||
			person.fragebogen.beschäftigte_einzelhandel ||
			(person.fragebogen
				.personen_zur_aufrechterhaltung_der_öffentlichen_Sicherheit &&
				person.fragebogen.expositionsrisiko > 0) ||
			person.fragebogen.berufe_der_kritischen_infrastruktur
		) {
			return 5;
		} else {
			return 6;
		}
	};

	compareTwoAndGiveAnswerString = (person1, person2) => {
		if (
			person1.dateOfBirth !== person2.dateOfBirth &&
			this.isCoronaFree(person1) === this.isCoronaFree(person2) &&
			this.categorize(person1) === this.categorize(person2)
		) {
			const personSort = {
				olderPerson:
					person1.dateOfBirth < person2.dateOfBirth
						? person1
						: person2,
				youngerPerson:
					person1.dateOfBirth < person2.dateOfBirth
						? person2
						: person1,
			};
			if (
				personSort.youngerPerson -
					this.calculateSicknessPoints(personSort.youngerPerson) <
				personSort.olderPerson -
					this.calculateSicknessPoints(personSort.olderPerson)
			) {
				return {
					person: personSort.youngerPerson,
					reason: `Da beide Personen die selbe Gefährdungsstufe haben wurde nach Alter und Krankengeschichte ausgewählt und Obwohl ${personSort.olderPerson.name} das höhere Alter besitzt wurde ${personSort.youngerPerson.name} aufgrund der Krankengeschichte bevorzugt.`,
				};
			} else {
				return {
					person: personSort.youngerPerson,
					reason: `Da beide Personen die selbe Gefährdungsstufe haben wurde ${personSort.olderPerson.name} augrund des höheren Alters gewählt.`,
				};
			}
		} else if (
			!this.isCoronaFree(person1) !== !this.isCoronaFree(person2)
		) {
			const chosenPerson = this.isCoronaFree(person1) ? person1 : person2;
			const notChosenPerson = this.isCoronaFree(person1)
				? person2
				: person1;
			return {
				person: chosenPerson,
				reason: `Aufgrund einer vorangegangenen oder aktuellen Coviderkrankung von ${notChosenPerson.name} wurde ${chosenPerson.name} ausgewählt`,
			};
		} else {
			const chosenPerson =
				this.categorize(person1) > this.categorize(person2)
					? person1
					: person2;
			return {
				person: chosenPerson,
				reason: `${chosenPerson.name} wurde aufgrund der höheren Gefährdungsstufe ausgewählt `,
			};
		}
	};

	loadUserData = () => {
		//Request Here
		const userDataResult = [];
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
		//TODO Requesr
		const extendedData = [];
		return extendedData.find((dataitem) => dataitem.id === extendedDataId);
	};
}
export const MainStore = new MainstoreSingleton();
