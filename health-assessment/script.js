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
        resultText = `🎉 Excellent! Your Health and Wellness score is ${percentage}%. Keep up the great work!`;
    } else if (percentage >= 60) {
        resultText = `🙂 Good job! Your Health and Wellness score is ${percentage}%. There's room for improvement.`;
    } else if (percentage >= 40) {
        resultText = `😐 Fair progress. Your Health and Wellness score is ${percentage}%. Consider making some positive changes.`;
    } else {
        resultText = `😟 Your Health and Wellness score is ${percentage}%. It's important to consult with a healthcare professional for personalized advice.`;
    }

    // Display the result
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.textContent = resultText;
});
