export function copyToClipboard(
  elementSelector: string, 
  buttonElement: HTMLElement, 
  isPre: boolean = false
): void {
  const element = document.querySelector(elementSelector);
  if (!element) return;
  
  const textToCopy = isPre 
    ? (element as HTMLPreElement).innerText 
    : element.textContent || '';
    
  navigator.clipboard.writeText(textToCopy).then(() => {
    const originalButtonText = buttonElement.innerHTML;
    const iconSpan = buttonElement.querySelector('.material-icons-outlined');
    const textSpan = buttonElement.querySelector('span:not(.material-icons-outlined)');
    
    if (textSpan) {
      textSpan.textContent = 'Copied!';
    } else {
      buttonElement.innerHTML = '<span class="material-icons-outlined mr-1 text-base">done</span> Copied!';
    }
    
    if (iconSpan && textSpan) {
      iconSpan.textContent = 'done';
    }
    
    setTimeout(() => {
      buttonElement.innerHTML = originalButtonText;
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
    // Basic fallback for older browsers
    try {
      const range = document.createRange();
      if (element) range.selectNode(element);
      window.getSelection()?.removeAllRanges();
      window.getSelection()?.addRange(range);
      document.execCommand('copy');
      window.getSelection()?.removeAllRanges();
      
      const originalButtonText = buttonElement.innerHTML;
      const iconSpan = buttonElement.querySelector('.material-icons-outlined');
      const textSpan = buttonElement.querySelector('span:not(.material-icons-outlined)');
      
      if (textSpan) {
        textSpan.textContent = 'Copied!';
      } else {
        buttonElement.innerHTML = '<span class="material-icons-outlined mr-1 text-base">done</span> Copied!';
      }
      
      if (iconSpan && textSpan) {
        iconSpan.textContent = 'done';
      }
      
      setTimeout(() => {
        buttonElement.innerHTML = originalButtonText;
      }, 2000);
    } catch(copyErr) {
      console.error('Failed to copy: ', copyErr);
      alert('Failed to copy. Please manually copy the text.');
    }
  });
} 