window.onload = async function () {
  const API_URL =
    "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
  const corsHackURL = "https://cors-anywhere.herokuapp.com/"; // Обход no-cors на сервере, только для тестирования
  const fetchURL = corsHackURL + API_URL;

  // Получение данных с серевра и преобразоование в удобный вид
  const response = await fetch(fetchURL);
  const xmlString = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlString, "text/xml");
  const ratesToEUR = xmlToObj(xmlDoc);

  // Отображение элементов на странице
  renderSelect(ratesToEUR);
  renderTable(ratesToEUR);

  //Привязываем обработчик событий к select'у
  document
    .getElementById("select-currency")
    .addEventListener("change", (evt) => {
      const value = evt.target.value;
      let newRates = rateToCurrency(ratesToEUR, value);
      renderTable(newRates);
    });
};

const rounding = 4; //Округление курса до 4 знаков после запятой, как у ЦБ РФ

//Преобразование полученных данных в массив объектов
function xmlToObj(xmlDoc) {
  const Cubes = xmlDoc.querySelector("Cube[time]").children;
  let rates = [];
  for (let node of Cubes) {
    rates.push({
      rate: parseFloat(node.getAttribute("rate")).toFixed(rounding),
      currency: node.getAttribute("currency"),
    });
  }
  rates.push({
    rate: "1",
    currency: "EUR",
  });
  rates = rates.sort((a, b) => a.currency.localeCompare(b.currency));
  return rates;
}

// Отображение опции для элемента select
function renderSelect(rates) {
  const reversedRates = [...rates].reverse();
  let selectEl = document.getElementById("select-currency");
  for (rate of reversedRates) {
    selectEl.add(new Option(rate.currency, rate.rate));
  }
  selectEl.value = 1;
}

// Отображение таблицы
function renderTable(rates) {
  let tableHTML = "";
  for (rate of rates) {
    tableHTML += `<tr><td>${rate.currency}</td><td>${rate.rate}</td></tr>`;
  }
  document.getElementById("currency-table-body").innerHTML = tableHTML;
}

// Возвращение массива с курсами относительно выбранной валюты
function rateToCurrency(ratesToEUR, value) {
  // в параметрах передаем отношение валюты к евро, а не название
  const newRates = ratesToEUR.map((rate) => {
    return {
      currency: rate.currency,
      rate: (rate.rate / value).toFixed(rounding),
    };
  });
  return newRates;
}
