import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Correcting the import paths to be explicit
import apiClient from '../api/axiosConfig.js';
import Header from '../components/Header.jsx';

const QuizPage = () => {
  const { quizId } = useParams(); // Get the specific quiz ID from the URL
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the quiz data when the component loads
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await apiClient.get(`/quizzes/${quizId}`);
        setQuiz(response.data);
      } catch (error) {
        console.error("Failed to fetch quiz", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  // Update the state when the user selects an answer
  const handleOptionChange = (questionIndex, option) => {
    setAnswers({ ...answers, [questionIndex]: option });
  };

  // Send the answers to the backend for scoring
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await apiClient.post('/quizzes/submit', { quizId, answers });
      setResult(response.data); // Store the result to show the score screen
    } catch (error) {
      console.error("Failed to submit quiz", error);
    }
  };

  if (loading) {
    return <div className="text-center p-5">Loading Quiz...</div>;
  }
  if (!quiz) {
    return <div className="text-center p-5">Quiz not found.</div>;
  }

  // If the quiz has been submitted, show the result card
  if (result) {
    return (
        <>
            <Header />
            <div className="container mt-5">
                <div className="card text-center shadow-lg">
                    <div className="card-header bg-success text-white">
                        <h2>Quiz Complete!</h2>
                    </div>
                    <div className="card-body p-5">
                        <h4 className="card-title">Your Score: {result.score} / {result.totalQuestions}</h4>
                        <p className="card-text fs-5">{result.message}</p>
                        <button onClick={() => navigate('/dashboard')} className="btn btn-primary mt-3">Back to Dashboard</button>
                    </div>
                </div>
            </div>
        </>
    );
  }

  // Otherwise, show the quiz questions form
  return (
    <>
      <Header />
      <div className="container my-4">
        <div className="card shadow-sm">
          <div className="card-header">
            <h2>{quiz.title}</h2>
            <p className="text-muted mb-0">{quiz.category}</p>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {quiz.questions.map((q, index) => (
                <div key={index} className="mb-4 p-3 bg-light rounded border">
                  <p className="fw-bold">{index + 1}. {q.text}</p>
                  {q.options.map((option, i) => (
                    <div key={i} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`question-${index}`}
                        id={`q${index}-option${i}`}
                        value={option}
                        onChange={() => handleOptionChange(index, option)}
                        checked={answers[index] === option}
                        required
                      />
                      <label className="form-check-label" htmlFor={`q${index}-option${i}`}>
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              ))}
              <button type="submit" className="btn btn-success w-100 py-2 mt-3">Submit Answers</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizPage;

