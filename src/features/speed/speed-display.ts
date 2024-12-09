export const displaySpeed = (speed: number) => {
    const displaySpeed = document.querySelector(".displaySpeed");
    if (!displaySpeed) return;
    console.log(displaySpeed);
    displaySpeed.textContent = speed + "ms";
  };
  