import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { User, Phone, Loader2 } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

// As mesmas regras de validação da tela de login
const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  phone: z.string()
    .min(10, { message: "O telefone deve ter no mínimo 10 dígitos (DDD + número)." })
    .max(11, { message: "O telefone deve ter no máximo 11 dígitos (DDD + número)." })
    .regex(/^\d+$/, { message: "Digite apenas os números do seu telefone." }),
});

export function RegistrationForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log("Enviando dados de cadastro para o backend:", values);

    // Simulação de chamada à API
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Simular sucesso
    toast({
      title: "Cadastro realizado com sucesso!",
      description: "Seus dados foram enviados.",
    });

    setIsLoading(false);
    form.reset(); // Limpa o formulário após o envio
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardContent className="p-8">
        <div className="text-center mb-8">
            <h2 className="text-3xl font-bold">Cadastro</h2>
            <p className="text-muted-foreground mt-2">
                Cadastre-se para responder ao teste vocacional.
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