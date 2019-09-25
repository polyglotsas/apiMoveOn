const path = require('path');

const langs = {
  'Abkhazian': 4,
  'Afar': 5,
  'Afrikaans': 6,
  'Akan': 7,
  'Albanian': 8,
  'Amharic': 9,
  'Arabic': 10,
  'Aragonese': 11,
  'Armenian': 12,
  'Assamese': 13,
  'Avaric': 14,
  'Aymara': 15,
  'Azerbaijani': 16,
  'Bambara': 17,
  'Bashkir': 18,
  'Basque': 19,
  'Belarusian': 20,
  'Bengali': 21,
  'Bislama': 22,
  'Bosnian': 23,
  'Breton': 24,
  'Bulgarian': 25,
  'Burmese': 26,
  'Catalan': 27,
  'Central Khmer': 28,
  'Chamorro': 29,
  'Chechen': 30,
  'Chichewa': 31,
  'Chinese': 32,
  'Chuvash': 33,
  'Cornish': 34,
  'Corsican': 35,
  'Cree': 36,
  'Croatian': 37,
  'Czech': 38,
  'Danish': 39,
  'Divehi': 40,
  'Dutch': 41,
  'Dzongkha': 42,
  'English': 1,
  'Estonian': 43,
  'Ewe': 44,
  'Faroese': 45,
  'Fijian': 46,
  'Finnish': 47,
  'French': 3,
  'Fulah': 48,
  'Galician': 49,
  'Ganda': 50,
  'Georgian': 51,
  'German': 2,
  'Greek': 52,
  'Guarani': 53,
  'Gujarati': 54,
  'Haitian Creole': 55,
  'Hausa': 56,
  'Hebrew': 57,
  'Herero': 58,
  'Hindi': 59,
  'Hiri Motu': 60,
  'Hungarian': 61,
  'Icelandic': 62,
  'Igbo': 63,
  'Indonesian': 64,
  'Inuktitut': 65,
  'Inupiaq': 66,
  'Irish': 67,
  'Italian': 68,
  'Japanese': 69,
  'Javanese': 70,
  'Kalaallisut': 71,
  'Kannada': 72,
  'Kanuri': 73,
  'Kashmiri': 74,
  'Kazakh': 75,
  'Kikuyu, Gikuyu': 76,
  'Kinyarwanda': 77,
  'Kirghiz': 78,
  'Komi': 79,
  'Kongo': 80,
  'Korean': 81,
  'Kuanyama': 82,
  'Kurdish': 83,
  'Lao': 84,
  'Latvian': 85,
  'Limburgish': 86,
  'Lingala': 87,
  'Lithuanian': 88,
  'Luba-Katanga': 89,
  'Luxembourgish': 90,
  'Macedonian': 91,
  'Malagasy': 92,
  'Malay': 93,
  'Malayalam': 94,
  'Maltese': 95,
  'Manx': 96,
  'Maori': 97,
  'Marathi': 98,
  'Marshallese': 99,
  'Mongolian': 100,
  'Nauruan': 101,
  'Navajo, Navaho': 102,
  'Ndonga': 103,
  'Nepali': 104,
  'North Ndebele': 105,
  'Northern Sami': 106,
  'Norwegian': 107,
  'Norwegian Bokmål': 108,
  'Norwegian Nynorsk': 109,
  'Occitan': 110,
  'Ojibwa': 111,
  'Oriya': 112,
  'Oromo': 113,
  'Ossetian, Ossetic': 114,
  'Other': 115,
  'Panjabi, Punjabi': 116,
  'Persian': 117,
  'Polish': 118,
  'Portuguese': 119,
  'Pushto, Pashto': 120,
  'Quechua': 121,
  'Romanian': 122,
  'Romansh': 123,
  'Rundi': 124,
  'Russian': 125,
  'Samoan': 126,
  'Sango': 127,
  'Sardinian': 128,
  'Scottish Gaelic': 129,
  'Serbian': 130,
  'Shona': 131,
  'Sichuan Yi': 132,
  'Sindhi': 133,
  'Sinhalese': 134,
  'Slovak': 135,
  'Slovenian': 136,
  'Somali': 137,
  'Sotho, Southern': 138,
  'South Ndebele': 139,
  'Spanish': 140,
  'Sundanese': 141,
  'Swahili': 142,
  'Swati': 143,
  'Swedish': 144,
  'Tagalog': 145,
  'Tahitian': 146,
  'Tajik': 147,
  'Tamil': 148,
  'Tatar': 149,
  'Telugu': 150,
  'Thai': 151,
  'Tibetan': 152,
  'Tigrinya': 153,
  'Tonga': 154,
  'Tsonga': 155,
  'Tswana': 156,
  'Turkish': 157,
  'Turkmen': 158,
  'Twi': 159,
  'Uighur': 160,
  'Ukrainian': 161,
  'Urdu': 162,
  'Uzbek': 163,
  'Venda': 164,
  'Vietnamese': 165,
  'Walloon': 166,
  'Welsh': 167,
  'Western Frisian': 168,
  'Wolof': 169,
  'Xhosa': 170,
  'Yiddish': 171,
  'Yoruba': 172,
  'Zhuang, Chuang': 173,
  'Zulu': 174
};

