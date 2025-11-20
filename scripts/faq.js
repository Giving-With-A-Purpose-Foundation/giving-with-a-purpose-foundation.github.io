document.querySelectorAll(".question + i").forEach(arrDown => {
  arrDown.addEventListener("click", () => {
    const answer = arrDown.parentElement.nextElementSibling;
    const arrUp = arrDown.nextElementSibling;

    answer.style.display = "block";
    arrDown.style.display = "none";
    arrUp.style.display = "inline-block";
  })
})

document.querySelectorAll(".question + i + i").forEach(arrUp => {
  arrUp.style.display = "none";

  arrUp.addEventListener("click", () => {
    const answer = arrUp.parentElement.nextElementSibling;
    const arrDown = arrUp.previousElementSibling;

    answer.style.display = "none";
    arrUp.style.display = "none";
    arrDown.style.display = "inline-block";
  })
})
















// document.querySelectorAll(".question + i").forEach(arrDown => {
//   arrDown.addEventListener("click", () => {
//     const answer = arrDown.parentElement.nextElementSibling;
//     answer.style.display = "block";
//     arrDown.style.display = "none"
//   })
// })