import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const newsletterSchema = z.object({
  email: z.string().email("Introduce un email válido"),
  honeypot: z.string().optional(),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

export default function NewsletterForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  });

  const onSubmit = async (data: NewsletterFormData) => {
    if (data.honeypot) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            access_key: "82d5137b-b53c-414f-9671-eadf139e9505",
            subject: "Nueva suscripción a la Newsletter (Inicio)",
            from_name: "Web Terencio Cash Market",
            ...data
        })
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      
      // Reset success/error message after a few seconds
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="relative flex flex-col sm:flex-row gap-3">
            <input type="text" className="hidden" {...register("honeypot")} />
    
            <div className="flex-grow">
                <input
                {...register("email")}
                id="newsletter-email"
                type="email"
                autoComplete="email"
                className={`w-full px-5 py-4 rounded-xl text-slate-800 placeholder:text-slate-400 border-2 bg-white focus:ring-4 focus:outline-none transition-all shadow-sm ${errors.email ? 'border-red-400 focus:ring-red-100' : 'border-slate-100 focus:border-green-500 focus:ring-green-100'}`}
                placeholder="Tu dirección de correo..."
                disabled={isSubmitting || submitStatus === 'success'}
                />
            </div>
    
            <button
                type="submit"
                disabled={isSubmitting || submitStatus === 'success'}
                className="bg-green-700 hover:bg-green-800 text-white font-bold text-base px-8 py-4 rounded-xl transition shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none min-w-[140px]"
            >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'Suscribirme'}
            </button>
            
            {errors.email && (
                <p className="absolute -bottom-6 left-2 text-red-500 text-xs font-medium flex items-center gap-1">
                    <AlertCircle size={12} /> {errors.email.message}
                </p>
            )}
        </form>

        {/* Status Messages */}
        <div className="mt-4 h-6 flex justify-center items-center">
            {submitStatus === 'success' && (
                <div className="text-green-700 font-bold flex items-center gap-2 text-sm animate-fade-in-up">
                    <CheckCircle size={16} />
                    ¡Gracias por suscribirte a nuestras ofertas!
                </div>
            )}
            {submitStatus === 'error' && (
                <div className="text-red-600 font-medium flex items-center gap-2 text-sm animate-fade-in-up">
                    <AlertCircle size={16} />
                    Hubo un error al suscribirte. Inténtalo de nuevo.
                </div>
            )}
        </div>
        <p className="text-[11px] text-center text-slate-500 mt-2">
            Al suscribirte aceptas nuestra <a href="/legal/politica-privacidad" className="underline hover:text-green-700 transition-colors">política de privacidad</a>. Prometemos no enviar spam.
        </p>
    </div>
  );
}
