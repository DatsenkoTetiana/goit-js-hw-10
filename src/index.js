import './css/styles.css';
import { Notify } from 'notiflix';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

searchBox.addEventListener('input', debounce(onsearchBox, DEBOUNCE_DELAY));
searchBox.insertAdjacentHTML(
  'beforebegin',
  '<header><h1 class="header__title">Country search</h1><header>'
);
function onsearchBox(e) {
  e.preventDefault();
  const name = searchBox.value.trim();
  if (name === '') {
    return (countryList.innerHTML = ''), (countryInfo.innerHTML = '');
  }

  fetchCountries(name)
    .then(data => {
      countryList.innerHTML = '';
      countryInfo.innerHTML = '';
      if (data.length === 1) {
        countryList.insertAdjacentHTML('beforeend', renderList(data));
        countryInfo.insertAdjacentHTML('beforeend', renderInfo(data));
      } else if (data.length >= 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      } else {
        countryList.insertAdjacentHTML('beforeend', renderList(data));
      }
    })
    .catch(error => {
      Notify.failure('Oops, there is no country with that name');
    });
}

function renderList(data) {
  const markup = data
    .map(({ name, flags }) => {
      return `
          <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 100px height = 100px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `;
    })
    .join('');
  return markup;
}

function renderInfo(data) {
  const markup = data
    .map(({ capital, population, languages }) => {
      return `
        <ul class="country-info__list">
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(
              languages
            ).join(', ')}</p></li>
        </ul>
        `;
    })
    .join('');
  return markup;
}
