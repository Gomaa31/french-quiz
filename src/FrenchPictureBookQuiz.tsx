import React, { useEffect, useMemo, useState } from "react";

type VocabItem = {
  page: number;
  category: string;
  french: string;
  english: string;
};

type Direction = "fr-en" | "en-fr";

type Question = VocabItem & {
  prompt: string;
  correct: string;
  options: string[];
};

const lessonTitles: Record<number, string> = {"1": "Cover", "2": "L'alphabet", "3": "Les nombres", "4": "Le rang", "5": "Se présenter", "6": "Ma famille", "7": "Relations", "8": "Enfants", "9": "Les couleurs", "10": "Le temps", "11": "Repères, jours et mois", "12": "Date de naissance", "13": "Naissance - exemples", "14": "Famille + naissance", "15": "Parties du corps", "16": "Quelques pays", "17": "Les pays arabes", "18": "Nationalités - exemples", "19": "Où j'habite", "20": "Les métiers I", "21": "Les métiers II", "22": "Prépositions de lieu", "23": "Lieux en ville", "24": "Différents lieux", "25": "Autour de ma maison", "26": "La courtoisie", "27": "La nature", "28": "Routine quotidienne", "29": "Routine + heures", "30": "Moyens de transport", "31": "Transport - phrases", "32": "Appareils électroniques", "33": "Prépositions - pratique", "34": "Passe-temps", "35": "Temps libre - exemples", "36": "Les verbes", "37": "J'aime", "38": "Sentiments et sensations", "39": "J'ai..., je veux...", "40": "Comment te sens-tu ?", "41": "Fruits et légumes", "42": "Repas, boissons et nourriture", "43": "Problèmes de santé", "44": "Les repas - exemples", "45": "Santé - exemples", "46": "Cover duplicate"};

