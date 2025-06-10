import MicroModal from "micromodal";
import dayjs from "dayjs";
import "./styles/main.css"; // caminho do seu CSS

const date = new Date();

const timeElement = document.querySelector(".time-container");
const timezoneElement = document.querySelector(".timezone-container");
const dateElement = document.querySelector(".date-container");
const myForm = document.querySelector("#form");
const timezoneSelect = document.getElementById("timezone");

let offset = JSON.parse(localStorage.getItem("offset")) || 0;
let timezone = JSON.parse(localStorage.getItem("timezone")) || "";

function getUtcTime() {
  const offsetMilli = offset * 60 * 60 * 1000;
  const deslocamento = date.getTimezoneOffset() * 60 * 1000;
  const dataUTC = dayjs().add(deslocamento);
  const dataAtualizada = dataUTC.add(offsetMilli, "milliseconds");

  return dataAtualizada;
}

function getHora() {
  const dataAtualizada = getUtcTime();
  return dataAtualizada.format("HH:mm:ss");
}

function getData() {
  const dataAtualizada = getUtcTime();
  return dataAtualizada.format("dddd, DD MMMM, YYYY");
}

function getTimezone() {
  const [tz] = timeZones
    .map((cat) => {
      const [encontrado] = cat.filter(
        (t) => t["name"] == myForm.elements[0].value
      );
      return encontrado;
    })
    .filter((e) => e !== undefined);
  offset = tz["offset"];
  timezone = `${tz["displayName"]} (UTC${
    tz["offset"] > 0 ? `+${tz["offset"]}` : tz["offset"]
  })`;
  localStorage.setItem("offset", JSON.stringify(offset));
  localStorage.setItem("timezone", JSON.stringify(timezone));

  MicroModal.close("modal-1");
  return;
}

function getLocaleTimezone() {
  timezone = "(UTC)";
  return timezone;
}

document.addEventListener("DOMContentLoaded", () => {
  MicroModal.init();
  fillTimezoneSelect();
  myForm.addEventListener("submit", (e) => {
    e.preventDefault();
    getTimezone();
  });
});

const timePasser = setInterval(() => {
  render();
}, 500);

const timeZones = [
  [
    { name: "brasil", displayName: "Brasil" },
    { name: "brasilia", offset: -3, displayName: "Brasília" },
    { name: "amazonas", offset: -4, displayName: "Amazonas" },
  ],
  [
    {
      name: "europa",
      displayName: "Europa",
    },
    { name: "berlim", offset: +2, displayName: "Berlim" },
  ],
  [
    { name: "asia", displayName: "Ásia" },
    { name: "hongkong", offset: +8, displayName: "Hong Kong" },
    { name: "tokyo", offset: +9, displayName: "Tokyo" },
  ],
];

function fillTimezoneSelect() {
  const timeZonesHtml = timeZones
    .map((cat) => {
      let result = `
        <optgroup label="${cat[0]["displayName"]}">
          ${cat.shift()}
          ${cat
            .map(
              (tz) => `<option value="${tz.name}">${tz.displayName}</option>`
            )
            .join("")}
        </optgroup>`;

      return result;
    })
    .join("");
  timezoneSelect.innerHTML += timeZonesHtml;
}

function render() {
  timeElement.innerHTML = getHora();
  dateElement.innerHTML = getData();
  timezoneElement.innerHTML = timezone || getLocaleTimezone();
}
