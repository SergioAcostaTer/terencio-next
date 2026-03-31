"use client";

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, CheckCircle, FileText, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import siteData from '../../data/siteData.json';

import {
  professionalSubmissionSchema,
  type ProfessionalSubmissionInput,
} from '@/lib/form-submissions';

export default function ProfessionalForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProfessionalSubmissionInput>({
    resolver: zodResolver(professionalSubmissionSchema),
  });

  const onSubmit = async (data: ProfessionalSubmissionInput) => {
    if (data.honeypot) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/professional', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        reset();
        router.push('/gracias');
      } else {
        setSubmitStatus('error');
      }
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input type="text" className="hidden" {...register("honeypot")} />

        <div className="space-y-1">
            <label htmlFor="businessName" className="font-bold text-gray-700 text-sm">Nombre del Negocio</label>
            <input
            {...register("businessName")}
            id="businessName"
            autoComplete="organization"
            className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-white focus:ring-2 focus:outline-none transition ${errors.businessName ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200'}`}
            placeholder="Ej. Restaurante El Pino"
            />
            {errors.businessName && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12} /> {errors.businessName.message}</p>}
        </div>

        <div className="space-y-1">
            <label htmlFor="sector" className="font-bold text-gray-700 text-sm">Sector</label>
            <select
            {...register("sector")}
            id="sector"
            autoComplete="organization-title"
            className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-white focus:ring-2 focus:outline-none transition ${errors.sector ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200'}`}
            >
            <option value="">Selecciona una opción...</option>
            <option value="Restauración">Restauración / Cafetería</option>
            <option value="Guachinche">Guachinche / Asador</option>
            <option value="Hotel">Hotel / Apartamentos</option>
            <option value="Comercio">Pequeño Comercio / Venta</option>
            <option value="Catering">Catering / Eventos</option>
            <option value="Otro">Otro</option>
            </select>
            {errors.sector && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12} /> {errors.sector.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
                <label htmlFor="email" className="font-bold text-gray-700 text-sm">Email</label>
                <input
                {...register("email")}
                id="email"
                type="email"
                autoComplete="email"
                className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-white focus:ring-2 focus:outline-none transition ${errors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200'}`}
                placeholder="tu@email.com"
                />
                {errors.email && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12} /> {errors.email.message}</p>}
            </div>

            <div className="space-y-1">
                <label htmlFor="phone" className="font-bold text-gray-700 text-sm">Teléfono</label>
                <input
                {...register("phone")}
                id="phone"
                type="tel"
                autoComplete="tel"
                className={`w-full px-4 py-2.5 text-sm rounded-lg border bg-white focus:ring-2 focus:outline-none transition ${errors.phone ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-green-200'}`}
                placeholder="600 000 000"
                />
                {errors.phone && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={12} /> {errors.phone.message}</p>}
            </div>
        </div>

        <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#185d26] text-white font-bold text-base py-2.5 rounded-xl hover:bg-green-800 transition shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
        >
            {isSubmitting ? <Loader2 className="animate-spin" /> : <FileText size={20} />}
            {isSubmitting ? 'Enviando...' : 'Solicitar Tarifas'}
        </button>
        
        <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400 text-xs">O si prefieres hablar directamente</span>
            <div className="flex-grow border-t border-gray-200"></div>
        </div>

        { (siteData.contact.whatsapp || siteData.contact.whatsappUrl) ? (
        <a 
            href={siteData.contact.whatsappUrl ? `${siteData.contact.whatsappUrl}?text=Hola,%20soy%20un%20negocio%20y%20me%20gustar%C3%ADa%20solicitar%20tarifas%20de%20mayorista.` : `https://wa.me/34${siteData.contact.phoneRaw}?text=Hola,%20soy%20un%20negocio%20y%20me%20gustar%C3%ADa%20solicitar%20tarifas%20de%20mayorista.`} 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-[#25D366] text-white font-bold text-base py-2.5 rounded-xl hover:bg-[#128C7E] transition shadow-md flex items-center justify-center gap-2"
        >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="currentColor" strokeWidth="0" className="text-white">
               <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            Hablar por WhatsApp
        </a>
        ) : (
        <a 
            href={`tel:${siteData.contact.phoneRaw}`}
            className="w-full bg-blue-600 text-white font-bold text-base py-2.5 rounded-xl hover:bg-blue-700 transition shadow-md flex items-center justify-center gap-2"
        >
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
               <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
            </svg>
            Llámanos ahora
        </a>
        )}

        <p className="text-[10px] text-center text-gray-500 mt-2">
            Acepto la <a href="/legal/politica-privacidad" className="underline hover:text-green-700">política de privacidad</a>.
        </p>

        {submitStatus === 'success' && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg flex items-center gap-2 text-center justify-center text-sm border border-green-200">
                <CheckCircle size={16} />
                <p className="font-bold">¡Solicitud recibida!</p>
            </div>
        )}

        {submitStatus === 'error' && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg flex items-center gap-2 text-center justify-center text-sm border border-red-200">
                <AlertCircle size={16} />
                <p>Hubo un error. Inténtalo de nuevo.</p>
            </div>
        )}
    </form>
  );
}
