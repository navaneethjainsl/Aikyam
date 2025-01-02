import sys
import os
from fastapi import FastAPI
from pydantic import BaseModel
import uvicorn

# Add the ML directory to sys.path so Python can locate it
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'ML')))

# Now import your quiz module from ML
from Virtualquiz.quiz import get_quiz_questions, evaluate_quiz

app = FastAPI()

# Create a Pydantic model to handle the quiz answers from frontend
class QuizAnswers(BaseModel):
    answers: list[int]

@app.get("/quiz")
def get_quiz():
    questions = get_quiz_questions()
    return {"questions": questions}

@app.post("/evaluate")
def evaluate(answers: QuizAnswers):
    score = evaluate_quiz(answers.answers)
    return {"score": score}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
