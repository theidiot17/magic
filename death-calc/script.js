document.getElementById('quizForm').addEventListener('submit', function(e) {
    e.preventDefault();
    // Simple scoring logic
    let score = 0;
    const q1 = document.querySelector('input[name="q1"]:checked');
    if (q1) {
        score += q1.value === 'A' ? 1 : q1.value === 'B' ? 2 : q1.value === 'C' ? 3 : 4;
    }
    // Add more scoring based on additional questions

    // Determine result based on score
    let resultText = '';
    if (score <= 2) {
        resultText = 'You have a healthy lifestyle!';
    } else if (score <= 4) {
        resultText = 'There are areas you can improve for better health.';
    } else if (score <= 6) {
        resultText = 'Consider consulting a healthcare professional for personalized advice.';
    } else {
        resultText = 'Your lifestyle may pose health risks. Please seek professional guidance.';
    }

    // Display the result
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.textContent = resultText;
});
