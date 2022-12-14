import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import { fetchCountries } from './js/fetchCountries';

const DEBOUNCE_DELAY = 300;

const inputBox = document.querySelector('#search-box');
const listEl = document.querySelector('.country-list');
const blockEl = document.querySelector('.country-info');

inputBox.addEventListener('input', debounce(onInputWrite, DEBOUNCE_DELAY));

function onInputWrite(e) {
  let nameOfCountry = e.target.value.trim();
  if (!nameOfCountry) {
    return;
  }

  fetchCountries(nameOfCountry)
    .then(res => {
      if (res.length > 10) {
        blockEl.innerHTML = '';
        listEl.innerHTML = '';
        return Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (res.length === 1) {
        listEl.innerHTML = '';
        return (blockEl.innerHTML = onRenderCountryCard(res));
      }
      blockEl.innerHTML = '';
      listEl.innerHTML = onRenderList(res);
    })
    .catch(error => {
      blockEl.innerHTML = '';
		 listEl.innerHTML = '';
		 return Notiflix.Notify.failure(
          'Oops, there is no country with that name.'
        );
    });
}

function onRenderList(array) {
  return array
    .map(
      ({ name, flags }) =>
        `<li class="country-item"><img src="${flags.png}" alt="${name.official}" width='32' height = '20'>
        <p class="country-text">${name.official}</p></li>`
    )
    .join('');
}

function onRenderCountryCard(array) {
  return array
    .map(
      ({ name, capital, population, flags, languages }) =>
        `<div class = "country-item"><img src="${flags.png}" alt="${
          name.official
        }" width='64' height = '40'>
        <h1 class="country-text">${name.official}</h1></div>
        <p class="country-text-info">Capital: ${capital}</p>
        <p class="country-text-info">Population: ${population}</p>
        <p class="country-text-info">Languages: ${Object.values(languages)} </p>
        `
    )
    .join();
}