const rawData: [number, string, string, string][] = [[1, "Cover", "Apprendre le français en image.", "Learn French with pictures."], [1, "Cover", "Avec Mme Sabria.", "With Ms. Sabria."], [1, "Cover", "Apprendre les mots de base", "Learn basic words"], [1, "Cover", "Écouter et répéter", "Listen and repeat"], [1, "Cover", "Les clés de la grammaire", "The keys to grammar"], [1, "Cover", "Former des phrases avec aisance", "Form sentences with ease"], [2, "Alphabet", "un avion", "an airplane"], [2, "Alphabet", "un ballon", "a balloon"], [2, "Alphabet", "une carotte", "a carrot"], [2, "Alphabet", "un dinosaure", "a dinosaur"], [2, "Alphabet", "un éléphant", "an elephant"], [2, "Alphabet", "une fleur", "a flower"], [2, "Alphabet", "une girafe", "a giraffe"], [2, "Alphabet", "un hibou", "an owl"], [2, "Alphabet", "un iglou", "an igloo"], [2, "Alphabet", "un jongleur", "a juggler"], [2, "Alphabet", "un kangourou", "a kangaroo"], [2, "Alphabet", "une licorne", "a unicorn"], [2, "Alphabet", "un marteau", "a hammer"], [2, "Alphabet", "un nid", "a nest"], [2, "Alphabet", "une orange", "an orange"], [2, "Alphabet", "une porte", "a door"], [2, "Alphabet", "des quilles", "bowling pins"], [2, "Alphabet", "un râteau", "a rake"], [2, "Alphabet", "un serpent", "a snake"], [2, "Alphabet", "un train", "a train"], [2, "Alphabet", "une usine", "a factory"], [2, "Alphabet", "un violon", "a violin"], [2, "Alphabet", "un wapiti", "an elk"], [2, "Alphabet", "un xylophone", "a xylophone"], [2, "Alphabet", "un yoyo", "a yo-yo"], [2, "Alphabet", "un zèbre", "a zebra"], [3, "Numbers", "zéro", "zero"], [3, "Numbers", "un", "one"], [3, "Numbers", "deux", "two"], [3, "Numbers", "trois", "three"], [3, "Numbers", "quatre", "four"], [3, "Numbers", "cinq", "five"], [3, "Numbers", "six", "six"], [3, "Numbers", "sept", "seven"], [3, "Numbers", "huit", "eight"], [3, "Numbers", "neuf", "nine"], [3, "Numbers", "dix", "ten"], [3, "Numbers", "onze", "eleven"], [3, "Numbers", "douze", "twelve"], [3, "Numbers", "treize", "thirteen"], [3, "Numbers", "quatorze", "fourteen"], [3, "Numbers", "quinze", "fifteen"], [3, "Numbers", "seize", "sixteen"], [3, "Numbers", "dix-sept", "seventeen"], [3, "Numbers", "dix-huit", "eighteen"], [3, "Numbers", "dix-neuf", "nineteen"], [3, "Numbers", "vingt", "twenty"], [3, "Numbers", "trente", "thirty"], [3, "Numbers", "quarante", "forty"], [3, "Numbers", "cinquante", "fifty"], [3, "Numbers", "soixante", "sixty"], [3, "Numbers", "soixante-dix", "seventy"], [3, "Numbers", "quatre-vingt", "eighty"], [3, "Numbers", "quatre-vingt-dix", "ninety"], [3, "Numbers", "cent", "one hundred"], [4, "Ordinal Numbers", "premier", "first (masculine)"], [4, "Ordinal Numbers", "première", "first (feminine)"], [4, "Ordinal Numbers", "deuxième", "second"], [4, "Ordinal Numbers", "troisième", "third"], [4, "Ordinal Numbers", "quatrième", "fourth"], [4, "Ordinal Numbers", "cinquième", "fifth"], [4, "Ordinal Numbers", "sixième", "sixth"], [4, "Ordinal Numbers", "septième", "seventh"], [4, "Ordinal Numbers", "huitième", "eighth"], [4, "Ordinal Numbers", "neuvième", "ninth"], [4, "Ordinal Numbers", "dixième", "tenth"], [5, "Introducing Yourself", "Se présenter", "to introduce yourself"], [5, "Introducing Yourself", "Je m'appelle", "My name is / I am called"], [5, "Introducing Yourself", "J'ai ... ans", "I am ... years old"], [5, "Introducing Yourself", "Je m'appelle Mohamed. J'ai 29 ans.", "My name is Mohamed. I am 29 years old."], [5, "Introducing Yourself", "Je m'appelle Sara. J'ai 12 ans.", "My name is Sara. I am 12 years old."], [5, "Introducing Yourself", "Je m'appelle Adam. J'ai 8 ans.", "My name is Adam. I am 8 years old."], [6, "Family", "Ma famille", "My family"], [6, "Family", "mon grand-père", "my grandfather"], [6, "Family", "ma grand-mère", "my grandmother"], [6, "Family", "mon oncle", "my uncle"], [6, "Family", "mon père", "my father"], [6, "Family", "ma mère", "my mother"], [6, "Family", "ma tante", "my aunt"], [6, "Family", "moi", "me"], [6, "Family", "mon cousin", "my male cousin"], [6, "Family", "ma cousine", "my female cousin"], [6, "Family", "mon frère", "my brother"], [6, "Family", "ma sœur", "my sister"], [7, "Family", "ma fille", "my daughter"], [7, "Family", "mon fils", "my son"], [7, "Family", "mon voisin", "my male neighbor"], [7, "Family", "ma voisine", "my female neighbor"], [7, "Family", "mon collègue", "my male colleague"], [7, "Family", "ma collègue", "my female colleague"], [7, "Family", "mon ami", "my male friend"], [7, "Family", "mon amie", "my female friend"], [7, "Family", "mon homme", "my man / partner"], [7, "Family", "ma femme", "my wife"], [8, "Family", "J'ai deux fils.", "I have two sons."], [8, "Family", "J'ai deux filles.", "I have two daughters."], [8, "Family", "Mon premier fils s'appelle ... et il a ... ans.", "My first son is called ... and he is ... years old."], [8, "Family", "Mon deuxième fils s'appelle ... et il a ... ans.", "My second son is called ... and he is ... years old."], [8, "Family", "Ma première fille s'appelle ... et elle a ... ans.", "My first daughter is called ... and she is ... years old."], [8, "Family", "Ma deuxième fille s'appelle ... et elle a ... ans.", "My second daughter is called ... and she is ... years old."], [9, "Colors", "Les couleurs", "Colors"], [9, "Colors", "noir", "black"], [9, "Colors", "blanc", "white"], [9, "Colors", "gris", "gray"], [9, "Colors", "bleu", "blue"], [9, "Colors", "vert", "green"], [9, "Colors", "jaune", "yellow"], [9, "Colors", "orange", "orange"], [9, "Colors", "rouge", "red"], [9, "Colors", "rose", "pink"], [9, "Colors", "violet", "purple"], [9, "Colors", "marron", "brown"], [9, "Colors", "argent", "silver"], [9, "Colors", "or", "gold"], [9, "Colors", "bronze", "bronze"], [10, "Time & Dates", "Le temps", "Time"], [10, "Time & Dates", "le matin", "the morning"], [10, "Time & Dates", "l'après-midi", "the afternoon"], [10, "Time & Dates", "le soir", "the evening"], [10, "Time & Dates", "la nuit", "the night"], [10, "Time & Dates", "Bon matin", "Good morning"], [10, "Time & Dates", "Bonjour", "Hello / good day"], [10, "Time & Dates", "Bon après-midi", "Good afternoon"], [10, "Time & Dates", "Bonsoir", "Good evening"], [10, "Time & Dates", "Bonne nuit", "Good night"], [11, "Time & Dates", "Repères", "Markers / reference points"], [11, "Time & Dates", "hier", "yesterday"], [11, "Time & Dates", "aujourd'hui", "today"], [11, "Time & Dates", "demain", "tomorrow"], [11, "Time & Dates", "samedi", "Saturday"], [11, "Time & Dates", "dimanche", "Sunday"], [11, "Time & Dates", "lundi", "Monday"], [11, "Time & Dates", "mardi", "Tuesday"], [11, "Time & Dates", "mercredi", "Wednesday"], [11, "Time & Dates", "jeudi", "Thursday"], [11, "Time & Dates", "vendredi", "Friday"], [11, "Time & Dates", "janvier", "January"], [11, "Time & Dates", "février", "February"], [11, "Time & Dates", "mars", "March"], [11, "Time & Dates", "avril", "April"], [11, "Time & Dates", "mai", "May"], [11, "Time & Dates", "juin", "June"], [11, "Time & Dates", "juillet", "July"], [11, "Time & Dates", "août", "August"], [11, "Time & Dates", "septembre", "September"], [11, "Time & Dates", "octobre", "October"], [11, "Time & Dates", "novembre", "November"], [11, "Time & Dates", "décembre", "December"], [11, "Time & Dates", "La date", "The date"], [12, "Time & Dates", "Ma date de naissance", "My date of birth"], [12, "Time & Dates", "Date de naissance", "Date of birth"], [12, "Time & Dates", "Je suis né(e) le ...", "I was born on ..."], [13, "Time & Dates", "Mon père est né le dix-sept septembre mille neuf cent soixante-treize.", "My father was born on September seventeenth, nineteen seventy-three."], [13, "Time & Dates", "Ma mère est née le vingt juin mille neuf cent soixante-dix-huit.", "My mother was born on June twentieth, nineteen seventy-eight."], [14, "Family Dates", "Il est né le .../.../…", "He was born on .../.../..."], [14, "Family Dates", "Elle est née le .../.../…", "She was born on .../.../..."], [15, "Body", "Les parties du corps", "Parts of the body"], [15, "Body", "la tête", "the head"], [15, "Body", "le visage", "the face"], [15, "Body", "les cheveux", "the hair"], [15, "Body", "la main", "the hand"], [15, "Body", "les yeux", "the eyes"], [15, "Body", "le nez", "the nose"], [15, "Body", "l'oreille", "the ear"], [15, "Body", "le sourcil", "the eyebrow"], [15, "Body", "la bouche", "the mouth"], [15, "Body", "la langue", "the tongue"], [15, "Body", "le doigt", "the finger"], [15, "Body", "le pied", "the foot"], [15, "Body", "J'ai les yeux noirs.", "I have black eyes."], [15, "Body", "J'ai les cheveux marron.", "I have brown hair."], [16, "Countries", "Quelques pays", "Some countries"], [16, "Countries", "l'Allemagne", "Germany"], [16, "Countries", "l'Angleterre", "England"], [16, "Countries", "l'Argentine", "Argentina"], [16, "Countries", "le Brésil", "Brazil"], [16, "Countries", "la Chine", "China"], [16, "Countries", "l'Espagne", "Spain"], [16, "Countries", "les États-Unis", "the United States"], [16, "Countries", "la France", "France"], [16, "Countries", "l'Italie", "Italy"], [16, "Countries", "le Japon", "Japan"], [16, "Countries", "le Mexique", "Mexico"], [16, "Countries", "la Russie", "Russia"], [16, "Countries", "la Suisse", "Switzerland"], [17, "Arab Countries", "Les pays arabes", "The Arab countries"], [17, "Arab Countries", "l'Égypte", "Egypt"], [17, "Arab Countries", "égyptien", "Egyptian (masculine)"], [17, "Arab Countries", "égyptienne", "Egyptian (feminine)"], [17, "Arab Countries", "l'Algérie", "Algeria"], [17, "Arab Countries", "algérien", "Algerian (masculine)"], [17, "Arab Countries", "algérienne", "Algerian (feminine)"], [17, "Arab Countries", "le Soudan", "Sudan"], [17, "Arab Countries", "soudanais", "Sudanese (masculine)"], [17, "Arab Countries", "soudanaise", "Sudanese (feminine)"], [17, "Arab Countries", "le Maroc", "Morocco"], [17, "Arab Countries", "marocain", "Moroccan (masculine)"], [17, "Arab Countries", "marocaine", "Moroccan (feminine)"], [17, "Arab Countries", "l'Arabie saoudite", "Saudi Arabia"], [17, "Arab Countries", "saoudien", "Saudi (masculine)"], [17, "Arab Countries", "saoudienne", "Saudi (feminine)"], [17, "Arab Countries", "le Bahreïn", "Bahrain"], [17, "Arab Countries", "bahreïni", "Bahraini (masculine)"], [17, "Arab Countries", "bahreïnie", "Bahraini (feminine)"], [17, "Arab Countries", "les Émirats arabes unis", "the United Arab Emirates"], [17, "Arab Countries", "émirati", "Emirati (masculine)"], [17, "Arab Countries", "émiratie", "Emirati (feminine)"], [17, "Arab Countries", "l'Irak", "Iraq"], [17, "Arab Countries", "irakien", "Iraqi (masculine)"], [17, "Arab Countries", "irakienne", "Iraqi (feminine)"], [17, "Arab Countries", "la Jordanie", "Jordan"], [17, "Arab Countries", "jordanien", "Jordanian (masculine)"], [17, "Arab Countries", "jordanienne", "Jordanian (feminine)"], [17, "Arab Countries", "le Koweït", "Kuwait"], [17, "Arab Countries", "koweïtien", "Kuwaiti (masculine)"], [17, "Arab Countries", "koweïtienne", "Kuwaiti (feminine)"], [17, "Arab Countries", "le Liban", "Lebanon"], [17, "Arab Countries", "libanais", "Lebanese (masculine)"], [17, "Arab Countries", "libanaise", "Lebanese (feminine)"], [17, "Arab Countries", "la Libye", "Libya"], [17, "Arab Countries", "libyen", "Libyan (masculine)"], [17, "Arab Countries", "libyenne", "Libyan (feminine)"], [17, "Arab Countries", "Oman", "Oman"], [17, "Arab Countries", "omanais", "Omani (masculine)"], [17, "Arab Countries", "omanaise", "Omani (feminine)"], [17, "Arab Countries", "la Palestine", "Palestine"], [17, "Arab Countries", "palestinien", "Palestinian (masculine)"], [17, "Arab Countries", "palestinienne", "Palestinian (feminine)"], [17, "Arab Countries", "le Qatar", "Qatar"], [17, "Arab Countries", "qatari", "Qatari (masculine)"], [17, "Arab Countries", "qatarie", "Qatari (feminine)"], [17, "Arab Countries", "la Syrie", "Syria"], [17, "Arab Countries", "syrien", "Syrian (masculine)"], [17, "Arab Countries", "syrienne", "Syrian (feminine)"], [17, "Arab Countries", "la Tunisie", "Tunisia"], [17, "Arab Countries", "tunisien", "Tunisian (masculine)"], [17, "Arab Countries", "tunisienne", "Tunisian (feminine)"], [17, "Arab Countries", "le Yémen", "Yemen"], [17, "Arab Countries", "yéménite", "Yemeni"], [18, "Nationality Examples", "Je suis égyptien.", "I am Egyptian (masculine)."], [18, "Nationality Examples", "Je suis égyptienne.", "I am Egyptian (feminine)."], [18, "Nationality Examples", "Mon père est égyptien.", "My father is Egyptian."], [18, "Nationality Examples", "Ma mère est égyptienne.", "My mother is Egyptian."], [18, "Nationality Examples", "Je suis soudanais.", "I am Sudanese (masculine)."], [18, "Nationality Examples", "Je suis soudanaise.", "I am Sudanese (feminine)."], [18, "Nationality Examples", "Mon père est soudanais.", "My father is Sudanese."], [18, "Nationality Examples", "Ma mère est soudanaise.", "My mother is Sudanese."], [18, "Nationality Examples", "Je suis marocain.", "I am Moroccan (masculine)."], [18, "Nationality Examples", "Je suis marocaine.", "I am Moroccan (feminine)."], [18, "Nationality Examples", "Mon père est marocain.", "My father is Moroccan."], [18, "Nationality Examples", "Ma mère est marocaine.", "My mother is Moroccan."], [19, "Where I Live", "Où j'habite", "Where I live"], [19, "Where I Live", "Je vis en Égypte, exactement au Caire.", "I live in Egypt, exactly in Cairo."], [19, "Where I Live", "J'habite en Égypte, exactement au Caire.", "I live in Egypt, exactly in Cairo."], [19, "Where I Live", "Je réside en Égypte, exactement au Caire.", "I reside in Egypt, exactly in Cairo."], [19, "Where I Live", "Je vis en Égypte, exactement à Mansoura.", "I live in Egypt, exactly in Mansoura."], [19, "Where I Live", "J'habite en Égypte, exactement à Mansoura.", "I live in Egypt, exactly in Mansoura."], [19, "Where I Live", "Je réside en Égypte, exactement à Mansoura.", "I reside in Egypt, exactly in Mansoura."], [19, "Where I Live", "Je vis en Arabie saoudite, exactement à Riyad.", "I live in Saudi Arabia, exactly in Riyadh."], [19, "Where I Live", "J'habite en Arabie saoudite, exactement à Riyad.", "I live in Saudi Arabia, exactly in Riyadh."], [19, "Where I Live", "Je réside en Arabie saoudite, exactement à Riyad.", "I reside in Saudi Arabia, exactly in Riyadh."], [19, "Where I Live", "Le Caire", "Cairo"], [19, "Where I Live", "Mansoura", "Mansoura"], [19, "Where I Live", "Riyad", "Riyadh"], [20, "Jobs", "Les métiers", "Jobs / professions"], [20, "Jobs", "Je suis ...", "I am ..."], [20, "Jobs", "un architecte", "an architect (masculine)"], [20, "Jobs", "une architecte", "an architect (feminine)"], [20, "Jobs", "un acteur", "an actor"], [20, "Jobs", "une actrice", "an actress"], [20, "Jobs", "un agriculteur", "a farmer (masculine)"], [20, "Jobs", "une agricultrice", "a farmer (feminine)"], [20, "Jobs", "un chauffeur d'autobus", "a bus driver (masculine)"], [20, "Jobs", "une chauffeuse d'autobus", "a bus driver (feminine)"], [20, "Jobs", "un chauffeur de taxi", "a taxi driver (masculine)"], [20, "Jobs", "une chauffeuse de taxi", "a taxi driver (feminine)"], [20, "Jobs", "un coiffeur", "a hairdresser (masculine)"], [20, "Jobs", "une coiffeuse", "a hairdresser (feminine)"], [20, "Jobs", "un cuisinier", "a cook / chef (masculine)"], [20, "Jobs", "une cuisinière", "a cook / chef (feminine)"], [20, "Jobs", "un dentiste", "a dentist"], [20, "Jobs", "une dentiste", "a dentist (feminine)"], [20, "Jobs", "un dessinateur", "a draftsman / illustrator"], [20, "Jobs", "une dessinatrice", "a female illustrator"], [20, "Jobs", "un facteur", "a mail carrier (masculine)"], [20, "Jobs", "une factrice", "a mail carrier (feminine)"], [20, "Jobs", "un ingénieur", "an engineer (masculine)"], [20, "Jobs", "une ingénieure", "an engineer (feminine)"], [20, "Jobs", "un mécanicien", "a mechanic (masculine)"], [20, "Jobs", "une mécanicienne", "a mechanic (feminine)"], [20, "Jobs", "un médecin", "a doctor"], [20, "Jobs", "une médecin", "a doctor (feminine)"], [20, "Jobs", "un ouvrier du bâtiment", "a construction worker (masculine)"], [20, "Jobs", "une ouvrière du bâtiment", "a construction worker (feminine)"], [20, "Jobs", "un pilote", "a pilot (masculine)"], [20, "Jobs", "une pilote", "a pilot (feminine)"], [20, "Jobs", "un policier", "a police officer (masculine)"], [20, "Jobs", "une policière", "a police officer (feminine)"], [20, "Jobs", "un pompier", "a firefighter (masculine)"], [20, "Jobs", "une pompière", "a firefighter (feminine)"], [20, "Jobs", "un serveur", "a waiter"], [20, "Jobs", "une serveuse", "a waitress"], [20, "Jobs", "un vendeur", "a salesperson (masculine)"], [20, "Jobs", "une vendeuse", "a salesperson (feminine)"], [20, "Jobs", "un vétérinaire", "a veterinarian"], [20, "Jobs", "une vétérinaire", "a veterinarian (feminine)"], [21, "Jobs", "un pharmacien", "a pharmacist (masculine)"], [21, "Jobs", "une pharmacienne", "a pharmacist (feminine)"], [21, "Jobs", "un comptable", "an accountant"], [21, "Jobs", "une comptable", "an accountant (feminine)"], [21, "Jobs", "un professeur", "a professor / teacher (masculine)"], [21, "Jobs", "une professeure", "a professor / teacher (feminine)"], [21, "Jobs", "un avocat", "a lawyer (masculine)"], [21, "Jobs", "une avocate", "a lawyer (feminine)"], [21, "Jobs", "un juge", "a judge (masculine)"], [21, "Jobs", "une juge", "a judge (feminine)"], [21, "Jobs", "un retraité", "a retired person (masculine)"], [21, "Jobs", "une retraitée", "a retired person (feminine)"], [21, "Jobs", "un infirmier", "a nurse (masculine)"], [21, "Jobs", "une infirmière", "a nurse (feminine)"], [21, "Jobs", "un enseignant", "a teacher (masculine)"], [21, "Jobs", "une enseignante", "a teacher (feminine)"], [21, "Jobs", "un boulanger", "a baker (masculine)"], [21, "Jobs", "une boulangère", "a baker (feminine)"], [21, "Jobs", "un caissier", "a cashier (masculine)"], [21, "Jobs", "une caissière", "a cashier (feminine)"], [21, "Jobs", "un employé", "an employee (masculine)"], [21, "Jobs", "une employée", "an employee (feminine)"], [21, "Jobs", "un programmeur", "a programmer (masculine)"], [21, "Jobs", "une programmeuse", "a programmer (feminine)"], [21, "Jobs", "un secrétaire", "a secretary (masculine)"], [21, "Jobs", "une secrétaire", "a secretary (feminine)"], [21, "Jobs", "un journaliste", "a journalist (masculine)"], [21, "Jobs", "une journaliste", "a journalist (feminine)"], [21, "Jobs", "un livreur", "a delivery worker (masculine)"], [21, "Jobs", "une livreuse", "a delivery worker (feminine)"], [21, "Jobs", "une femme au foyer", "a homemaker"], [22, "Prepositions", "Les prépositions de lieu", "Prepositions of place"], [22, "Prepositions", "Autour d'un objet", "Around an object"], [22, "Prepositions", "dans", "in / inside"], [22, "Prepositions", "sur", "on"], [22, "Prepositions", "sous", "under"], [22, "Prepositions", "devant", "in front of"], [22, "Prepositions", "derrière", "behind"], [22, "Prepositions", "à côté de", "next to"], [22, "Prepositions", "entre", "between"], [22, "Prepositions", "milieu", "middle"], [22, "Prepositions", "centre", "center"], [22, "Prepositions", "à gauche", "to the left"], [22, "Prepositions", "à droite", "to the right"], [23, "Places in Town", "Les lieux en ville", "Places in town"], [23, "Places in Town", "l'hôtel", "the hotel"], [23, "Places in Town", "la librairie", "the bookstore"], [23, "Places in Town", "la maison", "the house"], [23, "Places in Town", "le musée", "the museum"], [23, "Places in Town", "le parc", "the park"], [23, "Places in Town", "la pharmacie", "the pharmacy"], [23, "Places in Town", "le poste de police", "the police station"], [23, "Places in Town", "le restaurant", "the restaurant"], [23, "Places in Town", "la station d'essence", "the gas station"], [23, "Places in Town", "le terrain de jeux", "the playground"], [23, "Places in Town", "l'hôpital", "the hospital"], [23, "Places in Town", "la mosquée", "the mosque"], [23, "Places in Town", "l'église", "the church"], [24, "Places in Town", "Les différents lieux dans la ville", "Different places in the city"], [24, "Places in Town", "l'aéroport", "the airport"], [24, "Places in Town", "l'arrêt d'autobus", "the bus stop"], [24, "Places in Town", "la banque", "the bank"], [24, "Places in Town", "la boulangerie", "the bakery"], [24, "Places in Town", "la boutique", "the shop / boutique"], [24, "Places in Town", "le bureau de poste", "the post office"], [24, "Places in Town", "la caserne de pompiers", "the fire station"], [24, "Places in Town", "le centre commercial", "the shopping mall"], [24, "Places in Town", "le cinéma", "the cinema"], [24, "Places in Town", "le dépanneur", "the convenience store"], [24, "Places in Town", "le lycée", "the high school"], [24, "Places in Town", "l'école", "the school"], [24, "Places in Town", "l'épicerie", "the grocery store"], [24, "Places in Town", "le garage", "the garage"], [24, "Places in Town", "la gare de train", "the train station"], [25, "Place Examples", "Autour de ma maison", "Around my house"], [25, "Place Examples", "Il y a le poste de police devant ma maison.", "There is a police station in front of my house."], [25, "Place Examples", "Il y a la mosquée derrière ma maison.", "There is a mosque behind my house."], [25, "Place Examples", "Il y a la pharmacie à côté de ma maison.", "There is a pharmacy next to my house."], [25, "Place Examples", "Ma maison est entre la pharmacie et le parc.", "My house is between the pharmacy and the park."], [25, "Place Examples", "Il y a le parc à gauche de ma maison.", "There is a park to the left of my house."], [25, "Place Examples", "Il y a l'hôtel à droite de la pharmacie.", "There is a hotel to the right of the pharmacy."], [26, "Courtesy", "La courtoisie", "Courtesy"], [26, "Courtesy", "Dire bonjour", "To say hello"], [26, "Courtesy", "Bonjour ! Comment allez-vous ?", "Hello! How are you?"], [26, "Courtesy", "Je vais bien, merci. Et vous ?", "I am well, thank you. And you?"], [26, "Courtesy", "Dire au revoir", "To say goodbye"], [26, "Courtesy", "Au revoir ! À bientôt !", "Goodbye! See you soon!"], [26, "Courtesy", "Au revoir ! À plus tard.", "Goodbye! See you later."], [26, "Courtesy", "Remercier", "To thank"], [26, "Courtesy", "Merci beaucoup !", "Thank you very much!"], [26, "Courtesy", "Merci !", "Thanks!"], [26, "Courtesy", "Je vous remercie beaucoup !", "I thank you very much!"], [26, "Courtesy", "Je vous en prie !", "You are welcome!"], [26, "Courtesy", "De rien.", "It's nothing / you're welcome."], [26, "Courtesy", "S'excuser", "To apologize"], [26, "Courtesy", "Oups ! Désolé !", "Oops! Sorry!"], [26, "Courtesy", "Excuse-moi.", "Excuse me."], [26, "Courtesy", "Ce n'est rien.", "It's nothing."], [26, "Courtesy", "Pardon.", "Pardon / sorry."], [27, "Nature", "La nature", "Nature"], [27, "Nature", "La terre", "The land"], [27, "Nature", "la montagne", "the mountain"], [27, "Nature", "la plage", "the beach"], [27, "Nature", "un désert", "a desert"], [27, "Nature", "une fleur", "a flower"], [27, "Nature", "la forêt", "the forest"], [27, "Nature", "un arbre", "a tree"], [27, "Nature", "L'eau", "Water"], [27, "Nature", "la mer", "the sea"], [27, "Nature", "une rivière", "a river"], [27, "Nature", "un lac", "a lake"], [27, "Nature", "L'air", "Air"], [27, "Nature", "un arc-en-ciel", "a rainbow"], [27, "Nature", "une étoile", "a star"], [27, "Nature", "la Lune", "the Moon"], [27, "Nature", "un nuage", "a cloud"], [27, "Nature", "le Soleil", "the Sun"], [28, "Daily Routine", "Ma routine quotidienne", "My daily routine"], [28, "Daily Routine", "Je me réveille.", "I wake up."], [28, "Daily Routine", "Je me douche.", "I shower."], [28, "Daily Routine", "Je me brosse les dents.", "I brush my teeth."], [28, "Daily Routine", "Je prends le petit déjeuner.", "I have breakfast."], [28, "Daily Routine", "Je m'habille.", "I get dressed."], [28, "Daily Routine", "Je vais au travail.", "I go to work."], [28, "Daily Routine", "Je mange.", "I eat."], [28, "Daily Routine", "Je retourne à la maison.", "I return home."], [28, "Daily Routine", "Je fais du sport.", "I exercise."], [28, "Daily Routine", "Je regarde la télé.", "I watch TV."], [28, "Daily Routine", "Je dîne.", "I have dinner."], [28, "Daily Routine", "Je me couche.", "I go to bed."], [29, "Daily Routine Examples", "Ma routine : les moments de la journée", "My routine: times of the day"], [29, "Daily Routine Examples", "Le matin, je me réveille à 7 heures.", "In the morning, I wake up at 7 o'clock."], [29, "Daily Routine Examples", "Le matin, je me douche à 8 heures.", "In the morning, I shower at 8 o'clock."], [29, "Daily Routine Examples", "L'après-midi, je vais au travail à 13 heures.", "In the afternoon, I go to work at 1 PM."], [29, "Daily Routine Examples", "L'après-midi, je fais du sport à 17 heures.", "In the afternoon, I exercise at 5 PM."], [29, "Daily Routine Examples", "Le soir, je retourne à la maison à 19 heures.", "In the evening, I return home at 7 PM."], [29, "Daily Routine Examples", "Le soir, je dîne avec ma mère à 20 heures.", "In the evening, I have dinner with my mother at 8 PM."], [29, "Daily Routine Examples", "La nuit, je regarde la télé à 21 heures.", "At night, I watch TV at 9 PM."], [29, "Daily Routine Examples", "La nuit, je me couche à 22 heures.", "At night, I go to bed at 10 PM."], [30, "Transport", "Les moyens de transport", "Means of transportation"], [30, "Transport", "un train", "a train"], [30, "Transport", "un traversier", "a ferry"], [30, "Transport", "un métro", "a subway"], [30, "Transport", "une motocyclette", "a motorcycle"], [30, "Transport", "un taxi", "a taxi"], [30, "Transport", "un hélicoptère", "a helicopter"], [30, "Transport", "un avion", "an airplane"], [30, "Transport", "un bateau", "a boat"], [30, "Transport", "une bicyclette", "a bicycle"], [30, "Transport", "un camion", "a truck"], [30, "Transport", "un autobus", "a bus"], [30, "Transport", "une ambulance", "an ambulance"], [30, "Transport", "une voiture", "a car"], [30, "Transport", "un camion de pompiers", "a fire truck"], [31, "Transport Examples", "Je vais ... en ... / à pied", "I go ... by ... / on foot"], [31, "Transport Examples", "Je vais au travail en taxi.", "I go to work by taxi."], [31, "Transport Examples", "Je retourne à la maison en voiture.", "I return home by car."], [31, "Transport Examples", "Je vais au cinéma avec mon ami à motocyclette.", "I go to the cinema with my friend by motorcycle."], [31, "Transport Examples", "Je vais au parc à bicyclette.", "I go to the park by bicycle."], [31, "Transport Examples", "Je vais au restaurant à pied.", "I go to the restaurant on foot."], [31, "Transport Examples", "Je vais à la mosquée avec mon père à pied.", "I go to the mosque with my father on foot."], [32, "Electronics", "Les appareils électroniques", "Electronic devices"], [32, "Electronics", "le chargeur", "the charger"], [32, "Electronics", "le bureau", "the desk"], [32, "Electronics", "des écouteurs", "headphones / earphones"], [32, "Electronics", "un ordinateur", "a computer"], [32, "Electronics", "un ordinateur portable", "a laptop"], [32, "Electronics", "une tablette numérique", "a digital tablet"], [32, "Electronics", "une télévision", "a television"], [32, "Electronics", "le téléphone", "the phone"], [33, "Electronics Examples", "Pratique : les prépositions de lieu", "Practice: prepositions of place"], [33, "Electronics Examples", "Mon chargeur est sur le bureau.", "My charger is on the desk."], [33, "Electronics Examples", "Mon téléphone est derrière la télévision.", "My phone is behind the television."], [33, "Electronics Examples", "Mon bureau est entre le bureau d'Ahmed et le bureau de Mohamed.", "My desk is between Ahmed's desk and Mohamed's desk."], [33, "Electronics Examples", "La télévision est à gauche du bureau.", "The television is to the left of the desk."], [33, "Electronics Examples", "Mon téléphone est dans la maison de ma mère.", "My phone is in my mother's house."], [33, "Electronics Examples", "L'ordinateur est à côté de la tablette numérique.", "The computer is next to the digital tablet."], [34, "Hobbies", "Les passe-temps", "Hobbies"], [34, "Hobbies", "Faire du shopping", "to go shopping"], [34, "Hobbies", "Voyager", "to travel"], [34, "Hobbies", "Passer du temps avec mes amis", "to spend time with my friends"], [34, "Hobbies", "Photographier", "to take photos"], [34, "Hobbies", "Regarder la télévision", "to watch television"], [34, "Hobbies", "Naviguer sur Internet", "to browse the internet"], [34, "Hobbies", "Jouer d'un instrument", "to play an instrument"], [34, "Hobbies", "Lire un livre", "to read a book"], [34, "Hobbies", "Jouer à un jeu vidéo", "to play a video game"], [34, "Hobbies", "Faire du sport", "to exercise"], [34, "Hobbies", "Faire un casse-tête", "to do a puzzle"], [34, "Hobbies", "Écouter de la musique", "to listen to music"], [34, "Hobbies", "Cuisiner", "to cook"], [34, "Hobbies", "Danser", "to dance"], [35, "Hobby Examples", "Dans mon temps libre, j'aime", "In my free time, I like"], [35, "Hobby Examples", "Dans mon temps libre, j'aime faire du shopping, voyager et lire un livre.", "In my free time, I like shopping, traveling, and reading a book."], [35, "Hobby Examples", "Dans mon temps libre, j'aime photographier, faire du sport et écouter de la musique.", "In my free time, I like taking photos, exercising, and listening to music."], [35, "Hobby Examples", "Dans mon temps libre, j'aime cuisiner, jouer à un jeu vidéo et faire un casse-tête.", "In my free time, I like cooking, playing a video game, and doing a puzzle."], [35, "Hobby Examples", "Dans mon temps libre, j'aime regarder la télévision, passer du temps avec mes amis et danser.", "In my free time, I like watching TV, spending time with my friends, and dancing."], [36, "Verbs", "Les verbes", "Verbs"], [36, "Verbs", "pleurer", "to cry"], [36, "Verbs", "rire", "to laugh"], [36, "Verbs", "chanter", "to sing"], [36, "Verbs", "danser", "to dance"], [36, "Verbs", "dormir", "to sleep"], [36, "Verbs", "écrire", "to write"], [36, "Verbs", "lire", "to read"], [36, "Verbs", "peindre", "to paint"], [36, "Verbs", "dessiner", "to draw"], [36, "Verbs", "jouer", "to play"], [36, "Verbs", "découper", "to cut out"], [36, "Verbs", "boire", "to drink"], [36, "Verbs", "manger", "to eat"], [36, "Verbs", "marcher", "to walk"], [36, "Verbs", "courir", "to run"], [36, "Verbs", "sauter", "to jump"], [36, "Verbs", "nager", "to swim"], [36, "Verbs", "se coiffer", "to comb one's hair"], [36, "Verbs", "laver", "to wash"], [36, "Verbs", "jardiner", "to garden"], [37, "I Like", "J'aime", "I like"], [37, "I Like", "J'aime lire.", "I like reading."], [37, "I Like", "J'aime écrire.", "I like writing."], [37, "I Like", "J'aime jouer.", "I like playing."], [37, "I Like", "J'aime danser.", "I like dancing."], [37, "I Like", "J'aime chanter.", "I like singing."], [37, "I Like", "J'aime nager.", "I like swimming."], [38, "Feelings", "Les sentiments et les sensations", "Feelings and sensations"], [38, "Feelings", "J'ai chaud", "I am hot"], [38, "Feelings", "J'ai faim", "I am hungry"], [38, "Feelings", "J'ai froid", "I am cold"], [38, "Feelings", "J'ai hâte", "I am excited / I can't wait"], [38, "Feelings", "J'ai peur", "I am afraid"], [38, "Feelings", "J'ai raison", "I am right"], [38, "Feelings", "J'ai soif", "I am thirsty"], [38, "Feelings", "J'ai sommeil", "I am sleepy"], [38, "Feelings", "Je suis amoureux", "I am in love"], [38, "Feelings", "Je suis content", "I am content"], [38, "Feelings", "Je suis fâché", "I am angry"], [38, "Feelings", "Je suis fatigué", "I am tired"], [38, "Feelings", "Je suis heureux", "I am happy"], [38, "Feelings", "Je suis malade", "I am sick"], [38, "Feelings", "Je suis timide", "I am shy"], [38, "Feelings", "Je suis triste", "I am sad"], [39, "Feeling + Want", "J'ai..., je veux...", "I have..., I want..."], [39, "Feeling + Want", "J'ai faim, je veux manger.", "I am hungry, I want to eat."], [39, "Feeling + Want", "J'ai soif, je veux boire.", "I am thirsty, I want to drink."], [39, "Feeling + Want", "J'ai sommeil, je veux dormir.", "I am sleepy, I want to sleep."], [39, "Feeling + Want", "J'ai froid, je veux entrer à la maison.", "I am cold, I want to go inside the house."], [39, "Feeling + Want", "J'ai chaud, je veux prendre une douche.", "I am hot, I want to take a shower."], [39, "Feeling + Want", "J'ai peur, je veux voir ma mère.", "I am scared, I want to see my mother."], [40, "Feelings Examples", "Comment te sens-tu maintenant ?", "How do you feel now?"], [40, "Feelings Examples", "Je suis fatigué, j'ai sommeil.", "I am tired, I am sleepy."], [40, "Feelings Examples", "Je suis malade, j'ai froid.", "I am sick, I am cold."], [40, "Feelings Examples", "Je suis timide, j'ai peur.", "I am shy, I am afraid."], [40, "Feelings Examples", "Je suis heureux, j'ai hâte.", "I am happy, I am excited."], [41, "Fruits & Vegetables", "Les fruits", "Fruits"], [41, "Fruits & Vegetables", "une pêche", "a peach"], [41, "Fruits & Vegetables", "une poire", "a pear"], [41, "Fruits & Vegetables", "une pomme", "an apple"], [41, "Fruits & Vegetables", "des raisins", "grapes"], [41, "Fruits & Vegetables", "une orange", "an orange"], [41, "Fruits & Vegetables", "une fraise", "a strawberry"], [41, "Fruits & Vegetables", "une framboise", "a raspberry"], [41, "Fruits & Vegetables", "un kiwi", "a kiwi"], [41, "Fruits & Vegetables", "une cerise", "a cherry"], [41, "Fruits & Vegetables", "un citron", "a lemon"], [41, "Fruits & Vegetables", "un ananas", "a pineapple"], [41, "Fruits & Vegetables", "une banane", "a banana"], [41, "Fruits & Vegetables", "une mangue", "a mango"], [41, "Fruits & Vegetables", "un abricot", "an apricot"], [41, "Fruits & Vegetables", "une pastèque", "a watermelon"], [41, "Fruits & Vegetables", "Les légumes", "Vegetables"], [41, "Fruits & Vegetables", "un poivron", "a pepper"], [41, "Fruits & Vegetables", "un radis", "a radish"], [41, "Fruits & Vegetables", "une tomate", "a tomato"], [41, "Fruits & Vegetables", "un oignon", "an onion"], [41, "Fruits & Vegetables", "une betterave", "a beet"], [41, "Fruits & Vegetables", "un brocoli", "broccoli"], [41, "Fruits & Vegetables", "une carotte", "a carrot"], [41, "Fruits & Vegetables", "un champignon", "a mushroom"], [41, "Fruits & Vegetables", "un chou", "a cabbage"], [41, "Fruits & Vegetables", "un chou-fleur", "a cauliflower"], [41, "Fruits & Vegetables", "un concombre", "a cucumber"], [41, "Fruits & Vegetables", "des épinards", "spinach"], [41, "Fruits & Vegetables", "une laitue", "lettuce"], [41, "Fruits & Vegetables", "du maïs", "corn"], [41, "Fruits & Vegetables", "une pomme de terre", "a potato"], [42, "Meals & Food", "Les repas", "Meals"], [42, "Meals & Food", "le petit-déjeuner", "breakfast"], [42, "Meals & Food", "le déjeuner", "lunch"], [42, "Meals & Food", "le goûter", "snack"], [42, "Meals & Food", "le dîner", "dinner"], [42, "Meals & Food", "Les boissons", "Drinks"], [42, "Meals & Food", "du lait", "milk"], [42, "Meals & Food", "du lait au chocolat", "chocolate milk"], [42, "Meals & Food", "de l'eau", "water"], [42, "Meals & Food", "du jus d'orange", "orange juice"], [42, "Meals & Food", "une boisson gazeuse", "a soft drink"], [42, "Meals & Food", "du café", "coffee"], [42, "Meals & Food", "du thé", "tea"], [42, "Meals & Food", "La nourriture", "Food"], [42, "Meals & Food", "du pain", "bread"], [42, "Meals & Food", "des pâtes", "pasta"], [42, "Meals & Food", "des œufs", "eggs"], [42, "Meals & Food", "le fromage", "cheese"], [42, "Meals & Food", "le yaourt", "yogurt"], [42, "Meals & Food", "les frites", "fries"], [42, "Meals & Food", "le poisson", "fish"], [42, "Meals & Food", "le steak", "steak"], [42, "Meals & Food", "le poulet", "chicken"], [42, "Meals & Food", "le riz", "rice"], [42, "Meals & Food", "la purée", "mashed potatoes / puree"], [42, "Meals & Food", "la soupe", "soup"], [44, "Meal Examples", "Le matin, au petit-déjeuner, je bois du café. Je mange des œufs, des frites et du pain.", "In the morning at breakfast, I drink coffee. I eat eggs, fries, and bread."], [44, "Meal Examples", "L'après-midi, au déjeuner, je prends du thé. J'aime manger du poulet avec du riz et de la soupe.", "In the afternoon at lunch, I have tea. I like to eat chicken with rice and soup."], [44, "Meal Examples", "L'après-midi, au goûter, je bois du lait. Je mange un yaourt.", "In the afternoon at snack time, I drink milk. I eat a yogurt."], [44, "Meal Examples", "Le soir, au dîner, j'aime boire du jus d'orange. Je prends du pain avec du fromage.", "In the evening at dinner, I like to drink orange juice. I have bread with cheese."], [43, "Health", "Les problèmes de santé", "Health problems"], [43, "Health", "une rougeur", "a rash / redness"], [43, "Health", "une toux", "a cough"], [43, "Health", "une coupure", "a cut"], [43, "Health", "de la fièvre", "a fever"], [43, "Health", "un mal de dent", "a toothache"], [43, "Health", "un mal de gorge", "a sore throat"], [43, "Health", "un mal de tête", "a headache"], [43, "Health", "un mal de ventre", "a stomachache"], [43, "Health", "un nez bouché", "a blocked nose"], [43, "Health", "une piqûre", "a bite / sting"], [43, "Health", "un rhume", "a cold"], [43, "Health", "une grippe", "the flu"], [45, "Health Examples", "Les problèmes de santé - exemples", "Health problems - examples"], [45, "Health Examples", "J'ai une rougeur sur la main.", "I have a rash on my hand."], [45, "Health Examples", "J'ai une rougeur sur le visage.", "I have a rash on my face."], [45, "Health Examples", "Mon père a une rougeur sur la main.", "My father has a rash on his hand."], [45, "Health Examples", "Ma sœur a une toux.", "My sister has a cough."], [45, "Health Examples", "Ma mère a mal au dos.", "My mother has back pain."], [45, "Health Examples", "J'ai mal au cœur.", "I have pain in my heart / chest."], [45, "Health Examples", "J'ai mal dormi.", "I slept badly."], [45, "Health Examples", "J'ai un mal de tête.", "I have a headache."]];

