
const submitBtn = document.getElementById("submitBtn");
const cityName = document.getElementById("cityName");
const city_name = document.getElementById("city_name");
const temp_real_val = document.getElementById("temp_real_val");
const temp_status = document.getElementById("temp_status");
const data_hide= document.querySelector('.data_hide')
const getData = async (event) => {
  event.preventDefault();
  let cityVal = cityName.value;
  if (cityVal === "") {
    city_name.innerHTML = "Please enter the city name first";
    data_hide.classList.add("data_hide");
  } else {
    try {
      const api = `https://api.openweathermap.org/data/2.5/weather?q=${cityVal}&appid=235c5e8070d3eb15579f34d4e9e49a2c&units=metric`;
      const response = await fetch(api);
      const objData = await response.json();
      const arrData = await [objData];
      city_name.innerHTML = `${arrData[0].name} ${arrData[0].sys.country}`;
      temp_real_val.innerHTML = arrData[0].main.temp;
      let status = arrData[0].weather[0].main;
      if (status === "Haze") {
        temp_status.innerHTML =
          "<i class='fas  fa-smog' style='color:#a4b0be;'></i>";
      } else if (status === "Clear") {
        temp_status.innerHTML =
          "<i class='fas  fa-sun' style='color: #eccc68;'></i>";
      } else if (status === "Clouds") {
        temp_status.innerHTML =
          "<i class='fas  fa-cloud' style='color: #f1f2f6;'></i>";
      } else if (status === "Rain") {
        temp_status.innerHTML =
          "<i class='fas  fa-cloud-rain' style='color: #a4b0be;'></i>";
      } else {
        temp_status.innerHTML =
          "<i class='fas  fa-sun' style='color: #eccc68;'></i>";
      }
      data_hide.classList.remove("data_hide");
    } catch (error) {
      city_name.innerHTML = "Not found! Enter correct city name";
      console.log(error);
      data_hide.classList.add("data_hide");
    }
  }
};

submitBtn.addEventListener("click", getData);
