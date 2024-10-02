import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDi1x050o6TxE4X7tL14c-QSqWhbMwId6g",
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
    
    // Update highscore only if the new score is higher than the existing highscore
    const newHighscore = highscore !== undefined
        ? Math.max(highscore, existingData?.highscore || 0)
        : existingData?.highscore || 0;

    // Update the data (or create new if it doesn't exist)
    try {
        await set(scoreRef, {
            username: username,
            score: newScore,
            level: newLevel,
            highscore: newHighscore, // Save the new highscore only if it's higher
        });
        console.log('Score saved successfully');
    } catch (error) {
        console.error('Error saving score:', error);
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

async function getTop5Scores() {
    const scoresRef = ref(database, 'scores');
    try {
        const snapshot = await get(scoresRef);
        if (snapshot.exists()) {
            const scores = snapshot.val();
            // Convert the object of scores into an array
            const scoreArray = Object.values(scores);
            
            // Sort the scores by the highscore in descending order
            scoreArray.sort((a, b) => b.highscore - a.highscore);
            
            // Return the top 5 scores
            return scoreArray.slice(0, 5);
        } else {
            console.log('No scores found');
            return [];
        }
    } catch (error) {
        console.error('Error fetching top scores:', error);
        return [];
    }
}

// Exporting the functions for use in other files
export { saveScore, getScore, getHighscore,  getTop5Scores};
