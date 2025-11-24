
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Award, Brain, ArrowLeft } from "lucide-react";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const answers = location.state?.answers as number[] | undefined;

  const [professions, setProfessions] = useState("");

  useEffect(() => {
    if (!answers || answers.length === 0) {
      navigate("/teste");
    }
  }, [answers, navigate]);

  if (!answers) {
    return null;
  }

  // Categorize questions into vocational areas
  const categories = [
    { name: "Lógico-Matemática", baseQuestions: [0], especificQuestions:[] },
    { name: "Linguística", baseQuestions: [1] },
    { name: "Espacial", baseQuestions: [2] },
    { name: "Musical", baseQuestions: [3] },
    { name: "Corporal-Cinestésica", baseQuestions: [4] },
    { name: "Interpessoal", baseQuestions: [5] },
    { name: "Intrapessoal", baseQuestions: [6] },
    { name: "Naturalista", baseQuestions: [7] },
    { name: "Existencial", baseQuestions: [8] },
  ];

  // Calculate scores for each category
  const chartData = categories.map((category) => {
    const total = category.baseQuestions.reduce((sum, qIndex) => sum + (answers[qIndex] || 0), 0);
    const average = total / category.baseQuestions.length;
    return {
      name: category.name,
      score: Math.round(average * 20), // Convert to 0-100 scale
    };
  });

  // Sort by score to find top 3
  const sortedCategories = [...chartData].sort((a, b) => b.score - a.score);
  const topCategories = sortedCategories.slice(0, 3);

  // Profession recommendations based on categories
  const professionMap: Record<string, string[]> = {
    Lógico_Matemática: ["Cientista de Dados", "Engenheiro", "Analista de Dados"],
    Linguística: ["Jornalista","Redator Publicitário", "Tradutor/Intérprete"],
    Espacial: ["Arquiterto", "Designer Gráfico", "Engenheiro Cívil"],
    Musical: ["Produtor Musical", "Músico/Instrumentista", "Compositor"],
    Corporal_Cinestésica: ["Fisioterapia", "Ator/ Dançarino", "Educador Físico"],
    Interpessoal: ["Psicologo","Gestor de Recursos Humanos", "Professor"],
    Intrapessoal: ["Terapeuta Holístico", "Filósofo", "Escritor"],
    Naturalista: ["Biológo", "Engenheito Ambiental", "Agrônomo"],
    Existencial: ["Filósofo", "Teólogo", "Pesquisador de Ciências Humanas"],
  };

  // Generate profession recommendations
  useEffect(() => {
    const recommendations = topCategories
      .map((cat, index) => {
        const profList = professionMap[cat.name] || [];
        return `${index + 1}. ${cat.name} (${cat.score}% de compatibilidade):\n   - ${profList.join("\n   - ")}`;
      })
      .join("\n\n");

    setProfessions(recommendations);
  }, []);

  // Specific colors for each category
  const categoryColors: Record<string, string> = {
    Lógico_Matemática: "hsl(220, 90%, 56%)", // Blue
    Linguística: "hsl(280, 65%, 60%)", // Purple
    Espacial: "hsl(25, 95%, 53%)", // Orange
    Musical: "hsl(160, 84%, 39%)", // Teal
    Corporal_Cinestésica: "hsl(340, 75%, 55%)", // Pink
    Interpessoal: "hsl(142, 71%, 45%)", // Green
    Intrapessoal: "hsl(84, 65%, 50%)", // Lime
    Naturalista: "hsl(200, 92%, 48%)", // Cyan
    Existencial: "hsl(262, 52%, 47%)", // Deep Purple
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg">TestVocacional</span>
            </div>

            <Link 
              to="/"
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Início
            </Link>
          </div>
        </div>
      </nav>

      {/* Results Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="mb-8 animate-scale-in">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-secondary rounded-full flex items-center justify-center animate-fade-in" style={{ animationDelay: "100ms" }}>
                <Award className="w-8 h-8 text-secondary-foreground" />
              </div>
              <CardTitle className="text-3xl animate-fade-in" style={{ animationDelay: "200ms", animationFillMode: "backwards" }}>Resultados do Teste Vocacional</CardTitle>
              <CardDescription className="animate-fade-in" style={{ animationDelay: "300ms", animationFillMode: "backwards" }}>
                Veja suas pontuações por área e as profissões recomendadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Chart Section */}
              <div className="animate-fade-in">
                <h3 className="text-xl font-semibold mb-4">Pontuação por Área</h3>
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={sortedCategories}>
                      <CartesianGrid 
                        strokeDasharray="3 3" 
                        stroke="hsl(var(--border))"
                        opacity={0.3}
                      />
                      <XAxis 
                        dataKey="name" 
                        stroke="hsl(var(--foreground))"
                        tick={{ fill: "hsl(var(--foreground))" }}
                      />
                      <YAxis 
                        stroke="hsl(var(--foreground))"
                        tick={{ fill: "hsl(var(--foreground))" }}
                        domain={[0, 100]}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--background))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                        }}
                        labelStyle={{ color: "hsl(var(--foreground))" }}
                        animationDuration={300}
                        animationEasing="ease-out"
                      />
                      <Bar 
                        dataKey="score" 
                        radius={[8, 8, 0, 0]}
                        animationBegin={200}
                        animationDuration={1000}
                        animationEasing="ease-out"
                      >
                        {sortedCategories.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={categoryColors[entry.name] || "hsl(var(--muted))"}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Professions Section */}
              <div className="animate-fade-in" style={{ animationDelay: "400ms", animationFillMode: "backwards" }}>
                <h3 className="text-xl font-semibold mb-4">Profissões Recomendadas</h3>
                <Textarea
                  value={professions}
                  readOnly
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>

              <div className="flex gap-4 animate-fade-in" style={{ animationDelay: "600ms", animationFillMode: "backwards" }}>
                <Button onClick={() => navigate("/teste")} variant="outline" className="flex-1">
                  Refazer Teste
                </Button>
                <Button onClick={() => navigate("/")} className="flex-1">
                  Voltar ao Início
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Results;