const supplementalRawData: [number, string, string, string][] = [
  [1, "Cover", "Organisation et édition du livre: Dr/ Mohamed Anwar.", "Organization and editing of the book: Dr/ Mohamed Anwar."],
  [11, "Time & Dates", "deux mille vingt-six", "two thousand twenty-six"],
  [46, "Cover duplicate", "Apprendre le français en image.", "Learn French with pictures."],
  [46, "Cover duplicate", "Avec Mme Sabria.", "With Ms. Sabria."],
  [46, "Cover duplicate", "Apprendre les mots de base", "Learn basic words"],
  [46, "Cover duplicate", "Écouter et répéter", "Listen and repeat"],
  [46, "Cover duplicate", "Les clés de la grammaire", "The keys to grammar"],
  [46, "Cover duplicate", "Former des phrases avec aisance", "Form sentences with ease"],
  [46, "Cover duplicate", "Organisation et édition du livre: Dr/ Mohamed Anwar.", "Organization and editing of the book: Dr/ Mohamed Anwar."],
  [2, "Alphabet Letters", "A", "letter A"],
  [2, "Alphabet Letters", "B", "letter B"],
  [2, "Alphabet Letters", "C", "letter C"],
  [2, "Alphabet Letters", "D", "letter D"],
  [2, "Alphabet Letters", "E", "letter E"],
  [2, "Alphabet Letters", "F", "letter F"],
  [2, "Alphabet Letters", "G", "letter G"],
  [2, "Alphabet Letters", "H", "letter H"],
  [2, "Alphabet Letters", "I", "letter I"],
  [2, "Alphabet Letters", "J", "letter J"],
  [2, "Alphabet Letters", "K", "letter K"],
  [2, "Alphabet Letters", "L", "letter L"],
  [2, "Alphabet Letters", "M", "letter M"],
  [2, "Alphabet Letters", "N", "letter N"],
  [2, "Alphabet Letters", "O", "letter O"],
  [2, "Alphabet Letters", "P", "letter P"],
  [2, "Alphabet Letters", "Q", "letter Q"],
  [2, "Alphabet Letters", "R", "letter R"],
  [2, "Alphabet Letters", "S", "letter S"],
  [2, "Alphabet Letters", "T", "letter T"],
  [2, "Alphabet Letters", "U", "letter U"],
  [2, "Alphabet Letters", "V", "letter V"],
  [2, "Alphabet Letters", "W", "letter W"],
  [2, "Alphabet Letters", "X", "letter X"],
  [2, "Alphabet Letters", "Y", "letter Y"],
  [2, "Alphabet Letters", "Z", "letter Z"],
  [2, "Alphabet Pronunciation", "a", "French name of the letter A"],
  [2, "Alphabet Pronunciation", "bé", "French name of the letter B"],
  [2, "Alphabet Pronunciation", "cé", "French name of the letter C"],
  [2, "Alphabet Pronunciation", "dé", "French name of the letter D"],
  [2, "Alphabet Pronunciation", "e", "French name of the letter E"],
  [2, "Alphabet Pronunciation", "effe", "French name of the letter F"],
  [2, "Alphabet Pronunciation", "gé", "French name of the letter G"],
  [2, "Alphabet Pronunciation", "ache", "French name of the letter H"],
  [2, "Alphabet Pronunciation", "i", "French name of the letter I"],
  [2, "Alphabet Pronunciation", "ji", "French name of the letter J"],
  [2, "Alphabet Pronunciation", "ka", "French name of the letter K"],
  [2, "Alphabet Pronunciation", "elle", "French name of the letter L"],
  [2, "Alphabet Pronunciation", "emme", "French name of the letter M"],
  [2, "Alphabet Pronunciation", "enne", "French name of the letter N"],
  [2, "Alphabet Pronunciation", "o", "French name of the letter O"],
  [2, "Alphabet Pronunciation", "pé", "French name of the letter P"],
  [2, "Alphabet Pronunciation", "ku", "French name of the letter Q"],
  [2, "Alphabet Pronunciation", "erre", "French name of the letter R"],
  [2, "Alphabet Pronunciation", "esse", "French name of the letter S"],
  [2, "Alphabet Pronunciation", "té", "French name of the letter T"],
  [2, "Alphabet Pronunciation", "u", "French name of the letter U"],
  [2, "Alphabet Pronunciation", "vé", "French name of the letter V"],
  [2, "Alphabet Pronunciation", "double vé", "French name of the letter W"],
  [2, "Alphabet Pronunciation", "iks", "French name of the letter X"],
  [2, "Alphabet Pronunciation", "i grec", "French name of the letter Y"],
  [2, "Alphabet Pronunciation", "zéde", "French name of the letter Z"],
  [5, "Introducing Yourself", "Exemples", "Examples"],
  [3, "Numbers", "Les nombres", "Numbers"],
  [3, "Numbers", "0-10", "0-10"],
  [3, "Numbers", "11-20", "11-20"],
  [3, "Numbers", "Les dizaines", "Tens"],
  [4, "Ordinal Numbers", "Le rang", "Ordinal position"],
  [4, "Ordinal Numbers", "1er-5e", "1st-5th"],
  [4, "Ordinal Numbers", "6e-10e", "6th-10th"],
  [4, "Ordinal Numbers", "Exemple", "Example"],
  [6, "Family", "Mon grand-père s'appelle ... et il a ... ans.", "My grandfather is called ... and he is ... years old."],
  [6, "Family", "Ma grand-mère s'appelle ... et elle a ... ans.", "My grandmother is called ... and she is ... years old."],
  [6, "Family", "Mon oncle s'appelle ... et il a ... ans.", "My uncle is called ... and he is ... years old."],
  [6, "Family", "Mon père s'appelle ... et il a ... ans.", "My father is called ... and he is ... years old."],
  [6, "Family", "Ma mère s'appelle ... et elle a ... ans.", "My mother is called ... and she is ... years old."],
  [6, "Family", "Ma tante s'appelle ... et elle a ... ans.", "My aunt is called ... and she is ... years old."],
  [6, "Family", "Je m'appelle ... et j'ai ... ans.", "My name is ... and I am ... years old."],
  [6, "Family", "Mon cousin s'appelle ... et il a ... ans.", "My male cousin is called ... and he is ... years old."],
  [6, "Family", "Mon frère s'appelle ... et il a ... ans.", "My brother is called ... and he is ... years old."],
  [6, "Family", "Ma sœur s'appelle ... et elle a ... ans.", "My sister is called ... and she is ... years old."],
  [6, "Family", "Ma cousine s'appelle ... et elle a ... ans.", "My female cousin is called ... and she is ... years old."],
  [7, "Family", "Ma fille s'appelle ... et elle a ... ans.", "My daughter is called ... and she is ... years old."],
  [7, "Family", "Mon fils s'appelle ... et il a ... ans.", "My son is called ... and he is ... years old."],
  [7, "Family", "Mon voisin s'appelle ... et il a ... ans.", "My male neighbor is called ... and he is ... years old."],
  [7, "Family", "Ma voisine s'appelle ... et elle a ... ans.", "My female neighbor is called ... and she is ... years old."],
  [7, "Family", "Mon collègue s'appelle ... et il a ... ans.", "My male colleague is called ... and he is ... years old."],
  [7, "Family", "Ma collègue s'appelle ... et elle a ... ans.", "My female colleague is called ... and she is ... years old."],
  [7, "Family", "Mon ami s'appelle ... et il a ... ans.", "My male friend is called ... and he is ... years old."],
  [7, "Family", "Mon amie s'appelle ... et elle a ... ans.", "My female friend is called ... and she is ... years old."],
  [7, "Family", "Mon homme s'appelle ... et il a ... ans.", "My man / partner is called ... and he is ... years old."],
  [7, "Family", "Ma femme s'appelle ... et elle a ... ans.", "My wife is called ... and she is ... years old."],
  [10, "Time & Dates", "Les moments de la journée", "Times of the day"],
  [11, "Time & Dates", "Les jours", "Days"],
  [11, "Time & Dates", "Les mois", "Months"],
  [11, "Time & Dates", "Date : lundi 13/1/2026", "Date: Monday 13/1/2026"],
  [11, "Time & Dates", "Hier, dimanche douze janvier deux mille vingt-six.", "Yesterday, Sunday January twelfth two thousand twenty-six."],
  [11, "Time & Dates", "Aujourd'hui, lundi treize janvier deux mille vingt-six.", "Today, Monday January thirteenth two thousand twenty-six."],
  [11, "Time & Dates", "Demain, mardi quatorze janvier deux mille vingt-six.", "Tomorrow, Tuesday January fourteenth two thousand twenty-six."],
  [12, "Time & Dates", "Les nombres (1-31)", "Numbers (1-31)"],
  [12, "Time & Dates", "vingt et un", "twenty-one"],
  [12, "Time & Dates", "vingt-deux", "twenty-two"],
  [12, "Time & Dates", "vingt-trois", "twenty-three"],
  [12, "Time & Dates", "vingt-quatre", "twenty-four"],
  [12, "Time & Dates", "vingt-cinq", "twenty-five"],
  [12, "Time & Dates", "vingt-six", "twenty-six"],
  [12, "Time & Dates", "vingt-sept", "twenty-seven"],
  [12, "Time & Dates", "vingt-huit", "twenty-eight"],
  [12, "Time & Dates", "vingt-neuf", "twenty-nine"],
  [12, "Time & Dates", "trente et un", "thirty-one"],
  [12, "Time & Dates", "Date de naissance : 20/06/1999", "Date of birth: 20/06/1999"],
  [12, "Time & Dates", "Je suis né(e) le vingt juin mille neuf cent quatre-vingt-dix-neuf.", "I was born on June twentieth, nineteen ninety-nine."],
  [14, "Family Dates", "Mon grand-père s'appelle ... et il a ... ans. Il est né le .../.../...", "My grandfather is called ... and he is ... years old. He was born on .../.../..."],
  [14, "Family Dates", "Ma grand-mère s'appelle ... et elle a ... ans. Elle est née le .../.../...", "My grandmother is called ... and she is ... years old. She was born on .../.../..."],
  [14, "Family Dates", "Mon oncle s'appelle ... et il a ... ans. Il est né le .../.../...", "My uncle is called ... and he is ... years old. He was born on .../.../..."],
  [14, "Family Dates", "Mon père s'appelle ... et il a ... ans. Il est né le .../.../...", "My father is called ... and he is ... years old. He was born on .../.../..."],
  [14, "Family Dates", "Ma mère s'appelle ... et elle a ... ans. Elle est née le .../.../...", "My mother is called ... and she is ... years old. She was born on .../.../..."],
  [14, "Family Dates", "Ma tante s'appelle ... et elle a ... ans. Elle est née le .../.../...", "My aunt is called ... and she is ... years old. She was born on .../.../..."],
  [14, "Family Dates", "Je m'appelle ... et j'ai ... ans. Je suis né(e) le .../.../...", "My name is ... and I am ... years old. I was born on .../.../..."],
  [14, "Family Dates", "Mon cousin s'appelle ... et il a ... ans. Il est né le .../.../...", "My male cousin is called ... and he is ... years old. He was born on .../.../..."],
  [14, "Family Dates", "Mon frère s'appelle ... et il a ... ans. Il est né le .../.../...", "My brother is called ... and he is ... years old. He was born on .../.../..."],
  [14, "Family Dates", "Ma sœur s'appelle ... et elle a ... ans. Elle est née le .../.../...", "My sister is called ... and she is ... years old. She was born on .../.../..."],
  [14, "Family Dates", "Ma cousine s'appelle ... et elle a ... ans. Elle est née le .../.../...", "My female cousin is called ... and she is ... years old. She was born on .../.../..."],
  [22, "Prepositions", "Milieu", "Middle"],
  [22, "Prepositions", "Direction", "Direction"]
];

