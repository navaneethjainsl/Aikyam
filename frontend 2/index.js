if (!('webkitSpeechRecognition' in window)) {
    alert("Sorry, your browser does not support Speech Recognition.");
} else {
    // const recognition = new webkitSpeechRecognition(); // For Chrome
    const listen = new webkitSpeechRecognition();
    // const recognition = new SpeechRecognition(); // For other browsers

    // recognition.lang = 'en-US';
    // recognition.continuous = true;
    // recognition.interimResults = true;

    listen.lang = 'en-US';
    listen.continuous = true;
    listen.interimResults = false;

    let wakeWordDetected = false;
    let silenceTimeout = null; // For detecting silence
    const SILENCE_THRESHOLD = 5000; // 5 seconds of silence

    let query = ''
    let previousTranscript = '';

    // Keydown event listener to listen for specific key combinations
    document.addEventListener('keydown', function(event) {
        // console.log("Hi")
        if (event.ctrlKey && event.altKey) {
            if (event.key === 'F' || event.key === 'f') {
                console.log('Ctrl+Alt+F detected');
                callWakeWordAPI();
            }
            if (event.key === 'J' || event.key === 'j') {
                console.log('Ctrl+Alt+J detected');
                callWakeWordAPI();
            }
        }
    });

    function callWakeWordAPI() {
        // recognition.stop();
        listen.start();
        console.log(query)
        
        listen.onresult = function (event){

            // let currentTranscript = '';

            // // for (let i = event.resultIndex; i < event.results.length; i++) {
            //     currentTranscript += event.results[event.results.length - 1][0].transcript.trim();
            // // }

            // // Avoid repetition by checking if it's the same as the previous transcript
            // if (currentTranscript !== previousTranscript) {
            //     query += currentTranscript + ' ';
            //     console.log("Updated query: ", query);
            //     previousTranscript = currentTranscript; // Update previous transcript
            // }

            // resetSilenceTimeout();
            
            console.log(event.results)
            // for (let i = 0; i < event.results.length; i++) {
                query += event.results[event.results.length - 1][0].transcript;
                console.log(query);
            // }

            resetSilenceTimeout();
        }
    }

    function resetSilenceTimeout() {
        if (silenceTimeout) {
            clearTimeout(silenceTimeout);
        }
        silenceTimeout = setTimeout(() => {
            console.log('Silence detected: No words for 5 seconds');
            // wakeWordDetected = false;
            listen.stop();
            // recognition.start();
            // You can also stop recognition or call any function here
            
        }, SILENCE_THRESHOLD);
    }

    // recognition.onresult = function (event) {
    //     let transcript = '';
    //     for (let i = event.resultIndex; i < event.results.length; i++) {
    //         transcript += event.results[i][0].transcript.trim();
    //         console.log(transcript);
    //     }

    //     resetSilenceTimeout();

    //     if (transcript.toLowerCase().includes('jarvis')) {
    //         if (!wakeWordDetected) {
    //             wakeWordDetected = true;
    //             console.log(`Wake word ${transcript} detected. Listening...`);

    //             callWakeWordAPI(transcript)
    //         }
    //     }
        
    // };
    
    // recognition.onerror = function (event) {
    //     console.error('Speech recognition error:', event.error);
    //     console.log('Starting Again...');
    //     wakeWordDetected = false;
    //     // recognition.start();
    // };
    
    // recognition.onend = function () {
    //     console.log('Woke up...');
    //     // wakeWordDetected = false;
    //     // recognition.start();
    // };

    listen.onend = function () {
        console.log('Stopped Listening');
        // wakeWordDetected = false;
        console.log("Final Query (Frontend):")
        console.log(query)

        fetch('http://localhost:5000/api/user/voice/assistant', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ query: query }),
        }).then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));

        query = ' '
    };

    // // Start listening
    // recognition.start();
    // console.log('Speech recognition started');
}