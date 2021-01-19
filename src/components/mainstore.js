import axios from "axios";
import { makeAutoObservable } from "mobx";

class MainstoreSingleton {
	constructor() {
		makeAutoObservable(this);
	}
	currentPage = "def";
	userDataSet = []; //Ein Array in dem alle Userdaten gespeichert werden
	currentUserData = {}; //der aktuell ausgewählte benutzer
	currentCompareData = []; // Hier werden die zu vergleichenden Impfwilligen Gespeichert

	//lädt zu beginn die Nutzerdaten aus der Datenbank
	init = () => {
		this.userDataSet = this.loadUserData();
	};

	//berechnet die zusätzlichen Sekunden die auf das Alter aufaddiert werden um sehr Kranke Menschen vorzuziehen
	calculateSicknessPoints = (person) => {
		return person.patientStory.length * 1000;
	};
	//Checkt ob eine CoronaInfektion vorlag oder liegt
	isCoronaFree = (person) => {
		return !(person.coronaInfection || person.previousCoronaInfection);
	};
	//Da das Geburtsdatum als unix TimeStamp vorliegt wird hier der timestamp in das Alter umgerechnet
	calculateAge = (timestamp) => {
		const age = new Date().getFullYear - new Date(timestamp).getFullYear; //TODO
		return age;
	};
	//Ordnet Person nach den fragebogenDaten in eine Kategorie ein
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
	//Vergleicht 2 Impfwillige basierend auf Kategorie, Alter und Vorangegangener bzw. bestehender CoronaInfektion
	//Die Rückgabe ist ein Objekt mit der Begründung als String und dem Objekt der Person die Vorgezogen wurde
	compareTwoAndGiveAnswerString = (person1, person2) => {
		//Für den Fall dass beide Impfwilligen in der Selben Kategorie sind wird hier der Vorzug nach Alter Berechnet
		if (
			person1.dateOfBirth !== person2.dateOfBirth &&
			this.isCoronaFree(person1) === this.isCoronaFree(person2) &&
			this.categorize(person1) === this.categorize(person2)
		) {
			//Temporäres Objekt, in dem die zu vergleichenden Personen als Jüngere, und Ältere Person vorliegen um Spätere referenzierung zu Vereinfachen
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
			//Eine sehr kranke Person kann trotz geringerem Alter vorgezogen werden. Dazu werden die Vorbelastungen in Sekunden umgerechnet, welche auf das Alter aufaddiert werden, der Schlüssel zur Umrechnung wird sich später aus einer Tabelle in der Datenbank ergeben
			if (
				personSort.youngerPerson -
					this.calculateSicknessPoints(personSort.youngerPerson) <
				personSort.olderPerson -
					this.calculateSicknessPoints(personSort.olderPerson)
			) {
				return {
					//Ausgabe für den Fall dass die jüngere Person vorgezogen wird
					person: personSort.youngerPerson,
					reason: `Da beide Personen die selbe Gefährdungsstufe haben wurde nach Alter und Krankengeschichte ausgewählt und Obwohl ${personSort.olderPerson.name} das höhere Alter besitzt wurde ${personSort.youngerPerson.name} aufgrund der Krankengeschichte bevorzugt.`,
				};
			} else {
				return {
					//Ausgabe für den Standardfall dass die Ältere Person vorgezogen wird
					person: personSort.youngerPerson,
					reason: `Da beide Personen die selbe Gefährdungsstufe haben wurde ${personSort.olderPerson.name} augrund des höheren Alters gewählt.`,
				};
			}
		} else if (
			//Sollte der Fall auftreten, dass eine Person eine CoronaInfektion hat wird hier die andere vorgezogen
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
			//Trifft keiner der obigen Fälle zu, wird hier die Person mit der höheren Einstufung Ausgewählt.
			const chosenPerson =
				this.categorize(person1) < this.categorize(person2)
					? person1
					: person2;
			return {
				person: chosenPerson,
				reason: `${chosenPerson.name} wurde aufgrund der höheren Gefährdungsstufe ausgewählt `,
			};
		}
	};

	loadUserData = async () => {
		//request auf die Tabelle der Impfwilligen, welche die basisdaten enthält
		const result = await axios.get("impfwillige.php");
		//Hier werden die für die Kategorisierung nötigen Daten für jede Person anhand der FragebogenId nachgeladen und an das Objekt angehängt
		const userData = result.map(
			async (data) =>
				(data = {
					...data,
					fragebogen: await this.loadExtendedUserData(
						data.extendedDataId
					),
				})
		);
		return userData;
	};
	//lädt die fragebogendaten anhand der FragebogenId und gibt diese zurück
	loadExtendedUserData = async (extendedDataId) => {
		const result = await axios.get(
			"fragebogen.php?fragebogenid=" + extendedDataId
		);

		return result.data;
	};
}
export const MainStore = new MainstoreSingleton();
