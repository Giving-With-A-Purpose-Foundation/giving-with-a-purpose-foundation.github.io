// --- "ABOUT US" PAGE

import { visibilityObserverWithSlidingEffects } from "./utils/visibilityObserver.js";

visibilityObserverWithSlidingEffects(".about__founders");


// --- Function for setting Heights and Positions
function setAboutHeightsAndPositions() {
    // --- Sections
    const sectionConnect = document.getElementById("about__connect");
    const sectionFounders = document.getElementById("about__founders");
    const sectionTransparent = document.getElementById("about__transparent-section");

    // --- Determining Height
    const heightConnect = sectionConnect.getBoundingClientRect().height;

    // --- Setting height for transparent section so that the about__connect section can be seen through this transparent section
    sectionTransparent.style.height = `${heightConnect + 100}px`;

    // --- Moving the about__founders section to the start of it's parent container to hide the sticky about__connect section which sticks to the top of the container immediately
    sectionFounders.style.marginTop = `-${heightConnect}px`;
}

setAboutHeightsAndPositions();

// --- Calls the function when the page is loaded
window.onload = setAboutHeightsAndPositions;

// --- Resets the Heights and Positions of the necessary sections every time the window is resized
window.onresize = setAboutHeightsAndPositions;