const places = {
  'Afghanistan': 1,
  'Albania': 2,
  'Algeria': 3,
  'American Samoa': 4,
  'Andorra': 5,
  'Angola': 6,
  'Anguilla': 7,
  'Antarctica': 8,
  'Antigua and Barbuda': 9,
  'Argentina': 10,
  'Armenia': 11,
  'Aruba': 12,
  'Australia': 13,
  'Austria': 14,
  'Azerbaijan': 15,
  'Bahamas': 16,
  'Bahrain': 17,
  'Bangladesh': 18,
  'Barbados': 19,
  'Belarus': 20,
  'Belgium': 21,
  'Belize': 22,
  'Benin': 23,
  'Bermuda': 24,
  'Bhutan': 25,
  'Bolivia': 26,
  'Bonaire, Sint Eustatius and Saba': 513,
  'Bosnia and Herzegovina': 27,
  'Botswana': 28,
  'Bouvet Island': 29,
  'Brazil': 30,
  'British Indian Ocean Territory': 31,
  'Brunei Darussalam': 32,
  'Bulgaria': 33,
  'Burkina faso': 34,
  'Burundi': 35,
  'Cambodia': 36,
  'Cameroon': 37,
  'Canada': 38,
  'Cape Verde': 39,
  'Cayman Islands': 40,
  'Central African Republic': 41,
  'Chad': 42,
  'Chile': 43,
  'China': 44,
  'Christmas Island': 45,
  'Cocos (Keeling) Islands': 46,
  'Colombia': 47,
  'Comoros': 48,
  'Congo': 49,
  'Congo, the Dem. Rep. of the': 50,
  'Cook Islands': 51,
  'Costa Rica': 52,
  'Cote d\'Ivoire': 53,
  'Croatia': 54,
  'Cuba': 55,
  'Curaçao': 514,
  'Cyprus': 56,
  'Czech Republic': 57,
  'Denmark': 58,
  'Djibouti': 59,
  'Dominica': 60,
  'Dominican Republic': 61,
  'Ecuador': 62,
  'Egypt': 63,
  'El Salvador': 64,
  'Equatorial Guinea': 65,
  'Eritrea': 66,
  'Estonia': 67,
  'Ethiopia': 68,
  'Falkland Islands (Malvinas)': 69,
  'Faroe Islands': 70,
  'Fiji': 71,
  'Finland': 72,
  'France': 73,
  'French Guiana': 74,
  'French Polynesia': 75,
  'French Southern Territories': 76,
  'Gabon': 77,
  'Gambia': 78,
  'Georgia': 79,
  'Germany': 80,
  'Ghana': 81,
  'Gibraltar': 82,
  'Greece': 83,
  'Greenland': 84,
  'Grenada': 85,
  'Guadeloupe': 86,
  'Guam': 87,
  'Guatemala': 88,
  'Guernsey': 89,
  'Guinea': 90,
  'Guinea-Bissau': 91,
  'Guyana': 92,
  'Haiti': 93,
  'Heard Island and Mcdonald Islands': 94,
  'Honduras': 95,
  'Hong Kong': 96,
  'Hungary': 97,
  'Iceland': 98,
  'India': 99,
  'Indonesia': 100,
  'Iran': 101,
  'Iraq': 102,
  'Ireland': 103,
  'Isle of Man': 104,
  'Israel': 105,
  'Italy': 106,
  'Jamaica': 107,
  'Japan': 108,
  'Jersey': 109,
  'Jordan': 110,
  'Kazakhstan': 111,
  'Kenya': 112,
  'Kiribati': 113,
  'Korea, Dem. People\'s Rep.Of': 114,
  'Korea, Republic of': 115,
  'Kosovo': 116,
  'Kuwait': 117,
  'Kyrgyzstan': 118,
  'Laos': 119,
  'Latvia': 120,
  'Lebanon': 121,
  'Lesotho': 122,
  'Liberia': 123,
  'Libya': 124,
  'Liechtenstein': 125,
  'Lithuania': 126,
  'Luxembourg': 127,
  'Macao': 128,
  'Macedonia, Former Yugoslav Rep. of': 129,
  'Madagascar': 130,
  'Malawi': 131,
  'Malaysia': 132,
  'Maldives': 133,
  'Mali': 134,
  'Malta': 135,
  'Marshall Islands': 136,
  'Martinique': 137,
  'Mauritania': 138,
  'Mauritius': 139,
  'Mayotte': 140,
  'Mexico': 141,
  'Micronesia': 142,
  'Moldova': 143,
  'Monaco': 144,
  'Mongolia': 145,
  'Montenegro': 146,
  'Montserrat': 147,
  'Morocco': 148,
  'Mozambique': 149,
  'Myanmar': 150,
  'Namibia': 151,
  'Nauru': 152,
  'Nepal': 153,
  'Netherlands': 154,
  'Netherlands Antilles': 155,
  'New Caledonia': 156,
  'New Zealand': 157,
  'Nicaragua': 158,
  'Niger': 159,
  'Nigeria': 160,
  'Niue': 161,
  'Norfolk Island': 162,
  'Northern Mariana Islands': 163,
  'Norway': 164,
  'Oman': 165,
  'Pakistan': 167,
  'Palau': 168,
  'Palestine': 169,
  'Panama': 170,
  'Papua New Guinea': 171,
  'Paraguay': 172,
  'Peru': 173,
  'Philippines': 174,
  'Pitcairn': 175,
  'Poland': 176,
  'Portugal': 177,
  'Puerto Rico': 178,
  'Qatar': 179,
  'Refugee (1951 convention)': 250,
  'Refugee (other)': 251,
  'Romania': 180,
  'Russian Federation': 181,
  'Rwanda': 182,
  'Réunion': 183,
  'Saint Barthélemy': 184,
  'Saint Helena, Ascension and Tristan Da Cunha': 185,
  'Saint Lucia': 186,
  'Saint Martin': 187,
  'Saint Pierre and Miquelon': 188,
  'Samoa': 189,
  'San Marino': 190,
  'Sao Tome and Principe': 191,
  'Saudi Arabia': 192,
  'Senegal': 193,
  'Serbia': 249,
  'Seychelles': 195,
  'Sierra Leone': 196,
  'Singapore': 197,
  'Sint Maarten (Dutch part)': 454,
  'Slovakia': 198,
  'Slovenia': 199,
  'Solomon Islands': 200,
  'Somalia': 201,
  'South Africa': 202,
  'South Georgia And The South Sandwich Islands': 203,
  'South Sudan': 461,
  'Spain': 204,
  'Sri Lanka': 205,
  'St. Kitts and Nevis': 206,
  'St. Vincent and the Grenadines': 207,
  'Stateless': 252,
  'Sudan': 208,
  'Suriname': 209,
  'Svalbard and Jan Mayen': 210,
  'Swaziland': 211,
  'Sweden': 212,
  'Switzerland': 213,
  'Syria': 214,
  'Taiwan': 215,
  'Tajikistan': 216,
  'Tanzania': 217,
  'Thailand': 218,
  'Timor-Leste': 219,
  'Togo': 220,
  'Tokelau': 221,
  'Tonga': 222,
  'Trinidad and Tobago': 223,
  'Tunisia': 224,
  'Turkey': 225,
  'Turkmenistan': 226,
  'Turks And Caicos Islands': 227,
  'Tuvalu': 228,
  'Uganda': 229,
  'Ukraine': 230,
  'United Arab Emirates': 231,
  'United Kingdom': 232,
  'United Kingdom (British dependent territories)': 253,
  'United Kingdom (British national - overseas)': 254,
  'United Kingdom (British overseas citizen)': 255,
  'United Kingdom (British protected person)': 256,
  'United States': 233,
  'United States Minor Outlying Islands': 234,
  'Unspecified': 166,
  'Uruguay': 235,
  'Uzbekistan': 236,
  'Vanuatu': 237,
  'Vatican': 238,
  'Venezuela': 239,
  'Viet Nam': 240,
  'Virgin Islands, British': 241,
  'Virgin Islands, U.S.': 242,
  'Wallis And Futuna': 243,
  'Western Sahara': 244,
  'Yemen': 245,
  'Zambia': 246,
  'Zimbabwe': 247,
  'Åland Islands': 248
};

const gender = {
  'Not Known': 1,
  'Male': 2,
  'Female': 3,
  'Not applicable': 4,
  'I prefer not to say': 5,
  'Non-binary': 6,
  'Other': 7
};

const lists = {
  'preferred_language': langs,
  'language_id': langs,
  'nationality': places,
  'nationality2': places,
  'country_of_birth': places,
  'country': places,
  'country.name': places, // TODO Check
  'home_country.name': places, // TODO Check
  'gender': gender,
  'gender.id': gender
};

module.exports = {
  'url': {
    'hostname': 'uniandes05-api.moveonca.com',
    'path': '/restService/index.php?version=3.0'
  },
  'ContentType': 'application/x-www-form-urlencoded',
  'certificate': {
    'privateKey': path.join(process.cwd(), 'certificate', 'llavePrivada.key'),
    'certificate': path.join(process.cwd(), 'certificate', 'certificado.crt'),
    'passphrase': 'uniandes'
  },
  'fileSettings': {
    'separator': '\t',
    'encoding': 'utf16le'
  },
  lists
};
