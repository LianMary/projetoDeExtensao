import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { RegistrationForm } from '@/components/Common/RegistrationForm';
/*
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
import { Loader2, Mail } from "lucide-react"; // Adicionado ícone de Email
*/


// ====================================================================
// MUDANÇA 1: Adicionar Email ao Esquema de Validação (Zod)
// ====================================================================
const formSchema = z.object({
  name: z.string().min(1, { message: "Por favor, preencha o campo Nome." }),
  phone: z.string()
    .transform(val => val.replace(/\D/g, '')) // Remove não-dígitos
    .pipe(z.string().min(10, { message: "O telefone deve ter no mínimo 10 dígitos (DDD + número)." }))
    .pipe(z.string().max(11, { message: "O telefone deve ter no máximo 11 dígitos (DDD + número)." })),
  // Adiciona o campo de email como opcional, mas se preenchido, deve ser válido
  email: z.string().email({ message: "Por favor, digite um email válido." }).optional().or(z.literal("")),
});

export function StudentLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [serverMessage, setServerMessage] = useState<{ type: 'success' | 'error'; message: string | TrustedHTML } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // MUDANÇA 2: Adicionar Email aos valores padrão
    defaultValues: { name: "", phone: "", email: "" },
  });

  // Função onSubmit que envia os dados para o backend
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setServerMessage(null); 

    try {
      const normalizedPhone = "+55" + values.phone; 

      const response = await fetch("http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        
        // ====================================================================
        // MUDANÇA 3: Enviar o Email no corpo da requisição
        // ====================================================================
        body: JSON.stringify({ 
            name: values.name,
            phone: normalizedPhone,
            email: values.email || null // Envia o email ou null se estiver vazio
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Lógica de sucesso (não muda)
        const token = data.access_token;
        localStorage.setItem('accessToken', token);

        let successHtml = `<h4>✅ Login Bem-Sucedido!</h4>`;
        successHtml += `<p><strong>Status do Sistema:</strong> ${data.message}</p>`;

        if (data.curso) {
            successHtml += `<p><strong>Curso Realizado:</strong> ${data.curso}</p>`;
        } else {
            successHtml += `<p><strong>Próximo Passo:</strong> Prossiga para o questionário.</p>`;
        }
        setServerMessage({ type: 'success', message: successHtml });
        
      } else {
        // Lógica de erro (não muda)
        const errorMessage = data.detail || "Erro desconhecido. Por favor, tente novamente.";
        setServerMessage({ type: 'error', message: `<h4>❌ Erro ao Acessar (${response.status})</h4><p>${errorMessage}</p>` });
      }

    } catch (error) {
      // Lógica de erro de rede (não muda)
      setServerMessage({ type: 'error', message: '<h4>❌ Erro de Conexão</h4><p>Não foi possível conectar ao servidor. Verifique se o backend está rodando.</p>' });
      console.error('Erro de rede:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // O visual (JSX)
  return (
    /* */
    <div className="flex min-h-screen w-full items-center justify-center bg-[#1a764b] p-4 font-['Inter',_sans-serif]">
          
        <section className="w-full max-w-md rounded-[7px] bg-white p-[40px] shadow-[10px_10px_40px_rgba(0,0,0,0.4)] space-y-[5px]">
          <RegistrationForm /> {/* Renderiza o formulário aqui */}
        </section>
        
    
    </div>
  );
}

export default StudentLogin;