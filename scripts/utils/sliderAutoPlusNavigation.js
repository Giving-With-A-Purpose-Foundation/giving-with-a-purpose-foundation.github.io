// --- This function is used for creating a functional Image Slider that automatically plays slides, allows for manual navigation, shows pagination indicators, and supports Play, Pause, Keyboard navigation (Right/Left Arrows) as well as Touch Swipes
export function sliderAutoPlusNavigation(
  // --- COMPULSORY PARAMETERS
  sliderSelector, // --- ID for Slider div
  images, // --- Array of images for slider
  navPrevSelector,  // --- ID for Previous Slide button
  sliderPlaySelector, // --- ID for Play button
  sliderPauseSelector, // --- ID for Pause button
  navNextSelector, // --- ID for Next Slide button
  paginationSelector, // --- ID for Pagination Images div

  {
    // --- CUSTOMIZABLE PARAMETERS
    imagesRootPath = "images/", // --- Path to folder where slider images are located 
    transitionDuration = "0.7s", // --- Number of seconds for the slide to transition to the next
    paginationImgClassName = "pagination-image", // --- Class name for the pagination images
    activePaginationImgStyles = "10px solid olive", // --- Styles for the active pagination image
    slideDuration = "5s" // --- Number of seconds a slide must be displayed before moving onto the next slide
  } = {}
) {

  // --- Global Variables
  const imagesPagination = images.slice(); // --- Duplicating the original array of images to be used for the pagination images
  images.push(images[0]) // --- Pushes the first image to the end of the sliderImages array so the next slide transition looks smooth
  images.unshift(images[images.length - 2]) // --- Pushes the last image to the beginning of the sliderImages array so the prev slide transition looks smooth
  const slider = document.getElementById(sliderSelector); // --- Slider div
  const next = document.getElementById(navNextSelector); // --- Next Slide button
  const prev = document.getElementById(navPrevSelector); // --- Previous Slide button
  const imgPercentage = parseFloat((100 / images.length).toFixed(4)); // --- The width each image takes of the slider div
  const lastImg = parseFloat((imgPercentage * (images.length - 1)).toFixed(4)); // --- Last image of slider
  const slideTransitionDuration = transitionDuration.split("s")[0]; // --- Number of seconds for transition between slides
  const slideTransitionValue = `all ${transitionDuration}`; // --- Transition for switching slides
  const sliderPlay = document.getElementById(sliderPlaySelector); // --- Play button
  const sliderPause = document.getElementById(sliderPauseSelector); // --- Pause button
  const pagination = document.getElementById(paginationSelector); // --- Pagination div
  const slideDurationMilliseconds = (slideDuration.split("s")[0]) * 1000; // --- Number of milliseconds a slide must be displayed before moving onto the next slide



  let leftOffset = imgPercentage; // --- The amount the slider needs to be translated to the left
  let slideNum = 0; // --- This value is used for pagination and corresponds to the current image from the images array that is displayed on the screen
  let play = true; // --- Determines if slider is set to Play or Pause
  let slideTimer; // --- Timer for automatically moving to next slide
  let resetNextTimer; // --- Timer that will be used to reset the next image after this timer has ended
  let resetPrevTimer; // --- Timer that will be used to reset the previous image after this timer has ended




  // --- Inserting the images into the slider
  images.forEach(image => {
    slider.innerHTML += `
      <img src="${imagesRootPath + image}" width="200" alt="Image${image}"/>
    `;
  }) 



  slider.style.width = `${images.length}00%`; // --- Sets the width of the slider so that each image is assigned 100% of the original slider width
  slider.style.display = "flex"; // --- Spreads the images to fill the flex container
  slider.style.transform = `translateX(-${leftOffset}%)`; // --- Sets the starting position of the slider



  // --- Inserting the pagination images into the pagination div
  imagesPagination.forEach(image => {
    pagination.innerHTML += `
      <img class="${paginationImgClassName}" src="${imagesRootPath + image}" height="100" />
    `;
  })


  const paginationImages = document.querySelectorAll(`.${paginationImgClassName}`); // --- Pagination images


  // --- Resetting the pagination image to correspond with the slides
  function resetPaginationImg() {

    paginationImages.forEach(img => {
      img.style.border = "";
      img.style.borderRadius = "";
      img.style.transition = slideTransitionValue;
      img.style.cursor = "pointer";
    })
    const pagImg = paginationImages[slideNum];
    
    pagImg.style.border = activePaginationImgStyles;
    pagImg.style.borderRadius = "25%"
  }

  // --- Initial Reset on page load
  resetPaginationImg()


  // --- Function for restarting the timer for automatically changing slides
  function restartTimer() {
    clearTimeout(slideTimer);  
    slideTimer = setTimeout(() => {
      nextSlide();
    }, slideDurationMilliseconds)
  }


  // --- Play/Pause Functionality
  sliderPlay.style.display = "none"; // --- Hides the play button while slider is already playing


  // --- Runs this function when Pause button is clicked
  sliderPause.addEventListener("click", () => {
    play = false; 
    sliderPause.style.display = "none"; // --- Hides Pause button
    sliderPlay.style.display = "inline-block"; // --- Shows Play button

    clearTimeout(slideTimer); // --- Stops slider from automatically playing and moving to next slide
  })

  // --- Runs this function when Play button is clicked
  sliderPlay.addEventListener("click", () => {
    play = true;
    sliderPlay.style.display = "none"; // --- Hides Play button
    sliderPause.style.display = "inline-block"; // --- Shows Pause button

    restartTimer(); // --- Restarts the timer for automatically changing slides
  })


  // --- Function for moving to next slide
  function nextSlide() {
    clearTimeout(resetPrevTimer); // --- Prevents the timer from still completing and executing styles as this is no longer needed at this stage and will only mess things up
    slider.style.transition = slideTransitionValue; // --- Sets the transition for moving to next slide

    // --- Runs the following if the current slide IS NOT the LAST slide when this function is called
    if (leftOffset !== lastImg) {
      leftOffset = parseFloat((leftOffset + imgPercentage).toFixed(4));
      slider.style.transform = `translateX(-${leftOffset}%)`;

      // --- Pagination indicator control
      if (slideNum === imagesPagination.length - 1) {
        slideNum = 0;
      } else {
        slideNum++;
      }

      // --- Runs the following if the current slide IS the LAST slide while function is already running
      if (leftOffset === lastImg) {
        // --- Resets next image
        resetNextTimer = setTimeout(() => {
          leftOffset = imgPercentage;
          slider.style.transition = "0s";
          slider.style.transform = `translateX(-${leftOffset}%)`;
        }, slideTransitionDuration * 1000)
      }
    } 
    // --- Runs the following if the current slide IS the LAST slide when this function is called
    else {
      clearTimeout(resetNextTimer);
      slider.style.transition = "0s";
      leftOffset = imgPercentage;
      slider.style.transform = `translateX(-${leftOffset}%)`;
      slideNum = 0;
    }

    resetPaginationImg(); // --- Resets the pagination image to correspond with the slides

    if (play) restartTimer(); // --- Only restarts the timer if the slider is set to Play    
  }


  // --- Function for moving to previous slide

  function prevSlide() {
    clearTimeout(resetNextTimer); // --- Prevents the timer from still completing and executing styles as this is no longer needed at this stage and will only mess things up
    slider.style.transition = slideTransitionValue; // --- Sets the transition for moving to previous slide

    // --- Runs the following if the current slide IS NOT the FIRST slide when this function is called
    if (leftOffset !== 0) {
      leftOffset = parseFloat((leftOffset - imgPercentage).toFixed(4));
      slider.style.transform = `translateX(-${leftOffset}%)`;

      // --- Pagination indicator control
      if (slideNum === 0) {
        slideNum = imagesPagination.length - 1;
      } else {
        slideNum--;
      }


      // --- Runs the following if the current slide IS the FIRST slide while function is already running
      if (leftOffset === 0) {
        // --- Resets previous image
        resetPrevTimer = setTimeout(() => {
          leftOffset = parseFloat((lastImg - imgPercentage).toFixed(4));
          slider.style.transition = "0s";
          slider.style.transform = `translateX(-${leftOffset}%)`;
        }, slideTransitionDuration * 1000)
      }
    } 
    // --- Runs the following if the current slide IS the FIRST slide when this function is called
    else {
      clearTimeout(resetPrevTimer);
      slider.style.transition = "0s";
      leftOffset = parseFloat((lastImg - imgPercentage).toFixed(4));
      slider.style.transform = `translateX(-${leftOffset}%)`;
      slideNum = imagesPagination.length - 1;
    }

    resetPaginationImg(); // --- Resets the pagination image to correspond with the slides

    if (play) restartTimer(); // --- Only restarts the timer if the slider is set to Play
  }

  restartTimer(); // --- Starts timer on page load

  next.addEventListener("click", nextSlide) // --- Moves to the next slide when the nextSlide button is clicked
  prev.addEventListener("click", prevSlide) // --- Moves to previous slide when the prevSlide button is clicked



  // --- Arrow support for navigating slides

  let sliderIsVisible = false; // --- slider visibility variable


  // --- Checking if slider is visible on screen
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      sliderIsVisible = entry.isIntersecting;
    })
  })

  observer.observe(slider); // --- Observing the slider


  // --- Allow for key presses
  window.addEventListener("keydown", (event) => {
    if (!sliderIsVisible) return; // --- If slider is not visible on screen

    if (event.key === "ArrowRight") nextSlide(); // --- Move to next slide when Right Arrow is pressed
    else if (event.key === "ArrowLeft") prevSlide(); // --- Move to previous slide if Left Arrow is pressed
  })



  // --- Touch Swipe support 
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  const SWIPE_THRESHOLD = 50; // --- Minimum swipe threshold to prevent accidental touches
  const VERTICAL_TOLERANCE = 80; // --- Maximum vertical tolerance to allow for vertical scrolling



  slider.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });


  slider.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;

    const diffX = touchEndX - touchStartX;
    const diffY = touchEndY - touchStartY;

    if (Math.abs(diffY) > VERTICAL_TOLERANCE) return;
    if (Math.abs(diffX) < SWIPE_THRESHOLD) return;

    if (diffX > 0) prevSlide();
    else nextSlide();
  }, { passive: true });






  // --- Enabling pagination images to be clickable
  const pagImgsArr = []; 

  paginationImages.forEach(image => {
    pagImgsArr.push(image);
    image.addEventListener("click", () => {
      clearTimeout(resetNextTimer);
      clearTimeout(resetPrevTimer);
      const pagImgIndex = pagImgsArr.indexOf(image);
      leftOffset = parseFloat((imgPercentage * (pagImgIndex + 1)).toFixed(4));
      slider.style.transition = slideTransitionValue;
      slider.style.transform = `translateX(-${leftOffset}%)`;
      slideNum = pagImgIndex;
      resetPaginationImg();

      if (play) restartTimer();
      
    })
  })
}
