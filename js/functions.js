// Functions
function playSound(event) {
  const audio = document.querySelector(`audio[data-key="${event.keyCode}"]`);
  const key = document.querySelector(`.key[data-key="${event.keyCode}"]`);


  // Audio code
  if (!audio) return; // if keyCode doesn't match dont run - cancels out 'null' values
  audio.currentTime = 0; // resets time to 0
  audio.play(); // play the animation

  // Animation of CSS
  key.classList.add("playing"); // Adding a class
};

function removeTransition(event) {
  if (event.propertyName !== 'transform') return; // if event.propertyName doesn't equal 'transform', ignore
  this.classList.remove("playing"); // Remove the class
}

const keys = document.querySelectorAll(".key"); //find all elements with '.keys' class

// loop through each 'key' transitionend and execute 'removeTransition' function
keys.forEach(key => key.addEventListener('transitionend', removeTransition)); 

window.addEventListener("keydown", playSound);
