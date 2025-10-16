import { calculateResult } from "../services/calculate.js";
import { questions } from "../models/questions-test.js";

function processAnswers (req, res) {
    
    const answers = req.body;
    const result = calculateResult(questions, answers);

    if (result && result.error) {
        return res.status(400).json({ error: result.error });
    }

    return res.json(result);
};

export {
    processAnswers,
};