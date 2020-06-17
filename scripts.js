let xmlDoc;

window.onload = async function () {
  const response = await fetch(fetchURL);
  const xmlString = await response.text();
  const parser = new DOMParser();
  xmlDoc = parser.parseFromString(xmlString, "text/xml");
  //   console.log(xmlDoc.querySelector("Cube[time]"));
  renderTable(xmlDoc);
};

function renderTable(xmlDoc) {
  const Cubes = xmlDoc.querySelector("Cube[time]").children;
  let tableHTML = "";
  for (node of Cubes) {
    const rate = node.getAttribute("rate");
    const currency = node.getAttribute("currency");
    tableHTML += `<tr><td>${currency}</td><td>${rate}</td></tr>`;
  }
  document.getElementById("currency-table-body").innerHTML = tableHTML;
}

const corsHackURL = "https://cors-anywhere.herokuapp.com/";
const API_URL = "https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml";
const fetchURL = corsHackURL + API_URL;
