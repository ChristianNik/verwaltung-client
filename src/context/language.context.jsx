import React, { useState } from 'react';
import en from '../languages/en.json';
import de from '../languages/de.json';

export const dictionaryList = { en, de };

export const languageOptions = {
	...(process.env.NODE_ENV === 'development' && {
		'': 'Dev',
	}),
	en: 'English',
	de: 'Deutsch',
};

const LanguageContext = React.createContext({
	userLanguage: 'en',
	dictionary: dictionaryList.en,
});

export function LanguageProvider({ children }) {
	const defaultLanguage = window.localStorage.getItem('rcml-lang');
	const [userLanguage, setUserLanguage] = useState(defaultLanguage || 'en');

	const provider = {
		userLanguage,
		dictionary: dictionaryList[userLanguage],
		userLanguageChange: (selected) => {
			const newLanguage = languageOptions[selected] ? selected : 'en';
			setUserLanguage(newLanguage);
			window.localStorage.setItem('rcml-lang', newLanguage);
		},
	};

	return (
		<LanguageContext.Provider value={provider}>
			{children}
		</LanguageContext.Provider>
	);
}

function escapeRegex(string) {
	return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export const useLanguage = () => {
	const { userLanguage, dictionary, userLanguageChange } =
		React.useContext(LanguageContext);

	return {
		lang: (group, property, replace) => {
			const notFoundText = `no:::${group}/${property}`;
			if (!dictionary) {
				return notFoundText;
			}
			const category = dictionary[group];

			let text = category
				? category[property] ||
				  (typeof category !== 'object' ? category : notFoundText)
				: notFoundText;

			if (replace) {
				Object.keys(replace).map((key) => {
					const value = replace[key];
					const regex = new RegExp(escapeRegex(`{${key}}`), 'g');
					text = text.replace(regex, value);
				});
			}

			return text;
		},
		userLanguage,
		userLanguageChange,
	};
};

export default function LanguageSelector() {
	const { userLanguage, userLanguageChange } = useLanguage();

	// set selected language by calling context method
	const handleLanguageChange = (e) => userLanguageChange(e.target.value);

	return (
		<select onChange={handleLanguageChange} value={userLanguage}>
			{Object.entries(languageOptions).map(([id, name]) => (
				<option key={id} value={id}>
					{name}
				</option>
			))}
		</select>
	);
}
