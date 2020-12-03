window.addEventListener("load", () => {
  let long;
  let lat;
  let key;
  let temperatureDescription = document.querySelector(
    ".temperature-description"
  );
  let temperatureDegree = document.querySelector(".temperature-degree");
  let locationTimezone = document.querySelector(".location-timezone");
  let humidityPercent = document.querySelector(".humidity");
  let degreeSection = document.querySelector(".degree-section");
  let degreeSpan = document.querySelector(".degree-section span");
  let body = document.querySelector("body");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      long = position.coords.longitude;
      lat = position.coords.latitude;
      key = "41deeee196d37b47a843f9161f2dec06";

      //   const proxy = "https://cors-anywhere.herokuapp.com/";
      //   const api = `${proxy}https://api.openweathermap.org/data/2.5/weather?units=celsius&lat=${lat}&lon=${long}&appid=${key}`;
      const api = `https://api.openweathermap.org/data/2.5/weather?units=celsius&lat=${lat}&lon=${long}&appid=${key}`;

      fetch(api)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);
          const { description, icon } = data.weather[0];
          const { humidity, temp } = data.main;

          // Kelvin から Celsius への計算
          let celsius = (temp - 273.15).toFixed(1);
          // Fahrenheit の計算
          let fahrenheit = (celsius * 1.8 + 32).toFixed(1);

          temperatureDegree.textContent = celsius;
          temperatureDescription.textContent = description;
          locationTimezone.textContent = data.name;
          humidityPercent.textContent = humidity;

          setIcons(description, document.querySelector(".icon"));

          // Celsius から Fahrenheit
          degreeSection.addEventListener("click", () => {
            if (degreeSpan.textContent === "℉") {
              degreeSpan.textContent = "℃";
              temperatureDegree.textContent = celsius;
            } else {
              degreeSpan.textContent = "℉";
              temperatureDegree.textContent = fahrenheit;
            }
          });
        });
    });
  }

  function setIcons(description, iconID) {
    const iconName = [
      "CLEAR_DAY",
      "PARTLY_CLOUDY_DAY",
      "CLOUDY",
      "RAIN",
      "SLEET",
      "SNOW",
      "FOG",
    ];
    const skycons = new Skycons({ color: "white" });
    let currentIcon;

    switch (description) {
      case "clear sky":
        currentIcon = iconName[0];
        body.style.background =
          "linear-gradient(rgb(248, 172, 169), rgb(230, 199, 173))";
        break;
      case "few clouds":
        currentIcon = iconName[1];
        body.style.background =
          "linear-gradient(rgb(248, 172, 169), rgb(230, 199, 173))";
        break;
      case "scattered clouds":
        currentIcon = iconName[2];
        body.style.background =
          "linear-gradient(rgb(178, 248, 169), rgb(173, 230, 218))";
        break;
      case "broken clouds":
        currentIcon = iconName[2];
        body.style.background =
          "linear-gradient(rgb(180, 179, 182), rgb(173, 219, 230))";
        break;
      case "shower rain":
        currentIcon = iconName[3];
        body.style.background =
          "linear-gradient(rgb(180, 179, 182), rgb(173, 219, 230))";
        break;
      case "rain":
        currentIcon = iconName[4];
        body.style.background =
          "linear-gradient(rgb(170, 169, 248), rgb(173, 221, 230))";
        break;
      case "thunderstorm":
        currentIcon = iconName[4];
        body.style.background =
          "linear-gradient(rgb(100, 78, 145), rgb(244, 247, 238))";
        break;
      case "snow":
        currentIcon = iconName[5];
        body.style.background =
          "linear-gradient(rgb(243, 242, 245), rgb(168, 168, 167))";
        break;
      case "mist":
        body.style.background =
          "linear-gradient(rgb(165, 165, 165), rgb(202, 233, 217))";
        currentIcon = iconName[6];
        break;
    }

    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
  }
});
