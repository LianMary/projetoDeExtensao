import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScaleQuestion from "@/components/ScaleQuestion";
import { Award } from "lucide-react";

const questions = [
    "Gosto de trabalhar com números e cálculos matemáticos complexos",
    "Prefiro atividades que envolvem criatividade e expressão artística",
    "Me sinto confortável liderando grupos e tomando decisões importantes",
    "Tenho interesse em compreender como as coisas funcionam tecnicamente",
    "Gosto de ajudar outras pessoas a resolver seus problemas",
    "Me interesso por questões relacionadas à saúde e bem-estar",
    "Prefiro trabalhos que me permitam estar em contato com a natureza",
    "Tenho facilidade para me comunicar e persuadir outras pessoas",
    "Me sinto motivado por desafios que envolvem análise e pesquisa",
    "Gosto de atividades que exigem precisão e atenção aos detalhes"
];

const TestPage = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = value;
    setAnswers(newAnswers);
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResults(true);
      }
    }, 500);
  };

  const resetTest = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const calculateResults = () => {
    const total = answers.reduce((sum, answer) => sum + answer, 0);
    const average = total / answers.length;
    
    if (average >= 4) return "Alto interesse vocacional";
    if (average >= 2.5) return "Interesse vocacional moderado"; 
    return "Baixo interesse vocacional";
  };

  return (
    <div className="bg-background">
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Teste Vocacional</h2>
            <p className="text-muted-foreground">
              Responda as perguntas de acordo com o quanto você se identifica com cada afirmação.
            </p>
          </div>

          {!showResults ? (
            <div className="space-y-8">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
              
              <div className="text-center text-sm text-muted-foreground">
                Pergunta {currentQuestion + 1} de {questions.length}
              </div>

              <ScaleQuestion
                question={questions[currentQuestion]}
                onAnswer={handleAnswer}
                key={currentQuestion}
              />
            </div>
          ) : (
            <Card className="max-w-2xl mx-auto text-center">
              <CardHeader>
                <div className="mx-auto mb-4 w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-2xl">Teste Concluído!</CardTitle>
                <CardDescription>
                  Aqui está o seu resultado baseado nas suas respostas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-muted rounded-lg p-6 mb-6">
                  <h3 className="text-xl font-semibold text-primary mb-2">
                    {calculateResults()}
                  </h3>
                  <p className="text-muted-foreground">
                    Suas respostas indicam um padrão específico de interesses e aptidões. 
                    Recomendamos buscar orientação profissional para um resultado mais detalhado.
                  </p>
                </div>
                <Button onClick={resetTest} className="w-full">
                  Refazer Teste
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>
    </div>
  );
};

export default TestPage;