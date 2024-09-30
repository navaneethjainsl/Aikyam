const fs = require("fs");
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegInstaller = require('@ffmpeg-installer/ffmpeg');
const path = require("path");

// Set the path to the ffmpeg binary
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Azure Speech Service configuration
const subscriptionKey = process.env.API_KEY_SPEECH;
const serviceRegion = "eastus";
const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, serviceRegion);
speechConfig.speechRecognitionLanguage = "en-US";

// Files
const m4aFile = "Test.m4a";
const wavFile = path.basename(m4aFile, path.extname(m4aFile)) + ".wav";

// Function to convert M4A to WAV
function convertM4AToWAV(inputFile, outputFile) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputFile)
            .toFormat('wav')
            .on('error', (err) => reject(err))
            .on('end', () => resolve(outputFile))
            .save(outputFile);
    });
}

// Function to perform speech recognition
async function fromFile() {
    try {
        // Convert M4A to WAV
        await convertM4AToWAV(m4aFile, wavFile);
        console.log(`Conversion complete: ${wavFile}`);

        // Read the converted WAV file
        let audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(wavFile));
        let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

        // Perform speech recognition
        speechRecognizer.recognizeOnceAsync(result => {
            switch (result.reason) {
                case sdk.ResultReason.RecognizedSpeech:
                    console.log(`RECOGNIZED: Text=${result.text}`);
                    break;
                case sdk.ResultReason.NoMatch:
                    console.log("NOMATCH: Speech could not be recognized.");
                    break;
                case sdk.ResultReason.Canceled:
                    const cancellation = sdk.CancellationDetails.fromResult(result);
                    console.log(`CANCELED: Reason=${cancellation.reason}`);

                    if (cancellation.reason == sdk.CancellationReason.Error) {
                        console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
                        console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
                        console.log("CANCELED: Did you set the speech resource key and region values?");
                    }
                    break;
            }
            speechRecognizer.close();
        });
    } catch (err) {
        console.error("ERROR during operation: " + err);
    }
}

fromFile();