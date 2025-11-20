const feedingImg = document.getElementById("feedingImg");
const clothingImg = document.getElementById("clothingImg");
const vehicleImg = document.getElementById("vehicleImg");
const feeding = document.getElementById("feeding");
const clothing = document.getElementById("clothing");
const vehicle = document.getElementById("vehicle");

feeding.style.display = "none";
clothing.style.display = "none";
vehicle.style.display = "none";


const categoryInfoDisplay = "flex";
const imgBorder = "5px solid crimson";

feedingImg.addEventListener("click", () => {
  clothing.style.display = "none";
  clothingImg.style.border = "none";
  vehicle.style.display = "none";
  vehicleImg.style.border = "none";

  if (feeding.style.display === "none") {
    feeding.style.display = categoryInfoDisplay;
    feedingImg.style.border = imgBorder;
  } else {
    feeding.style.display = "none";
    feedingImg.style.border = "none";
  }
})

clothingImg.addEventListener("click", () => {
  feeding.style.display = "none";
  feedingImg.style.border = "none";
  vehicle.style.display = "none";
  vehicleImg.style.border = "none";

  if (clothing.style.display === "none") {
    clothing.style.display = categoryInfoDisplay;
    clothingImg.style.border = imgBorder;
  } else {
    clothing.style.display = "none";
    clothingImg.style.border = "none";
  }
})

vehicleImg.addEventListener("click", () => {
  feeding.style.display = "none";
  feedingImg.style.border = "none";
  clothing.style.display = "none";
  clothingImg.style.border = "none";

  if (vehicle.style.display === "none") {
    vehicle.style.display = categoryInfoDisplay;
    vehicleImg.style.border = imgBorder;
  } else {
    vehicle.style.display = "none";
    vehicleImg.style.border = "none";
  }
})