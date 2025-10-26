// Cole este código completo em: src/pages/StudentLogin.tsx

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Componentes da Shadcn UI
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react"; // Ícone de loading

// Esquema de validação com Zod (baseado no script.js)
const formSchema = z.object({
  name: z.string().min(1, { message: "Por favor, preencha o campo Nome." }), // Pega a validação do script.js
  phone: z.string()
    .transform(val => val.replace(/\D/g, '')) // Remove não-dígitos antes de validar
    .pipe(z.string().min(10, { message: "O telefone deve ter no mínimo 10 dígitos (DDD + número)." }))
    .pipe(z.string().max(11, { message: "O telefone deve ter no máximo 11 dígitos (DDD + número)." }))
});

export function StudentLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  // Estado para armazenar a mensagem (sucesso ou erro) vinda do backend
  const [serverMessage, setServerMessage] = useState<{ type: 'success' | 'error'; message: string | TrustedHTML } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "" },
  });

  // Função onSubmit que envia os dados para o backend (adaptada do script.js)
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setServerMessage(null); // Limpa mensagens anteriores

    try {
      // Normaliza o telefone para o padrão E.164 (+55), como no script.js original
      // A validação do Zod já garante que temos 10 ou 11 dígitos
      const normalizedPhone = "+55" + values.phone; 

      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: values.name, phone: normalizedPhone }),
      });

      const data = await response.json();

      if (response.ok) {
        // Sucesso (Status 2xx) - Monta a mensagem como no script.js
        let successHtml = `<h4>✅ Acesso Confirmado!</h4>`;
        successHtml += `<p><strong>Status do Sistema:</strong> ${data.message}</p>`;
        successHtml += `<p><strong>Seu ID:</strong> ${data.aluno_id}</p>`;
        if (data.curso) {
            successHtml += `<p><strong>Curso Realizado:</strong> ${data.curso}</p>`;
        } else {
            successHtml += `<p><strong>Próximo Passo:</strong> Prossiga para o questionário.</p>`;
        }
        setServerMessage({ type: 'success', message: successHtml });
        
        // Opcional: Redirecionar após um tempo, se necessário
        // setTimeout(() => navigate('/questionario'), 3000); 

      } else {
        // Erro (Status 4xx ou 5xx) - Pega a mensagem do backend
        const errorMessage = data.detail || "Erro desconhecido. Por favor, tente novamente.";
        setServerMessage({ type: 'error', message: `<h4>❌ Erro ao Acessar (${response.status})</h4><p>${errorMessage}</p>` });
      }

    } catch (error) {
      // Erros de rede (CORS, servidor offline etc.)
      setServerMessage({ type: 'error', message: '<h4>❌ Erro de Conexão</h4><p>Não foi possível conectar ao servidor. Verifique se o backend está rodando.</p>' });
      console.error('Erro de rede:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Tradução da estrutura HTML e CSS para JSX e Tailwind
  return (
    // Aplica o fundo verde e a fonte Inter globalmente (como no body do style.css)
    <div className="flex min-h-screen w-full items-center justify-center bg-[#1a764b] p-4 font-['Inter',_sans-serif]">
      
      {/* Container do formulário (.formLogin) */}
      <div className="w-full max-w-md rounded-[7px] bg-white p-[40px] shadow-[10px_10px_40px_rgba(0,0,0,0.4)] space-y-[5px]"> {/* Padding e Sombra do CSS */}
        
        {/* Título e Descrição */}
        <h1 className="text-center text-[2.3em] font-medium mb-[10px]">Login</h1> {/* Tamanho, peso e margem do h1 */}
        <p className="text-center text-[14px] text-[#888888] mb-[20px]">Digite o seu nome e telefone para acessar:</p> {/* Tamanho, cor e margem do p */}

        {/* Componente Form do Shadcn UI para integrar com react-hook-form */}
        <Form {...form}>
          {/* Tag form HTML com o handler onSubmit */}
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[15px]"> {/* Espaçamento entre campos */}
            
            {/* Campo Nome */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[1em] font-semibold text-[#555]">Nome:</FormLabel> {/* Estilos do label */}
                  <FormControl>
                    <Input 
                      placeholder="Digite o seu nome completo" 
                      {...field} 
                      // Classes que replicam o estilo do input no style.css
                      className="w-full rounded-[7px] border border-[#f0f0f0] p-[15px] text-[15px] text-[#555] outline-none focus:border-[#1a764b] focus:shadow-[0_0_10px_#1a764b]" 
                      disabled={isLoading} 
                    />
                  </FormControl>
                  {/* Mensagem de erro específica do campo (do Zod) */}
                  <FormMessage className="text-[12px] text-red-600"/> 
                </FormItem>
              )}
            />

            {/* Campo Telefone */}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[1em] font-semibold text-[#555]">Telefone</FormLabel> {/* Estilos do label */}
                  <FormControl>
                    <Input 
                      type="tel" 
                      placeholder="(00) 00000-0000" 
                      maxLength={15} // Mantém o maxlength do HTML original
                      {...field} 
                      // Classes que replicam o estilo do input no style.css
                      className="w-full rounded-[7px] border border-[#f0f0f0] p-[15px] text-[15px] text-[#555] outline-none focus:border-[#1a764b] focus:shadow-[0_0_10px_#1a764b]"
                      disabled={isLoading} 
                    />
                  </FormControl>
                  {/* Mensagem de erro específica do campo (do Zod) */}
                  <FormMessage className="text-[12px] text-red-600"/>
                </FormItem>
              )}
            />
            
            {/* Container para exibir mensagens do servidor (sucesso ou erro) */}
            {serverMessage && (
              <div
                // Aplica estilos baseados no tipo da mensagem (success/error)
                className={`mt-[20px] rounded-[5px] border p-[10px] text-center text-sm font-medium ${
                  serverMessage.type === 'success'
                    ? 'border-[#4CAF50] bg-[#e8f5e9] text-[#1b5e20]'
                    : 'border-[#f44336] bg-[#ffebee] text-[#b71c1c]'
                }`}
                // Usa dangerouslySetInnerHTML para renderizar o HTML da mensagem de sucesso
                dangerouslySetInnerHTML={{ __html: serverMessage.message }}
              />
            )}
            
            {/* Botão de Envio */}
            <Button 
              type="submit" 
              // Classes que replicam o estilo do .btn no style.css
              className="w-full cursor-pointer rounded-[7px] border-none bg-[#1a764b] py-[15px] px-[40px] text-center text-[1.25em] font-bold uppercase text-white shadow-[0_5px_10px_rgba(0,0,0,0.4)] transition-colors hover:bg-[#135a37]"
              disabled={isLoading}
            >
              {/* Mostra ícone de loading se estiver carregando */}
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Validando..." : "Acessar"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default StudentLogin;