// Functions
function handleUpdate() {
  const suffix = this.dataset.sizing || '';
  
  document.documentElement.style.setProperty(`--${this.name}`, this.value + suffix);

  console.log(`--${this.name}`);
};

const inputs = document.querySelectorAll("input");

inputs.forEach(input => input.addEventListener("change", handleUpdate));