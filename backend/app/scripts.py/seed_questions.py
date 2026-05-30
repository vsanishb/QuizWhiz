from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.models.question import Question
from app.models.enums import DifficultyLevel


QUESTIONS = [
    {
        "question_text": "What is the SI unit of electric current?",
        "option_a": "Volt",
        "option_b": "Ampere",
        "option_c": "Ohm",
        "option_d": "Watt",
        "correct_option": "B",
        "difficulty": DifficultyLevel.EASY,
        "points": 5,
    },
    {
        "question_text": "Which electronic component stores electrical energy in an electric field?",
        "option_a": "Resistor",
        "option_b": "Inductor",
        "option_c": "Capacitor",
        "option_d": "Diode",
        "correct_option": "C",
        "difficulty": DifficultyLevel.EASY,
        "points": 5,
    },
    {
        "question_text": "What is the unit of electrical resistance?",
        "option_a": "Volt",
        "option_b": "Ampere",
        "option_c": "Farad",
        "option_d": "Ohm",
        "correct_option": "D",
        "difficulty": DifficultyLevel.EASY,
        "points": 5,
    },
    {
        "question_text": "Which semiconductor device allows current to flow primarily in one direction?",
        "option_a": "Transistor",
        "option_b": "Diode",
        "option_c": "Capacitor",
        "option_d": "Relay",
        "correct_option": "B",
        "difficulty": DifficultyLevel.MEDIUM,
        "points": 10,
    },
    {
        "question_text": "According to Ohm's Law, voltage is equal to:",
        "option_a": "Current × Resistance",
        "option_b": "Power × Current",
        "option_c": "Resistance ÷ Current",
        "option_d": "Power ÷ Voltage",
        "correct_option": "A",
        "difficulty": DifficultyLevel.MEDIUM,
        "points": 10,
    },
    {
        "question_text": "Which logic gate outputs HIGH only when all inputs are HIGH?",
        "option_a": "OR",
        "option_b": "XOR",
        "option_c": "AND",
        "option_d": "NOT",
        "correct_option": "C",
        "difficulty": DifficultyLevel.MEDIUM,
        "points": 10,
    },
    {
        "question_text": "What does LED stand for?",
        "option_a": "Light Emitting Diode",
        "option_b": "Low Energy Device",
        "option_c": "Linear Emission Display",
        "option_d": "Light Energy Detector",
        "correct_option": "A",
        "difficulty": DifficultyLevel.EASY,
        "points": 5,
    },
    {
        "question_text": "Which transistor configuration is commonly used as an amplifier?",
        "option_a": "Common Base",
        "option_b": "Common Collector",
        "option_c": "Common Emitter",
        "option_d": "Darlington Pair",
        "correct_option": "C",
        "difficulty": DifficultyLevel.HARD,
        "points": 20,
    },
    {
        "question_text": "Which instrument is commonly used to measure voltage, current, and resistance?",
        "option_a": "Oscilloscope",
        "option_b": "Function Generator",
        "option_c": "Multimeter",
        "option_d": "LCR Meter",
        "correct_option": "C",
        "difficulty": DifficultyLevel.MEDIUM,
        "points": 10,
    },
    {
        "question_text": "What is the binary equivalent of decimal number 10?",
        "option_a": "1010",
        "option_b": "1001",
        "option_c": "1110",
        "option_d": "1100",
        "correct_option": "A",
        "difficulty": DifficultyLevel.HARD,
        "points": 20,
    },
]


def seed_questions():
    db: Session = SessionLocal()

    try:
        existing_count = db.query(Question).count()

        if existing_count > 0:
            print("Questions already exist. Skipping seeding.")
            return

        questions = [
            Question(**question_data)
            for question_data in QUESTIONS
        ]

        db.add_all(questions)
        db.commit()

        print(f"Successfully inserted {len(questions)} questions.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding questions: {e}")

    finally:
        db.close()


if __name__ == "__main__":
    seed_questions()