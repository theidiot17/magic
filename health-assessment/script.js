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
    const percentage = (score / maxScore) * 100;

    // Determine result based on percentage
    let resultText = '';
    if (percentage >= 80) {
        resultText = `Great job! Your health and wellness score is ${percentage}%. Keep up the excellent habits!`;
    } else if (percentage >= 60) {
        resultText = `Good effort! Your health and wellness score is ${percentage}%. There's room for improvement. Consider adopting healthier habits.`;
    } else if (percentage >= 40) {
        resultText = `Fair progress. Your health and wellness score is ${percentage}%. It might be beneficial to make some positive changes to enhance your well-being.`;
    } else {
        resultText = `Your health and wellness score is ${percentage}%. It's important to consult with a healthcare professional for personalized advice and to improve your lifestyle.`;
    }

    // Display the result
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.textContent = resultText;
});
