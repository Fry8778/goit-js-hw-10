import './css/styles.css';
import { fetchCountries } from './fetchCountries';
import makeCountryEl from '../countriesElement/country-element.hbs';
import makeCountriesEl from '../countriesElement/countries-element.hbs';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const inputBox = document.querySelector('#search-box');

inputBox.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
    if (!e.target.value.trim()) {
        clearEl();
        return;
    }

    fetchCountries(e.target.value.trim())
        .then(countries => {
            clearEl();
            if (countries.length > 10) {
                Notify.info(
                    'Too many matches found. Please enter a more specific name.',
                    { timeout: 1000 }
                );
                return;
            }

            if (countries.length <= 10 && countries.length >= 2) {
                countryList.innerHTML = countries
                    .map(makeCountriesEl)
                    .join('');
                return;
            }

            countryInfo.innerHTML = makeCountryEl(countries[0]);
            return;
        })
        .catch(error => {
            clearEl();
            Notify.failure(error, { timeout: 1000 });
        });
}

function clearEl() {
    countryInfo.innerHTML = '';
    countryList.innerHTML = '';
}