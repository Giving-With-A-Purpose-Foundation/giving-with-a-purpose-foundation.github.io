// --- This function is used for observing the visibility of element/s and adding sliding effects to them when they are observed.
export function visibilityObserverWithSlidingEffects(
  selector, // --- Element/s to be observed
  {
    // --- COMPULSORY PARAMETERS
    classNameActive = "active",  // --- The name of the class to be applied when the element is visible
    root = null,  // --- The box which acts as the observer container
    rootMargin = "0px 0px -25% 0px",  // --- The margin that's applied to the root
    threshold = 0,  // --- The threshold or how much of the top of the element needs to be visible before triggering

    // --- OPTIONAL PARAMETERS
    slide = true,  // --- Indicates whether a sliding effect will be implemented
    onVisible = () => {}, // --- Function to use when element is visible to implement unique styles and functions other than the default sliding effects
    notVisible = () => {},  // --- Function to use when element is not visible to implement unique styles and functions other than the default sliding effects and/or to remove onVisible styles
    once = false,  // --- Indicates whether the observation should happen once or every time
    slideDirection = "alternateHorizontal", // --- Direction of sliding effect ("fromLeft", "fromRight", "alternateHorizontal" - (fromLeft then fromRight), "alternateHorizontalReverse" - (fromRight then fromLeft), "fromTop", "fromBottom", "alternateVertical" - (fromTop then fromBottom), "alternateVerticalReverse" - (fromBottom then fromTop))
    scrollDirection = "down", // --- Indicates if the observation should be triggered when scrolling ("down", "up", or "both")
    
    // --- Slide options
    slideType = "transition",  // --- Type of Slide ("animation" or "transition" - (Animations have an overshoot while transitions do not.))
    slideDuration = "0.7s",  // --- Duration of the transition/animation
    slideEasing = "ease-out", // --- Timing function controlling speed curve (e.g. "ease", "ease-in", "ease-in-out", "ease-out", "linear", "cubic-bezier()", etc.)
    slideDelay = "0s", // --- Delay before the slide starts

    offsetLeft = "-100%",  // --- The left initial value of the element's offset position
    offsetRight = "100%", // --- The right initial value of the element's offset position
    offsetTop = "-100%",  // --- The top initial value of the element's offset position
    offsetBottom = "100%",  // --- The bottom initial value of the element's offset position
    
    // --- Transition options
    transitionProperty = "all", // --- CSS property to transition (e.g. "transform", "opacity", "all")

    // --- Animation options
    overshootAmount = "10%",  // --- Indicates the overshoot value for the animation past its final resting point
    overshootEnterKeyframePercent = "80%", // --- The percentage keyframe at which the overshoot position occurs during the entering animation
    slideIterationCount = "1", // --- Number of animation repeats
    slideDirectionMode = "reverse", // --- Animation playback direction (e.g. "normal", "reverse", "alternate", "alternate-reverse"),
    slideFillMode = "forwards", // --- Style applied before/after animation
  } = {}
) {

  // --- Determining the scroll direction
  let lastScrollY = window.scrollY;

  function handleScrollDirection() {
    const currentScrollY = window.scrollY;

    let direction;
    if (currentScrollY > lastScrollY) {
      direction = "down";
    } else if ( currentScrollY < lastScrollY) {
      direction = "up";
    } else {
      direction = "fixed";
    }
    lastScrollY = currentScrollY;

    return direction;
  }

  // --- Defining Animation Styles
  if (!document.getElementById("slide-styles")) {
    const style = document.createElement("style");
    style.id = "slide-styles";

    style.textContent = `
      @keyframes slideInFromLeft {
        0% { transform: translateX(${offsetLeft}); 
              opacity: 0; }
        ${overshootEnterKeyframePercent} { transform: translateX(${overshootAmount}); 
                                      opacity: 1; }
        100% { transform: translateX(0); 
                opacity: 1;}
      }

      @keyframes slideInFromRight {
        0% { transform: translateX(${offsetRight}); 
              opacity: 0; }
        ${overshootEnterKeyframePercent} { transform: translateX(-${overshootAmount}); 
                                            opacity: 1; }
        100% { transform: translateX(0); 
                opacity: 1}
      }
      
      @keyframes slideInFromTop {
        0% { transform: translateY(${offsetTop}); 
              opacity: 0; }
        ${overshootEnterKeyframePercent} { transform: translateY(${overshootAmount});
                                      opacity: 1; }
        100% { transform: translateY(0); 
                opacity: 1}
      }

      @keyframes slideInFromBottom {
        0% { transform: translateY(${offsetBottom}); 
              opacity: 0; }
        ${overshootEnterKeyframePercent} { transform: translateY(-${overshootAmount});
                                      opacity: 1; }
        100% { transform: translateY(0); 
                opacity: 1}
      }
    `;

    document.head.appendChild(style);
  }

  // --- Getting the elements for observation
  const elements = document.querySelectorAll(selector);
  if (!elements.length) return;
  
  const observerOptions = {root, rootMargin, threshold};  // --- Setting observerOptions

  // --- IntersectionObserver
  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach((entry) => {
      // --- GLOBAL VARIABLES
      const el = entry.target;
      const index = Array.from(elements).indexOf(el);
      const elementRect = entry.boundingClientRect;
      const observingArea = entry.rootBounds;

      // --- Additional Class Names
      const classNameOpDir = "oppositeDirection";
      const classNameInterval = "interval";

      const currentDirection = handleScrollDirection();  // --- Determining the currentDirection

      // --- Converting slideDuration to milliseconds
      const slideDurationSeconds = slideDuration.split("s")[0];
      const slideDurationMilliseconds = slideDurationSeconds * 1000;

      // --- Initial Transition Styles
      const initialTransitionStyles = `${transitionProperty} ${slideDuration} ${slideEasing} ${slideDelay}`;
        const assignSlideStartingStyles = (el, styles) => Object.assign(el.style, { 
          ...styles 
        });

      
      if (slide) el.style.opacity = "0";  // --- Hiding initial position of element/s

      // --- Defining function for adding styles to active class
      function injectActiveClassStyles(el, styles) {
        Object.assign(el.style, styles)
      }

      //  --- Function for determining the correct animation
      function determineAnimation() {
        let animation;

        const animations = {
            fromLeft: "slideInFromLeft",
            fromRight: "slideInFromRight",
            fromTop: "slideInFromTop",
            fromBottom: "slideInFromBottom"
          }

        if (slideDirection === "fromLeft" || slideDirection === "fromRight" || slideDirection === "fromTop" || slideDirection === "fromBottom") {
          animation = `${animations[slideDirection]}`;
        } else if (slideDirection === "alternateHorizontal") {
          animation = `${index % 2 === 0 ? "slideInFromLeft" : "slideInFromRight"}`;
        } else if (slideDirection === "alternateHorizontalReverse") {
          animation = `${index % 2 === 0 ? "slideInFromRight" : "slideInFromLeft"}`;
        } else if (slideDirection === "alternateVertical") {
          animation = `${index % 2 === 0 ? "slideInFromTop" : "slideInFromBottom"}`;
        } else if (slideDirection === "alternateVerticalReverse") {
          animation = `${index % 2 === 0 ? "slideInFromBottom" : "slideInFromTop"}`;
        }

        return animation;
      } 

      // --- Variables for determining animation and setting animation styles
      const animation = determineAnimation();
      const animationInStyles = `${animation} ${slideDuration} ${slideEasing} ${slideDelay} ${slideIterationCount} ${slideFillMode}`;
      const animationOutStyles = `${animation} ${slideDuration} ${slideEasing} ${slideDelay} ${slideIterationCount} ${slideDirectionMode} ${slideFillMode}`;

      // --- Clearing Animation
      function clearAnimation() {
        setTimeout(() => {
          el.style.animation = "";
        }, slideDurationMilliseconds)
      }

        // --- Setting Transition Starting Point
      if (slide && slideType === "transition") {
        let transform;

        const offsets = {
          fromLeft: offsetLeft,
          fromRight: offsetRight,
          fromTop: offsetTop,
          fromBottom: offsetBottom
        };

        if (slideDirection === "fromLeft" || slideDirection === "fromRight") {
          transform = `translateX(${offsets[slideDirection]})`;
        } else if (slideDirection === "alternateHorizontal") {
          transform = `translateX(${index % 2 === 0 ? offsetLeft : offsetRight})`;
        } else if (slideDirection === "alternateHorizontalReverse") {
          transform = `translateX(${index % 2 === 0 ? offsetRight : offsetLeft})`;
        } else if (slideDirection === "fromTop" || slideDirection === "fromBottom") {
          transform = `translateY(${offsets[slideDirection]})`;
        } else if (slideDirection === "alternateVertical") {
          transform = `translateY(${index % 2 === 0 ? offsetTop : offsetBottom})`;
        } else if (slideDirection === "alternateVerticalReverse") {
          transform = `translateY(${index % 2 === 0 ? offsetBottom : offsetTop})`;
        }

        if (transform) {
          assignSlideStartingStyles(el, { transform: transform });
        }
      } 


      // --- Runs the following code when the entry is Intersecting
      if (entry.isIntersecting) { 

        // --- Unobserve the observerInstance if intended to observe only once
        if (once) {
          observerInstance.unobserve(el)
        }
  
        // --- If the scrollDirection is equal to the currentDirection or if the sliding effect should take place when scrolling in "both" directions (up and down)
        if (scrollDirection === currentDirection || scrollDirection === "both") {

          if (!slide) onVisible(el);  // --- Function to use if no sliding effect should take place
          
          // --- Setting the styles for the sliding effects if there is going to be a sliding effect
          else {
            // --- Setting Transition
            if (slideType === "transition") {

              el.classList.add(classNameActive);  // --- Adding the active className
              
              // --- Setting the styles for the active className
              document.querySelectorAll(`.${classNameActive}`).forEach(el => {
                injectActiveClassStyles(el, {
                  transform: "translate(0)",
                  opacity: "1",
                  transition: initialTransitionStyles
                })
              })
            } // --- Setting Animation
            else if (slideType === "animation") {

              // --- Sets the entering animation styles by making sure they animate only when they enter and not when the page is refreshed
              if (currentDirection !== "fixed") {
                el.style.animation = animationInStyles;

                clearAnimation();  // --- Removes the animation after it completes to prepare for the next animation that will come next
              }

              el.style.opacity = "1";  // --- Makes the element visible so that it can still be seen even after it has left the observing area
            }
          }
        } // --- If the scrollDirection is not equal to the currentDirection or if the sliding effect should take place only when scrolling in one direction (up or down)
        else {

          // --- The following code runs if a sliding effect is taking place
          if (slide) {

            // --- SEtting Transition
            if (slideType === "transition") {
              el.style.transform = "translate(0)";
              el.style.opacity = "1";

              // --- Checks if the element has been already scrolled through the observing area or if it is scrolling through for the first time
              if (!el.classList.contains(classNameOpDir)) {

                el.classList.add(classNameInterval);  // --- Adds a new class to add transitions that will be used soon when exiting the observing area

                // --- Waits a short while before adding these transition styles to avoid conflicting with previous transition styles
                setTimeout(() => {
                  document.querySelectorAll(`.${classNameInterval}`).forEach(el => {
                    el.style.transition = initialTransitionStyles;
                  })
                }, "100")
              }
              
            } // --- Setting styles if slideType is set to animation
            else if (slideType === "animation") {
              el.style.opacity = "1";  // --- Keeps the element visible
            }
          }
        }
      } 
      // --- Entry is not intersecting
      else {

        // --- Function to use if no sliding effect should take place and when the entry is no longer intersecting
        if (!slide) notVisible(el);

        // --- Checks if a sliding effect is intended to take place and if the elements have not been unobserved
        if (slide && !once) {

          // --- Checks if sliding effect should happen when scrolling in both directions (up and down)
          if (scrollDirection === "both") {

            // --- Setting styles if slideType is set to transition
            if (slideType === "transition") {
              
              el.classList.remove(classNameActive);  // --- Removes the active className
            } // --- Setting styles if slideType is set to animation 
            else if (slideType === "animation") {

              // --- Sets the exiting animation styles by making sure they animate only when they exit and not when the page is refreshed
              if (currentDirection !== "fixed") {
                el.style.animation = animationOutStyles;

                clearAnimation();  // --- Removes the animation after it completes to prepare for the next animation that will come next
              }
            }
          } // --- Checks if slidingDirection is the same as the current scrolling direction
          else if (scrollDirection === currentDirection) {
            
            // --- Setting styles if slideType is set to transition
            if (slideType === "transition") {
              el.classList.add(classNameOpDir);  // --- Adds this new class to specify that it has already been scrolled past the observing area

              el.classList.remove(classNameActive);  // --- Removes the active className
              el.style.transform = "translate(0)";  // --- Moves element to original position
              el.style.opacity = "1";  // --- Makes the element visible
            } // --- Setting styles if slideType is set to animation
            else if (slideType === "animation") {
              el.style.opacity = "1"  // --- Keeps the element visible
            }
          } // --- Checks if slidingDirection is opposite to the current scrolling direction
          else {
            // --- Setting styles if slideType is set to transition
            if (slideType === "transition") {

              // --- Checks if the element is on the correct side of the observing area in order to apply the following unique styles
              if (scrollDirection === "down" && elementRect.bottom < observingArea.top || scrollDirection === "up" && elementRect.top > observingArea.bottom) {
                
                // --- Adds the styles to the elements that don't have classNAmeInterval in its classList
                if (!el.classList.contains(classNameInterval)) {
                  el.style.opacity = "1";
                  el.style.transform = "translate(0)";
                  el.style.transition = "none"
                }
              }
            } // --- Setting styles if slideType nis set to animation 
            else if (slideType === "animation") {

              // --- Sets the exiting animation styles by making sure they animate only when they exit and not when the page is refreshed
              if(currentDirection !== "fixed") {
                el.style.animation = animationOutStyles;

                clearAnimation();  // --- Removes the animation after it completes to prepare for the next animation that will come next
              }

              // --- Checks if the element is on the correct side of the observing area in order to apply the following unique styles
              if (scrollDirection === "down" && elementRect.bottom < observingArea.top || scrollDirection === "up" && elementRect.top > observingArea.bottom) {
                el.style.opacity = "1";  // --- Keeps the element visible
              }
            }
          }
        }
      }
    })
  }, observerOptions);

  elements.forEach(el => observer.observe(el));
}
