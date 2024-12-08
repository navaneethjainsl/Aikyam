function textToSpeech() {
    const text = document.getElementById('text').value;

    // Check if the browser supports SpeechSynthesis
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text); // Create a SpeechSynthesisUtterance object
        window.speechSynthesis.speak(utterance); // Speak the text
    } else {
        alert('Sorry, your browser does not support text-to-speech!');
    }
}