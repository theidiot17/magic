document.getElementById('quizForm').addEventListener('submit', function(e) {
    e.preventDefault();
    let score = 0;
    const totalQuestions = 5; // Update this based on the number of questions

    for(let i = 1; i <= totalQuestions; i++) {
        const q = document.querySelector(`input[name="q${i}"]:checked`);
        if(q) {
            score += parseInt(q.value);
        }
    }

    // Calculate percentage
    const maxScore = totalQuestions * 5;
    const percentage = ((score / maxScore) * 100).toFixed(2);

    // Determine result based on percentage
    let resultText = '';
    if (percentage >= 80) {
        resultText = `🎉 Fantastic! Your Health and Wellness score is ${percentage}%. You're basically a superhero!`;
    } else if (percentage >= 60) {
        resultText = `🙂 Good job! Your Health and Wellness score is ${percentage}%. Keep striving for greatness!`;
    } else if (percentage >= 40) {
        resultText = `😐 Not bad. Your Health and Wellness score is ${percentage}%. Maybe add a little more fun to your routine!`;
    } else {
        resultText = `😟 Uh-oh! Your Health and Wellness score is ${percentage}%. Time to channel your inner ninja and make some changes!`;
    }

    // Display the result
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.textContent = resultText;
});
