import { BookOpen, HeartHandshake, Stethoscope } from "lucide-react";
import { Reveal, Section, SectionLead, SectionTitle } from "./shared";

const pontos = [
  {
    icon: Stethoscope,
    title: "Manda você ao médico quando precisa",
    text: "Tem um capítulo dedicado aos sinais de alerta — febre, sangue, dor lombar. Um material que te orienta a buscar ajuda profissional não está só tentando vender a qualquer custo.",
  },
  {
    icon: BookOpen,
    title: "Plano, não improvisação",
    text: "Em vez de dicas soltas da internet, você recebe o Protocolo Bexiga Blindada™ e 4 bônus práticos para consultar no dia a dia.",
  },
  {
    icon: HeartHandshake,
    title: "Transparência",
    text: "Este material não promete cura nem substitui tratamento médico. Existe para te dar clareza e um plano de ação real.",
  },
];

export function Authority() {
  return (
    <Section tone="muted" id="autoridade">
      <Reveal>
        <SectionTitle>
          Um material que não tem medo de te mandar ao médico
        </SectionTitle>
        <SectionLead>
          Organizado por uma equipe educativa dedicada à saúde da mulher — com o
          compromisso de informar sem assustar e orientar sem substituir o
          cuidado profissional.
        </SectionLead>
      </Reveal>

      <div className="mt-14 grid gap-6 md:grid-cols-3">
        {pontos.map((p, i) => (
          <Reveal key={p.title} delay={i * 0.06}>
            <article className="h-full rounded-[1.75rem] border border-border bg-background p-8">
              <span className="grid size-11 place-items-center rounded-2xl bg-brand-tint text-brand">
                <p.icon className="size-5" strokeWidth={1.6} />
              </span>
              <h3 className="mt-5 text-xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-muted-foreground">
                {p.text}
              </p>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
