export async function animateTextTyping(
    textToType: string,
    targetElement: HTMLElement,
    maxDurationSeconds: number
  ) {
    const typingDelay = 10;
    const maxDurationMs = maxDurationSeconds * 1000;
    let elapsedTime = 0;
    
    targetElement.textContent = "";
    let displayedText = targetElement.textContent || "";
  
    for (const character of textToType) {
      elapsedTime += typingDelay;
      
      if (elapsedTime >= maxDurationMs) {
        return displayedText;
      }
  
      await new Promise((resolve) => setTimeout(resolve, typingDelay));
      displayedText += character;
      targetElement.textContent = displayedText;
    }
  
    return displayedText;
  }