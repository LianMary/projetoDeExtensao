import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent,CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Phone, Loader2, Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"; // Usaremos o toast para feedback

// O MESMO esquema de validação da tela de login
const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  phone: z.string()
    .min(10, { message: "O telefone deve ter no mínimo 10 dígitos (DDD + número)." })
    .max(11, { message: "O telefone deve ter no máximo 11 dígitos (DDD + número)." })
    .regex(/^\d+$/, { message: "Digite apenas os números do seu telefone." }),
});

export function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast(); // Hook para mostrar notificações toast

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "" },
  });

  // A MESMA função onSubmit da tela de login
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Não temos 'serverMessage' aqui, usaremos toast

    try {
      // Normaliza o telefone
      const normalizedPhone = "+55" + values.phone.replace(/\D/g, "");

      // Chama o MESMO endpoint /api/login
      // !! ATENÇÃO: Verifique com o backend se este é o endpoint correto para CADASTRO !!
      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.name, phone: normalizedPhone }),
      });

      const data = await response.json();

      if (response.ok) {
        // Mostra um toast de sucesso
        toast({
          title: "Cadastro/Login realizado!",
          description: data.message || "Seus dados foram enviados.",
        });
        form.reset(); // Limpa o formulário
        // Não redireciona, pois estamos na página principal

      } else {
        // Mostra um toast de erro
        const errorMessage = data.detail || "Erro desconhecido.";
        toast({
          title: "Erro no Cadastro/Login",
          description: errorMessage,
          variant: "destructive", // Estilo de erro para o toast
        });
      }

    } catch (error) {
      // Mostra um toast para erro de conexão
       toast({
          title: "Erro de Conexão",
          description: "Não foi possível conectar ao servidor.",
          variant: "destructive",
        });
      console.error('Erro de rede:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // A estrutura visual é a mesma de antes
  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border-t-4 border-primary">
      <CardContent className="p-8">
        <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-3xl font-bold">Crie sua Conta Gratuitamente</h2>
            <p className="text-muted-foreground mt-2 max-w-xl mx-auto">
                Ao se cadastrar, você pode salvar os resultados do seu teste vocacional e receber recomendações personalizadas.
            </p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input placeholder="Seu nome" {...field} className="pl-10" disabled={isLoading} />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Telefone</FormLabel>
                        <FormControl>
                            <div className="relative">
                            <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input type="tel" placeholder="(00) 00000-0000" {...field} className="pl-10" disabled={isLoading} />
                            </div>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            {/* O feedback de erro agora será via Toast, não mais um div aqui */}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Enviando..." : "Cadastrar e Salvar Resultados"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}