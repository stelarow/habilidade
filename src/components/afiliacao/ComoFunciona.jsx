import { toast } from 'sonner';
import {
  UserPlus,
  Ticket,
  ShareNetwork,
  Money,
  Strategy,
  ChatText,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { GlowingEffect } from '@/components/ui/glowing-effect';
import { cn } from '@/lib/utils';
import { comoFunciona, planoAcao, mensagemWhatsApp } from '@/data/afiliacao';

const iconMap = {
  UserPlus,
  Ticket,
  ShareNetwork,
  Money,
};

const GlowingCard = ({ area, icon, title, description, children }) => {
  return (
    <li className={cn("min-h-[14rem] list-none", area)}>
      <div className="relative h-full rounded-[1.25rem] border-[0.75px] border-gray-700 p-2 md:rounded-[1.5rem] md:p-3">
        <GlowingEffect
          spread={40}
          glow={true}
          disabled={false}
          proximity={64}
          inactiveZone={0.01}
          borderWidth={3}
        />
        <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-[0.75px] border-gray-700 bg-gray-800 p-6 shadow-sm md:p-6">
          <div className="relative flex flex-1 flex-col justify-between gap-3">
            {icon && (
              <div className="w-fit rounded-lg border-[0.75px] border-gray-600 bg-green-600 p-2">
                {icon}
              </div>
            )}
            <div className="space-y-3">
              {title && (
                <h3 className="pt-0.5 text-xl leading-[1.375rem] font-semibold tracking-[-0.04em] md:text-2xl md:leading-[1.875rem] text-white">
                  {title}
                </h3>
              )}
              {description && (
                <p className="text-sm leading-[1.125rem] md:text-base md:leading-[1.375rem] text-gray-400">
                  {description}
                </p>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </li>
  );
};

const ComoFunciona = () => {
  const copiarMensagem = () => {
    navigator.clipboard.writeText(mensagemWhatsApp);
    toast.success('Mensagem copiada!');
  };

  const stepItems = comoFunciona.map((item) => {
    const Icon = iconMap[item.iconName];
    return {
      ...item,
      icon: Icon ? <Icon size={20} weight="bold" className="text-white" /> : null,
    };
  });

  return (
    <section className="py-20 bg-gray-900">
      <div className="container mx-auto px-4 max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-black text-white text-center mb-12">
          Como funciona
        </h2>

        <ul className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:gap-4">
          {/* Passo 1 */}
          <GlowingCard
            area="md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/4]"
            icon={stepItems[0]?.icon}
            title={
              <>
                <span className="text-xs font-bold text-yellow-400 uppercase block mb-1">
                  Passo {stepItems[0]?.step}
                </span>
                {stepItems[0]?.title}
              </>
            }
            description={stepItems[0]?.description}
          />

          {/* Passo 2 */}
          <GlowingCard
            area="md:[grid-area:1/7/2/13] xl:[grid-area:1/4/2/7]"
            icon={stepItems[1]?.icon}
            title={
              <>
                <span className="text-xs font-bold text-yellow-400 uppercase block mb-1">
                  Passo {stepItems[1]?.step}
                </span>
                {stepItems[1]?.title}
              </>
            }
            description={stepItems[1]?.description}
          />

          {/* Passo 3 */}
          <GlowingCard
            area="md:[grid-area:2/1/3/7] xl:[grid-area:1/7/2/10]"
            icon={stepItems[2]?.icon}
            title={
              <>
                <span className="text-xs font-bold text-yellow-400 uppercase block mb-1">
                  Passo {stepItems[2]?.step}
                </span>
                {stepItems[2]?.title}
              </>
            }
            description={stepItems[2]?.description}
          />

          {/* Passo 4 */}
          <GlowingCard
            area="md:[grid-area:2/7/3/13] xl:[grid-area:1/10/2/13]"
            icon={stepItems[3]?.icon}
            title={
              <>
                <span className="text-xs font-bold text-yellow-400 uppercase block mb-1">
                  Passo {stepItems[3]?.step}
                </span>
                {stepItems[3]?.title}
              </>
            }
            description={stepItems[3]?.description}
          />

          {/* Plano de Ação - largura total */}
          <GlowingCard
            area="md:[grid-area:3/1/4/13] xl:[grid-area:2/1/3/13]"
            icon={<Strategy size={20} weight="bold" className="text-white" />}
            title="Plano de Ação"
          >
            <div className="rounded-lg border border-gray-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 bg-gray-900/50">
                    <TableHead className="text-yellow-400 font-bold text-xs">Passo</TableHead>
                    <TableHead className="text-yellow-400 font-bold text-xs">O que fazer</TableHead>
                    <TableHead className="text-yellow-400 font-bold text-xs">Ferramenta</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {planoAcao.map((row) => (
                    <TableRow key={row.passo} className="border-gray-700">
                      <TableCell className="text-white font-semibold text-sm">{row.passo}</TableCell>
                      <TableCell className="text-gray-300 text-sm">{row.oQueFazer}</TableCell>
                      <TableCell className="text-gray-400 text-sm">{row.ferramenta}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </GlowingCard>

          {/* Mensagem WhatsApp - largura total */}
          <GlowingCard
            area="md:[grid-area:4/1/5/13] xl:[grid-area:3/1/4/13]"
            icon={<ChatText size={20} weight="bold" className="text-white" />}
            title="Mensagem pronta para enviar"
          >
            <div className="flex flex-col gap-3">
              <pre className="whitespace-pre-wrap text-gray-300 text-sm font-sans bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                {mensagemWhatsApp}
              </pre>
              <Button
                onClick={copiarMensagem}
                variant="outline"
                className="w-full border-yellow-500 text-yellow-400 hover:bg-yellow-500/10"
              >
                Copiar mensagem
              </Button>
            </div>
          </GlowingCard>
        </ul>
      </div>
    </section>
  );
};

export default ComoFunciona;
