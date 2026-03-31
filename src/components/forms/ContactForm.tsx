"use client";
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle, Loader2, Mail, MessageSquare, Phone, Send, User } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, "El nombre es muy corto"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(9, "Teléfono inválido"),
  topic: z.string().min(1, "Selecciona un motivo"),
  message: z.string().min(10, "Cuéntanos un poco más (mín. 10 caracteres)"),
  honeypot: z.string().optional(),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    if (data.honeypot) return;

    setIsSubmitting(true);
    
    try {
      // Replace with your Web3Forms Access Key or API endpoint
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
            access_key: "YOUR_ACCESS_KEY_HERE", // IMPORTANT: Add your key here
            subject: `Nuevo mensaje Web: ${data.topic}`,
            from_name: "Terencio Web Contact",
            ...data
        })
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus('success');
        reset();
        // Optional: Redirect to thank you page
        // window.location.href = '/gracias';
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input type="text" className="hidden" {...register("honeypot")} />

        {/* Name Field */}
        <div className="space-y-1">
            <label htmlFor="name" className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Nombre Completo</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <User size={18} />
                </div>
                <input
                    {...register("name")}
                    id="name"
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none ${errors.name ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    placeholder="Tu nombre"
                />
            </div>
            {errors.name && <p className="text-red-500 text-xs ml-1 flex items-center gap-1"><AlertCircle size={10} /> {errors.name.message}</p>}
        </div>

        {/* Grid for Email & Phone */}
        <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-1">
                <label htmlFor="email" className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Mail size={18} />
                    </div>
                    <input
                        {...register("email")}
                        id="email"
                        type="email"
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        placeholder="nombre@email.com"
                    />
                </div>
                {errors.email && <p className="text-red-500 text-xs ml-1">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
                <label htmlFor="phone" className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Teléfono</label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Phone size={18} />
                    </div>
                    <input
                        {...register("phone")}
                        id="phone"
                        type="tel"
                        className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none ${errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                        placeholder="600 000 000"
                    />
                </div>
                {errors.phone && <p className="text-red-500 text-xs ml-1">{errors.phone.message}</p>}
            </div>
        </div>

        {/* Topic Selector */}
        <div className="space-y-1">
            <label htmlFor="topic" className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Motivo de consulta</label>
            <div className="relative">
                <select
                    {...register("topic")}
                    id="topic"
                    className={`w-full px-4 py-3 bg-gray-50 rounded-xl border appearance-none focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none text-gray-700 ${errors.topic ? 'border-red-300' : 'border-gray-200'}`}
                >
                    <option value="">Selecciona una opción...</option>
                    <option value="Información General">Información General</option>
                    <option value="Disponibilidad Producto">Consultar Stock / Producto</option>
                    <option value="Sugerencia">Sugerencia o Felicitación</option>
                    <option value="Incidencia">Incidencia</option>
                    <option value="Empleo">Recursos Humanos</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
            {errors.topic && <p className="text-red-500 text-xs ml-1">{errors.topic.message}</p>}
        </div>

        {/* Message */}
        <div className="space-y-1">
            <label htmlFor="message" className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Mensaje</label>
            <div className="relative">
                <div className="absolute top-3 left-3 pointer-events-none text-gray-400">
                    <MessageSquare size={18} />
                </div>
                <textarea
                    {...register("message")}
                    id="message"
                    rows={4}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border focus:bg-white focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all outline-none resize-none ${errors.message ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                    placeholder="¿En qué podemos ayudarte?"
                ></textarea>
            </div>
            {errors.message && <p className="text-red-500 text-xs ml-1">{errors.message.message}</p>}
        </div>

        {/* Submit Button */}
        <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-brand-primary text-white font-bold text-lg py-4 rounded-xl hover:bg-green-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
        >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
            {isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
        </button>

        {/* Status Messages */}
        {submitStatus === 'success' && (
            <div className="p-4 bg-green-50 text-green-800 rounded-xl flex items-start gap-3 border border-green-200 animate-fade-in-up">
                <CheckCircle className="shrink-0 text-green-600" size={20} />
                <div>
                    <p className="font-bold">¡Mensaje enviado con éxito!</p>
                    <p className="text-sm">Gracias por contactar. Te responderemos en breve.</p>
                </div>
            </div>
        )}
        
        {submitStatus === 'error' && (
            <div className="p-4 bg-red-50 text-red-800 rounded-xl flex items-start gap-3 border border-red-200 animate-pulse">
                <AlertCircle className="shrink-0 text-red-600" size={20} />
                <div>
                    <p className="font-bold">Hubo un error al enviar</p>
                    <p className="text-sm">Por favor, revisa tu conexión o llámanos directamente.</p>
                </div>
            </div>
        )}

        <p className="text-[10px] text-center text-gray-400 mt-4">
            Sus datos están protegidos. Al enviar acepta nuestra <a href="/legal/politica-privacidad" className="underline hover:text-green-700">política de privacidad</a>.
        </p>
    </form>
  );
}