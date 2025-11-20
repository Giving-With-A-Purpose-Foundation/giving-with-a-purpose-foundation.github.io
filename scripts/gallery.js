import { sliderAutoPlusNavigation } from "./utils/sliderAutoPlusNavigation.js";

const communityFeedingImages = [
  "feeding-1.jpg",
  "feeding-2.jpg",
  "feeding-3.jpg",
  "feeding-4.jpg",
  "feeding-5.jpg",
  "feeding-6.jpg",
  "feeding-7.jpg",
  "feeding-8.jpg",
  "feeding-9.jpg",
  "feeding-10.jpg",
  "feeding-11.jpg",
  "feeding-12.jpg",
  "feeding-13.jpg",
  "feeding-14.jpg",
  "feeding-15.jpg",
  "feeding-16.jpg",
  "feeding-17.jpg",
  "feeding-18.jpg",
  "feeding-19.jpg",
  "feeding-20.jpg",
  "feeding-21.jpg",
  "feeding-22.jpg",
  "feeding-23.jpg",
  "feeding-24.jpg",
  "feeding-25.jpg",
  "feeding-26.jpg",
  "feeding-27.jpg",
  "feeding-28.jpg",
  "feeding-29.jpg",
  "feeding-30.jpg",
  "feeding-31.jpg",
  "feeding-32.jpg",
  "feeding-33.jpg",
  "feeding-34.jpg",
];


sliderAutoPlusNavigation(
  "community-feeding__slider", 
  communityFeedingImages, 
  "navPrev", 
  "play", 
  "pause", 
  "navNext", 
  "community-feeding__slider--pagination", 
  {
    imagesRootPath: "images/feeding/",
    activePaginationImgStyles: "5px solid gold"
  });


function openVid(num) {
  document.getElementById(`vid${num}`).addEventListener("click", () => {
    window.location.href = `videos/vid-${num}.mp4`;
  })
}

openVid(1);
openVid(2);
openVid(3);
openVid(4);
openVid(5);
openVid(6);
openVid(7);
openVid(8);
openVid(9);



function setVideoContainerHeight() {
  const vidHeight = document.querySelector("video").getBoundingClientRect().height

  document.querySelectorAll(".video-container").forEach(video => {
    video.style.height = `${vidHeight}px`;
  })
}


window.onload = setVideoContainerHeight;
window.onresize = setVideoContainerHeight;