const vocab: VocabItem[] = [...rawData, ...supplementalRawData].map(([page, category, french, english]) => ({
  page,
  category,
  french,
  english,
}));

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function uniqueByText(items: VocabItem[]): VocabItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = `${item.french}|||${item.english}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function buildQuestions(items: VocabItem[], direction: Direction, count: number): Question[] {
  const uniqueItems = uniqueByText(items);
  const chosen = shuffle(uniqueItems).slice(0, Math.min(count, uniqueItems.length));

  return chosen.map((item) => {
    const prompt = direction === "fr-en" ? item.french : item.english;
    const correct = direction === "fr-en" ? item.english : item.french;
    const pool = Array.from(
      new Set(
        uniqueItems
          .map((entry) => (direction === "fr-en" ? entry.english : entry.french))
          .filter((value) => value !== correct),
      ),
    );

    const distractors = shuffle(pool).slice(0, Math.min(3, pool.length));
    const options = shuffle([correct, ...distractors]);

    return { ...item, prompt, correct, options };
  });
}

function runSelfTests(): string[] {
  const failures: string[] = [];
  const sample: VocabItem[] = [
    { page: 1, category: "Test", french: "bonjour", english: "hello" },
    { page: 1, category: "Test", french: "chat", english: "cat" },
    { page: 1, category: "Test", french: "chien", english: "dog" },
    { page: 1, category: "Test", french: "rouge", english: "red" },
    { page: 1, category: "Test", french: "bleu", english: "blue" },
  ];

  const q1 = buildQuestions(sample, "fr-en", 3);
  if (q1.length !== 3) failures.push("buildQuestions should honor count when enough items exist.");
  if (!q1.every((q) => q.options.includes(q.correct))) failures.push("Every question should include the correct answer.");
  if (!q1.every((q) => q.options.length >= 2 && q.options.length <= 4)) failures.push("Questions should have between 2 and 4 options depending on pool size.");

  const q2 = buildQuestions(sample.slice(0, 2), "en-fr", 10);
  if (q2.length !== 2) failures.push("buildQuestions should cap the count at the item length.");
  if (!q2.every((q) => q.prompt.length > 0 && q.correct.length > 0)) failures.push("Questions should always have prompt and correct text.");

  const q3 = buildQuestions([
    { page: 1, category: "Test", french: "bonjour", english: "hello" },
    { page: 2, category: "Test", french: "bonjour", english: "hello" },
    { page: 3, category: "Test", french: "salut", english: "hi" },
  ], "fr-en", 10);
  if (q3.length !== 2) failures.push("Duplicate french/english pairs should be deduplicated for quiz generation.");

  const presentFrench = new Set(vocab.map((item) => item.french));
  const expectedDays = ["samedi", "dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi"];
  const expectedMonths = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"];
  const expectedDateNumbers = ["un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt", "vingt et un", "vingt-deux", "vingt-trois", "vingt-quatre", "vingt-cinq", "vingt-six", "vingt-sept", "vingt-huit", "vingt-neuf", "trente", "trente et un"];

  if (!expectedDays.every((day) => presentFrench.has(day))) failures.push("All 7 days of the week should be present in the dataset.");
  if (!expectedMonths.every((month) => presentFrench.has(month))) failures.push("All 12 months should be present in the dataset.");
  if (!expectedDateNumbers.every((value) => presentFrench.has(value))) failures.push("All date numbers from 1 to 31 should be present in the dataset.");

  const expectedAlphabetItems = ["A", "Z", "bé", "double vé", "i grec", "zéde"];
  if (!expectedAlphabetItems.every((value) => presentFrench.has(value))) failures.push("OCR-added alphabet letters and pronunciation entries should be present in the dataset.");

  return failures;
}

function speakFrench(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  utterance.rate = 0.92;
  utterance.pitch = 1;

  const voices = window.speechSynthesis.getVoices();
  const frenchVoice = voices.find((voice) => voice.lang.toLowerCase().startsWith("fr"));
  if (frenchVoice) utterance.voice = frenchVoice;

  window.speechSynthesis.speak(utterance);
}

export default function FrenchPictureBookQuiz() {
  const categories = useMemo(() => ["All", ...Array.from(new Set(vocab.map((v) => v.category)))], []);
  const pageOptions = useMemo(() => ["All pages", ...Array.from(new Set(vocab.map((v) => v.page))).sort((a, b) => a - b).map(String)], []);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedPage, setSelectedPage] = useState<string>("All pages");
  const [direction, setDirection] = useState<Direction>("fr-en");
  const [questionCount, setQuestionCount] = useState<number>(20);
  const [search, setSearch] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [finished, setFinished] = useState<boolean>(false);
  const [started, setStarted] = useState<boolean>(false);
  const [testFailures, setTestFailures] = useState<string[]>([]);

  useEffect(() => {
    setTestFailures(runSelfTests());
  }, []);

  const lessonFiltered = useMemo(() => {
    const pageFiltered = selectedPage === "All pages"
      ? vocab
      : vocab.filter((item) => item.page === Number(selectedPage));

    return selectedCategory === "All"
      ? pageFiltered
      : pageFiltered.filter((item) => item.category === selectedCategory);
  }, [selectedCategory, selectedPage]);

  const filteredWords = useMemo(() => {
    if (!search.trim()) return lessonFiltered;
    const query = search.toLowerCase();
    return lessonFiltered.filter((item) =>
      item.french.toLowerCase().includes(query) ||
      item.english.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      String(item.page).includes(query) ||
      (lessonTitles[item.page] ?? "").toLowerCase().includes(query),
    );
  }, [lessonFiltered, search]);

  const current = questions[index];

  function startQuiz() {
    const nextQuestions = buildQuestions(lessonFiltered, direction, questionCount);
    setQuestions(nextQuestions);
    setIndex(0);
    setScore(0);
    setSelected(null);
    setFinished(false);
    setStarted(true);

    if (nextQuestions[0]) speakFrench(nextQuestions[0].french);
  }

  function answer(choice: string) {
    if (selected || !current) return;
    setSelected(choice);
    if (choice === current.correct) setScore((prev) => prev + 1);
    speakFrench(current.french);
  }

  function nextQuestion() {
    const nextIndex = index + 1;
    if (nextIndex >= questions.length) {
      setFinished(true);
      return;
    }
    setIndex(nextIndex);
    setSelected(null);
    speakFrench(questions[nextIndex].french);
  }

  const uniqueCount = uniqueByText(lessonFiltered).length;

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                French picture-book quiz
              </div>
              <h1 className="mt-2 text-3xl font-bold text-slate-900 md:text-5xl">
                Full PDF quiz with voice
              </h1>
              <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
                I expanded the quiz to cover the full booklet content page by page, including vocabulary,
                sentence patterns, and example phrases. You can now study by page, by category, or quiz
                the whole set with French text-to-speech.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-2xl font-bold text-slate-900">{vocab.length}</div>
                <div className="text-sm text-slate-600">total entries</div>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-2xl font-bold text-slate-900">{Object.keys(lessonTitles).length - 1}</div>
                <div className="text-sm text-slate-600">lesson pages</div>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-lg font-bold text-slate-900">{selectedPage}</div>
                <div className="text-sm text-slate-600">selected page</div>
              </div>
              <div className="rounded-2xl bg-slate-100 p-4">
                <div className="text-lg font-bold text-slate-900">{selectedCategory}</div>
                <div className="text-sm text-slate-600">selected category</div>
              </div>
            </div>
          </div>
        </section>

        {testFailures.length > 0 ? (
          <section className="rounded-3xl border border-rose-200 bg-rose-50 p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-rose-900">Internal checks failed</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rose-800">
              {testFailures.map((failure) => (
                <li key={failure}>{failure}</li>
              ))}
            </ul>
          </section>
        ) : (
          <section className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
            <div className="text-sm font-medium text-emerald-800">
              Internal checks passed for quiz generation and duplicate handling.
            </div>
          </section>
        )}

        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Quiz settings</h2>
            <p className="mt-1 text-sm text-slate-600">
              Filter by page or category, then start. Chrome or Edge usually works best for voice.
            </p>

            <label className="mt-5 block text-sm font-medium text-slate-700">Page / lesson</label>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
            >
              {pageOptions.map((page) => (
                <option key={page} value={page}>
                  {page === "All pages" ? page : `Page ${page} - ${lessonTitles[Number(page)]}`}
                </option>
              ))}
            </select>

            <label className="mt-4 block text-sm font-medium text-slate-700">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <label className="mt-4 block text-sm font-medium text-slate-700">Direction</label>
            <select
              value={direction}
              onChange={(e) => setDirection(e.target.value as Direction)}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
            >
              <option value="fr-en">French → English</option>
              <option value="en-fr">English → French</option>
            </select>

            <label className="mt-4 block text-sm font-medium text-slate-700">Number of questions</label>
            <select
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
            >
              {[10, 20, 30, 50, 100].map((count) => (
                <option key={count} value={count}>
                  {count}
                </option>
              ))}
            </select>

            <button
              onClick={startQuiz}
              disabled={uniqueCount === 0}
              className="mt-5 w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {started ? "Restart quiz" : "Start quiz"}
            </button>

            <div className="mt-4 rounded-2xl bg-slate-100 p-4 text-sm leading-6 text-slate-600">
              <strong className="text-slate-900">Current study set:</strong> {uniqueCount} unique quiz items.
              <br />
              <strong className="text-slate-900">Voice tip:</strong> if speech does not start on the first auto-play,
              click a <span className="font-semibold text-slate-900">Speak French</span> button once.
            </div>
          </aside>

          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              {!started ? (
                <div className="grid min-h-[340px] place-items-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                  <div>
                    <h3 className="text-2xl font-semibold text-slate-900">Ready to start?</h3>
                    <p className="mt-2 text-slate-600">
                      Pick a page like <strong>Page 17 - Les pays arabes</strong> or leave it on <strong>All pages</strong>,
                      then press <strong>Start quiz</strong>.
                    </p>
                  </div>
                </div>
              ) : finished ? (
                <div className="space-y-5">
                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-full rounded-full bg-slate-900" />
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-8 text-center">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Finished</div>
                    <h3 className="mt-2 text-3xl font-bold text-slate-900">
                      Your score: {score} / {questions.length}
                    </h3>
                    <p className="mt-3 text-slate-600">
                      {score === questions.length
                        ? "Perfect run. Nice work."
                        : score >= Math.ceil(questions.length * 0.7)
                          ? "Good job. You are building strong recall."
                          : "Keep repeating small sets. That works really well."}
                    </p>
                    <button
                      onClick={startQuiz}
                      className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              ) : current ? (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                        Question {index + 1} of {questions.length}
                      </div>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900">
                        Page {current.page} - {lessonTitles[current.page] ?? current.category}
                      </h3>
                      <div className="mt-1 text-sm text-slate-600">{current.category}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                      Score: {score}
                    </div>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-900 transition-all"
                      style={{ width: `${((index + 1) / questions.length) * 100}%` }}
                    />
                  </div>

                  <div className="rounded-3xl bg-slate-50 p-8 text-center">
                    <div className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                      {direction === "fr-en" ? "Translate this French" : "Translate this English"}
                    </div>
                    <div className="mt-4 text-3xl font-bold leading-tight text-slate-900 md:text-5xl">
                      {current.prompt}
                    </div>
                    <div className="mt-5 flex flex-wrap justify-center gap-3">
                      <button
                        onClick={() => speakFrench(current.french)}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900"
                      >
                        🔊 Speak French
                      </button>
                      <button
                        onClick={() => speakFrench(current.french)}
                        className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900"
                      >
                        🔁 Repeat
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {current.options.map((option) => {
                      const isCorrect = option === current.correct;
                      const isSelected = option === selected;

                      let className = "rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left text-sm font-medium text-slate-800 transition hover:border-slate-400";
                      if (selected) {
                        if (isCorrect) className = "rounded-2xl border border-emerald-500 bg-emerald-50 px-4 py-4 text-left text-sm font-medium text-slate-800";
                        else if (isSelected) className = "rounded-2xl border border-rose-500 bg-rose-50 px-4 py-4 text-left text-sm font-medium text-slate-800";
                        else className = "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-medium text-slate-600";
                      }

                      return (
                        <button key={option} onClick={() => answer(option)} className={className}>
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {selected && (
                    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-slate-100 p-4">
                      <div className="text-sm text-slate-700">
                        Correct answer: <span className="font-semibold text-slate-900">{current.correct}</span>
                      </div>
                      <button
                        onClick={nextQuestion}
                        className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                      >
                        {index + 1 === questions.length ? "Finish" : "Next"}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl bg-slate-50 p-6 text-sm text-slate-600">
                  No quiz items match this filter yet.
                </div>
              )}
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-slate-900">Word bank</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Click any card to hear the French again. Search works across French, English, category, and page title.
                  </p>
                </div>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search French, English, page, or category..."
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm md:max-w-sm"
                />
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {filteredWords.map((item, idx) => (
                  <button
                    key={`${item.page}-${item.category}-${item.french}-${item.english}-${idx}`}
                    onClick={() => speakFrench(item.french)}
                    className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:-translate-y-[1px] hover:border-slate-400"
                  >
                    <div className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                      Page {item.page} - {lessonTitles[item.page] ?? item.category}
                    </div>
                    <div className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                      {item.category}
                    </div>
                    <div className="mt-2 text-lg font-semibold text-slate-900">{item.french}</div>
                    <div className="mt-1 text-sm text-slate-600">{item.english}</div>
                  </button>
                ))}
              </div>

              <p className="mt-5 text-sm text-slate-500">
                {filteredWords.length} item{filteredWords.length === 1 ? "" : "s"} shown.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
