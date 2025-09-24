import React, { useState } from 'react';
import { Phone, EnvelopeSimple, User } from '@phosphor-icons/react';

export const ProgramacaoNovaInlineContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode integrar com EmailJS ou outro serviço
    console.log('Form submitted:', formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section className="py-20 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Garanta sua <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Vaga</span>
            </h2>
            <p className="text-xl text-zinc-300">
              Preencha o formulário e receba mais informações sobre o curso
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-zinc-900 rounded-xl p-8 border border-zinc-800">
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                  className="block w-full pl-10 pr-3 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeSimple className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Seu melhor email"
                  className="block w-full pl-10 pr-3 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Seu WhatsApp"
                  className="block w-full pl-10 pr-3 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              </div>

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Conte-nos sobre seus objetivos com programação"
                rows={4}
                className="block w-full px-3 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Quero Receber Mais Informações
              </button>
            </div>

            <p className="text-sm text-zinc-400 text-center mt-4">
              Ao enviar, você concorda em receber informações sobre nossos cursos.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};