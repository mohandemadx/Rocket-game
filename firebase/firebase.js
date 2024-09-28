import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "ADD YOUR API",
    authDomain: "scope-7189c.firebaseapp.com",
    databaseURL: "https://scope-7189c-default-rtdb.firebaseio.com",
    projectId: "scope-7189c",
    storageBucket: "scope-7189c.appspot.com",
    messagingSenderId: "696247136473",
    appId: "1:696247136473:web:ef2400d62305a938320ec8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app); // Get the database instance (for Realtime Database)

// Function to get the score data
async function getScore(username) {
    const scoreRef = ref(database, 'scores/' + username);
    try {
        const snapshot = await get(scoreRef);
        if (snapshot.exists()) {
            return snapshot.val();
        } else {
            
            return null;
        }
    } catch (error) {
        
        return null;
    }
}

// Function to save a score with optional parameters
async function saveScore(username, score, level, highscore) {
    const scoreRef = ref(database, 'scores/' + username);

    // Fetch existing data
    const existingData = await getScore(username);

    // Handle the case where there's no existing data
    const newScore = score !== undefined ? score : existingData?.score || 0;
    const newLevel = level !== undefined ? level : existingData?.level || 1;
    const newHighscore = highscore !== undefined ? highscore : existingData?.highscore || 0;

    // Update the data (or create new if it doesn't exist)
    try {
        await set(scoreRef, {
            username: username,
            score: newScore,
            level: newLevel,
            highscore: newHighscore,
        });

    } catch (error) {
        
    }
}

// Function to get only the highscore for a given username
async function getHighscore(username) {
    const data = await getScore(username);
    if (data && data.highscore !== undefined) {
        
        return data.highscore;
    } else {
        
        return null;
    }
}

// Function to get all high scores and return the highest score along with the username
async function getHighestScoreWithUsername() {
    const scoresRef = ref(database, 'scores'); // Reference to the scores path
    try {
        const snapshot = await get(scoresRef);
        if (snapshot.exists()) {
            const scores = snapshot.val(); // Get all scores
            let highestScore = 0; // Initialize variable to store the highest score
            let highestUsername = ''; // Initialize variable to store the username with the highest score

            // Iterate through the scores
            for (const username in scores) {
                if (scores[username].highscore > highestScore) {
                    highestScore = scores[username].highscore; // Update highest score if found
                    highestUsername = username; // Update the username with the highest score
                }
            }
            return { highestScore, highestUsername }; // Return both highest score and username
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
}

// Exporting the functions for use in other files
export { saveScore, getScore, getHighscore, getHighestScoreWithUsername };
