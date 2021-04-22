const FONCTIONS = {
	24: 'Acteur',
	25: 'Acteur',
	15: 'Acteur',
	
	28: 'Production',
	29: 'Production',
	48: 'Production',
	
	4: 'Technique',
	5: 'Technique',
	
	6: 'Esthetique',
	8: 'Esthetique',
	9: 'Esthetique',
	17: 'Esthetique',
	
	2: 'Image',
	12: 'Image',
	14: 'Image',
	19: 'Image',
	
	7: 'Son',
	18: 'Son',
	20: 'Son',
	27: 'Son',
	16: 'Son',
	21: 'Son',
	
	31: 'Scénario',
	32: 'Scénario',
	33: 'Scénario',
	
	34: 'Organisme',
	39: 'Organisme',
	40: 'Organisme',
	43: 'Organisme',
	49: 'Organisme',
	37: 'Organisme',
	
	22: 'Narration',
	23: 'Narration',
	
	35: 'Documentaire/émission',
	36: 'Documentaire/émission',
	47: 'Documentaire/émission',
	
	38: 'Science',
	41: 'Science',
	
	30: 'Régie',
	
	3: 'Assistant réalisation',
	
	10: 'Direction artistique',
	
	11: 'Direction de production',
	
	26: 'Photographe de plateau',
	
	13: 'Générique additionnel',
	
	42: 'Maison de services',
	
	44: 'Conception',
	
	45: 'Création',
	
	1: 'Réalisation'
}


//construit dictionnaire qui associe id du nom aux nom et prénom
export function buildDictNoms(data) {
	var dict_nomsId = {};
	data.forEach(e => {
		dict_nomsId[e.NomId]={'nom':e.nom, 'prenom':e.prenom};
	});
	return dict_nomsId;
}

//construit dictionnaire qui associe id de la fonction au terme de la fonction
export function buildDictFonctions(data) {
	var dict_fonctionsId = {};
	data.forEach(e => {
		dict_fonctionsId[e.FonctionId]=e.terme.replaceAll("'", " ");
	});
	return dict_fonctionsId;
}

//construit dictionnaire qui associe id du film à ses titres et année de sortie
export function buildDictFilmoId(data) {
	var dict_filmoId = {};
	data.forEach(e => {
		dict_filmoId[e.FilmoId]={'titreOriginal':e.titreOriginal, 'anneeSortie':parseInt(e.anneeSortie)};
	});
	return dict_filmoId;
}

//construit dictionnaire qui associe id du nom à sa carrière
export function buildDictCareer (data, dict_filmoId, dict_fonctionId, dict_nomsId) {
	var dict_noms_car = {};
	var dict_filmo_participants={}
	
	data.forEach(e => {
		let new_element_dc={'film':dict_filmoId[e.filmoId], 'fonctionCategory':FONCTIONS[e.fonctionId], 'fonction': dict_fonctionId[e.fonctionId]}
		if (e.nomId in dict_noms_car) {
			dict_noms_car[e.nomId].push(new_element_dc);
		} else {
			dict_noms_car[e.nomId]=[new_element_dc];
		}
		
		let annee_sortie = dict_filmoId[e.filmoId].anneeSortie
		if (annee_sortie > 1984) {
			let new_participant={'nom':dict_nomsId[e.nomId], 'fonction': dict_fonctionId[e.fonctionId]}
			if (e.filmoId in dict_filmo_participants) {
				dict_filmo_participants[e.filmoId].participants.push(new_participant)
			} else {
				dict_filmo_participants[e.filmoId]={'anneeSortie':annee_sortie, 'participants':[new_participant]}
			}
		}
	});
	
	//tri de dict_filmo_participants par année de sortie
	var sorted_filmo_part = Object.keys(dict_filmo_participants).map(function(key) {
		return [dict_filmoId[key], dict_filmo_participants[key]]
	})
	
	sorted_filmo_part.sort(function(e1, e2) {
		return e1[1].anneeSortie-e2[1].anneeSortie
	})
	
	
	return [dict_noms_car, sorted_filmo_part];
}