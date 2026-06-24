import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, FileUp, Loader2, MessageCircle, Send, Trash2 } from "lucide-react";
import logoNeg from "@/assets/logo-negativa.png.asset.json";
import { CONTACT, whatsappLink } from "@/lib/analytics";

export const Route = createFileRoute("/briefing")({
  head: () => ({
    meta: [
      { title: "Briefing do Site Profissional | Mundo Digital Soluções" },
      { name: "description", content: "Envie as informações necessárias para criação do seu site profissional pela Mundo Digital Soluções." },
    ],
  }),
  component: BriefingPage,
});

type FormState = {
  companyName: string;
  tradeName: string;
  cnpj: string;
  whatsapp: string;
  email: string;
  businessDescription: string;
  differentials: string;
  targetAudience: string;
  serviceRegion: string;
  hasLogo: string;
  hasBrandManual: string;
  preferredColors: string;
  visualNotes: string;
  institutionalText: string;
  mainServices: string;
  businessHours: string;
  address: string;
  commercialPhone: string;
  instagram: string;
  facebook: string;
  googleBusiness: string;
  linkedin: string;
  currentWebsite: string;
  hasDomain: string;
  currentDomain: string;
  desiredDomain: string;
  domainNotes: string;
  confirmation: boolean;
};

const initialForm: FormState = {
  companyName: "",
  tradeName: "",
  cnpj: "",
  whatsapp: "",
  email: "",
  businessDescription: "",
  differentials: "",
  targetAudience: "",
  serviceRegion: "",
  hasLogo: "",
  hasBrandManual: "",
  preferredColors: "",
  visualNotes: "",
  institutionalText: "",
  mainServices: "",
  businessHours: "",
  address: "",
  commercialPhone: "",
  instagram: "",
  facebook: "",
  googleBusiness: "",
  linkedin: "",
  currentWebsite: "",
  hasDomain: "",
  currentDomain: "",
  desiredDomain: "",
  domainNotes: "",
  confirmation: false,
};

const steps = ["Dados da Empresa", "Sobre o Negócio", "Identidade Visual", "Conteúdo", "Redes Sociais", "Arquivos", "Domínio", "Confirmação"];
const STORAGE_KEY = "mds-site-briefing-draft";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

function BriefingPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(initialForm);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submissionWarning, setSubmissionWarning] = useState("");

  useEffect(() => {
    const draft = window.localStorage.getItem(STORAGE_KEY);
    if (!draft) return;
    try {
      setForm({ ...initialForm, ...JSON.parse(draft) });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
  }, [form]);

  const progress = useMemo(() => Math.round(((step + 1) / steps.length) * 100), [step]);

  const update = (field: keyof FormState, value: string | boolean) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[field];
      delete next.submit;
      return next;
    });
  };

  const validateStep = (currentStep = step) => {
    const nextErrors: Record<string, string> = {};
    const required = (field: keyof FormState, label: string) => {
      if (!String(form[field] ?? "").trim()) nextErrors[field] = `${label} é obrigatório.`;
    };

    if (currentStep === 0) {
      required("companyName", "Nome da empresa");
      required("tradeName", "Nome fantasia");
      required("whatsapp", "WhatsApp");
      required("email", "E-mail");
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Informe um e-mail válido.";
      if (form.whatsapp && form.whatsapp.replace(/\D/g, "").length < 10) nextErrors.whatsapp = "Informe um WhatsApp válido com DDD.";
    }
    if (currentStep === 1) {
      required("businessDescription", "O que a empresa vende");
      required("differentials", "Principais diferenciais");
      required("targetAudience", "Público-alvo");
      required("serviceRegion", "Região atendida");
    }
    if (currentStep === 2) {
      required("hasLogo", "Possui logo");
      required("hasBrandManual", "Possui manual da marca");
    }
    if (currentStep === 3) {
      required("mainServices", "Serviços principais");
      required("businessHours", "Horário de funcionamento");
    }
    if (currentStep === 6) {
      required("hasDomain", "Já possui domínio");
      if (form.hasDomain === "Sim") required("currentDomain", "Domínio atual");
      if (form.hasDomain === "Não") required("desiredDomain", "Domínio desejado");
    }
    if (currentStep === 7 && !form.confirmation) nextErrors.confirmation = "Confirme a autorização para enviar o briefing.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = () => {
    if (!validateStep()) return;
    setStep((current) => Math.min(current + 1, steps.length - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const previousStep = () => {
    setStep((current) => Math.max(current - 1, 0));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const addFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    setFiles((current) => [...current, ...Array.from(selectedFiles)]);
  };

  const removeFile = (index: number) => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index));

  const parseError = async (response: Response, fallback: string) => {
    const text = await response.text();
    try {
      const json = JSON.parse(text) as { message?: string; details?: string; hint?: string; code?: string };
      return [json.message, json.details, json.hint, json.code].filter(Boolean).join(" | ") || fallback;
    } catch {
      return text || fallback;
    }
  };

  const submit = async () => {
    if (!validateStep(7)) return;
    setSubmitting(true);
    setSubmissionWarning("");

    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        const localBriefing = { ...form, files: files.map((file) => ({ name: file.name, type: file.type, size: file.size })), createdAt: new Date().toISOString(), status: "new" };
        window.localStorage.setItem(`mds-briefing-submission-${Date.now()}`, JSON.stringify(localBriefing));
        setSubmissionWarning("Briefing salvo localmente. Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no Coolify para salvar no banco de dados.");
        setSuccess(true);
        window.localStorage.removeItem(STORAGE_KEY);
        return;
      }

      const briefingId = crypto.randomUUID();
      const headers = {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        "Content-Type": "application/json",
      };
      const briefingPayload = {
        id: briefingId,
        company_name: form.companyName,
        trade_name: form.tradeName,
        cnpj: form.cnpj || null,
        whatsapp: form.whatsapp,
        email: form.email,
        business_description: form.businessDescription,
        differentials: form.differentials,
        target_audience: form.targetAudience,
        service_region: form.serviceRegion,
        has_logo: form.hasLogo,
        has_brand_manual: form.hasBrandManual,
        preferred_colors: form.preferredColors || null,
        visual_notes: form.visualNotes || null,
        institutional_text: form.institutionalText || null,
        main_services: form.mainServices,
        business_hours: form.businessHours,
        address: form.address || null,
        commercial_phone: form.commercialPhone || null,
        instagram: form.instagram || null,
        facebook: form.facebook || null,
        google_business: form.googleBusiness || null,
        linkedin: form.linkedin || null,
        current_website: form.currentWebsite || null,
        has_domain: form.hasDomain,
        current_domain: form.currentDomain || null,
        desired_domain: form.desiredDomain || null,
        domain_notes: form.domainNotes || null,
        confirmation: form.confirmation,
        status: "new",
      };

      const briefingResponse = await fetch(`${supabaseUrl}/rest/v1/briefings`, {
        method: "POST",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify(briefingPayload),
      });
      if (!briefingResponse.ok) throw new Error(await parseError(briefingResponse, "Não foi possível salvar o briefing no banco de dados."));

      for (const file of files) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const filePath = `${briefingId}/${Date.now()}-${safeName}`;
        const uploadResponse = await fetch(`${supabaseUrl}/storage/v1/object/briefing-files/${filePath}`, {
          method: "POST",
          headers: { apikey: supabaseAnonKey, Authorization: `Bearer ${supabaseAnonKey}`, "Content-Type": file.type || "application/octet-stream", "x-upsert": "false" },
          body: file,
        });
        if (!uploadResponse.ok) continue;

        await fetch(`${supabaseUrl}/rest/v1/briefing_files`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            briefing_id: briefingId,
            file_name: file.name,
            file_url: `${supabaseUrl}/storage/v1/object/public/briefing-files/${filePath}`,
            file_type: file.type || "file",
            file_size: file.size,
          }),
        });
      }

      setSuccess(true);
      window.localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : "Erro ao enviar briefing." });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) return <SuccessScreen warning={submissionWarning} />;

  return (
    <main className="min-h-screen bg-[#0b0f25] text-white">
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 opacity-50" style={{ background: "radial-gradient(circle at top, #374B89 0%, transparent 42%), linear-gradient(180deg, #111735 0%, #070a18 100%)" }} />
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.05) 1px, transparent 1px)", backgroundSize: "42px 42px" }} />
      </div>

      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <a href="/" className="inline-flex items-center gap-3"><img src={logoNeg.url} alt="Mundo Digital Soluções" className="h-9 w-auto" /></a>
        <a href={whatsappLink("Olá! Tenho uma dúvida sobre o briefing do meu site.")} target="_blank" rel="noopener noreferrer" className="hidden rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/75 transition hover:bg-white/10 md:inline-flex">Precisa de ajuda?</a>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex rounded-full border border-white/10 bg-white/[0.05] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/60">Onboarding do projeto</div>
          <h1 className="text-balance text-4xl font-semibold leading-tight md:text-6xl">Briefing do seu site profissional</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/65">Preencha as informações abaixo para nossa equipe iniciar a criação do seu site. Quanto mais completo estiver, mais rápido conseguimos desenvolver a primeira versão alinhada com sua marca.</p>
        </div>

        <div className="mx-auto mt-12 max-w-4xl rounded-[32px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_40px_120px_-60px_rgba(0,0,0,.8)] backdrop-blur md:p-8">
          <div className="mb-8">
            <div className="mb-3 flex items-center justify-between text-sm text-white/60"><span>{steps[step]}</span><span>{progress}%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-r from-[#6178DD] to-[#374B89] transition-all" style={{ width: `${progress}%` }} /></div>
          </div>

          <div className="min-h-[430px]">
            {step === 0 && <StepCompany form={form} update={update} errors={errors} />}
            {step === 1 && <StepBusiness form={form} update={update} errors={errors} />}
            {step === 2 && <StepVisual form={form} update={update} errors={errors} />}
            {step === 3 && <StepContent form={form} update={update} errors={errors} />}
            {step === 4 && <StepSocial form={form} update={update} />}
            {step === 5 && <StepFiles files={files} addFiles={addFiles} removeFile={removeFile} />}
            {step === 6 && <StepDomain form={form} update={update} errors={errors} />}
            {step === 7 && <StepConfirm form={form} update={update} files={files} errors={errors} />}
          </div>

          {errors.submit && <div className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-200">{errors.submit}</div>}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button onClick={previousStep} disabled={step === 0 || submitting} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white/70 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"><ArrowLeft className="h-4 w-4" /> Voltar</button>
            {step < steps.length - 1 ? (
              <button onClick={nextStep} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4F63C9] to-[#374B89] px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.01]">Continuar <ArrowRight className="h-4 w-4" /></button>
            ) : (
              <button onClick={submit} disabled={submitting} className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#4F63C9] to-[#374B89] px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.01] disabled:cursor-wait disabled:opacity-70">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Enviar briefing</button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

type StepProps = { form: FormState; update: (field: keyof FormState, value: string | boolean) => void; errors: Record<string, string> };
function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) { return <label className="block"><span className="mb-2 block text-sm font-medium text-white/80">{label}</span>{children}{error && <span className="mt-2 block text-xs text-red-300">{error}</span>}</label>; }
const inputClass = "w-full rounded-xl border border-white/10 bg-[#111735] px-4 py-3 text-white outline-none transition placeholder:text-white/30 focus:border-[#6178DD] focus:bg-[#151b3d] [color-scheme:dark]";
const textareaClass = `${inputClass} min-h-[120px] resize-y`;
const selectClass = `${inputClass} appearance-auto cursor-pointer`;
const optionClass = "bg-[#111735] text-white";

function StepCompany({ form, update, errors }: StepProps) { return <div className="grid gap-5 md:grid-cols-2"><Field label="Nome da empresa" error={errors.companyName}><input className={inputClass} value={form.companyName} onChange={(e) => update("companyName", e.target.value)} /></Field><Field label="Nome fantasia" error={errors.tradeName}><input className={inputClass} value={form.tradeName} onChange={(e) => update("tradeName", e.target.value)} /></Field><Field label="CNPJ (opcional)" error={errors.cnpj}><input className={inputClass} value={form.cnpj} onChange={(e) => update("cnpj", e.target.value)} /></Field><Field label="WhatsApp" error={errors.whatsapp}><input className={inputClass} value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} placeholder="(17) 99999-9999" /></Field><div className="md:col-span-2"><Field label="E-mail" error={errors.email}><input className={inputClass} type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></Field></div></div>; }
function StepBusiness({ form, update, errors }: StepProps) { return <div className="grid gap-5"><Field label="O que a empresa vende?" error={errors.businessDescription}><textarea className={textareaClass} value={form.businessDescription} onChange={(e) => update("businessDescription", e.target.value)} /></Field><Field label="Principais diferenciais" error={errors.differentials}><textarea className={textareaClass} value={form.differentials} onChange={(e) => update("differentials", e.target.value)} /></Field><Field label="Público-alvo" error={errors.targetAudience}><textarea className={textareaClass} value={form.targetAudience} onChange={(e) => update("targetAudience", e.target.value)} /></Field><Field label="Região atendida" error={errors.serviceRegion}><input className={inputClass} value={form.serviceRegion} onChange={(e) => update("serviceRegion", e.target.value)} placeholder="Cidade, bairro ou região" /></Field></div>; }
function StepVisual({ form, update, errors }: StepProps) { return <div className="grid gap-5 md:grid-cols-2"><Field label="Possui logo?" error={errors.hasLogo}><select className={selectClass} value={form.hasLogo} onChange={(e) => update("hasLogo", e.target.value)}><option className={optionClass} value="">Selecione</option><option className={optionClass}>Sim</option><option className={optionClass}>Não</option></select></Field><Field label="Possui manual da marca?" error={errors.hasBrandManual}><select className={selectClass} value={form.hasBrandManual} onChange={(e) => update("hasBrandManual", e.target.value)}><option className={optionClass} value="">Selecione</option><option className={optionClass}>Sim</option><option className={optionClass}>Não</option></select></Field><div className="md:col-span-2"><Field label="Cores preferidas" error={errors.preferredColors}><input className={inputClass} value={form.preferredColors} onChange={(e) => update("preferredColors", e.target.value)} placeholder="Ex: azul, branco e dourado" /></Field></div><div className="md:col-span-2"><Field label="Observações sobre identidade visual"><textarea className={textareaClass} value={form.visualNotes} onChange={(e) => update("visualNotes", e.target.value)} /></Field></div></div>; }
function StepContent({ form, update, errors }: StepProps) { return <div className="grid gap-5"><Field label="Texto institucional"><textarea className={textareaClass} value={form.institutionalText} onChange={(e) => update("institutionalText", e.target.value)} placeholder="Conte a história da empresa ou mande uma base de texto." /></Field><Field label="Serviços principais" error={errors.mainServices}><textarea className={textareaClass} value={form.mainServices} onChange={(e) => update("mainServices", e.target.value)} /></Field><Field label="Horário de funcionamento" error={errors.businessHours}><textarea className={textareaClass} value={form.businessHours} onChange={(e) => update("businessHours", e.target.value)} placeholder="Ex: Segunda a sexta, das 8h às 18h." /></Field><Field label="Endereço completo"><textarea className={textareaClass} value={form.address} onChange={(e) => update("address", e.target.value)} /></Field><Field label="Telefone comercial"><input className={inputClass} value={form.commercialPhone} onChange={(e) => update("commercialPhone", e.target.value)} /></Field></div>; }
function StepSocial({ form, update }: Omit<StepProps, "errors">) { return <div className="grid gap-5 md:grid-cols-2"><Field label="Instagram"><input className={inputClass} value={form.instagram} onChange={(e) => update("instagram", e.target.value)} /></Field><Field label="Facebook"><input className={inputClass} value={form.facebook} onChange={(e) => update("facebook", e.target.value)} /></Field><Field label="Google Meu Negócio"><input className={inputClass} value={form.googleBusiness} onChange={(e) => update("googleBusiness", e.target.value)} /></Field><Field label="LinkedIn"><input className={inputClass} value={form.linkedin} onChange={(e) => update("linkedin", e.target.value)} /></Field><div className="md:col-span-2"><Field label="Site atual"><input className={inputClass} value={form.currentWebsite} onChange={(e) => update("currentWebsite", e.target.value)} /></Field></div></div>; }
function StepFiles({ files, addFiles, removeFile }: { files: File[]; addFiles: (files: FileList | null) => void; removeFile: (index: number) => void }) { return <div><label className="flex min-h-[230px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-white/[0.04] p-8 text-center transition hover:bg-white/[0.07]"><FileUp className="mb-4 h-10 w-10 text-white/60" /><span className="text-lg font-semibold text-white">Envie logo, fotos, vídeos ou catálogos</span><span className="mt-2 max-w-md text-sm text-white/55">Você pode selecionar vários arquivos. Aceitamos imagens, PDFs e vídeos.</span><input type="file" multiple accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx" className="hidden" onChange={(event) => addFiles(event.target.files)} /></label>{files.length > 0 && <div className="mt-6 space-y-3">{files.map((file, index) => <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm"><div className="min-w-0"><div className="truncate font-medium text-white">{file.name}</div><div className="text-xs text-white/45">{(file.size / 1024 / 1024).toFixed(2)} MB</div></div><button onClick={() => removeFile(index)} className="rounded-lg p-2 text-white/50 transition hover:bg-white/10 hover:text-white"><Trash2 className="h-4 w-4" /></button></div>)}</div>}</div>; }
function StepDomain({ form, update, errors }: StepProps) { return <div className="grid gap-5"><Field label="Já possui domínio?" error={errors.hasDomain}><select className={selectClass} value={form.hasDomain} onChange={(e) => update("hasDomain", e.target.value)}><option className={optionClass} value="">Selecione</option><option className={optionClass}>Sim</option><option className={optionClass}>Não</option></select></Field>{form.hasDomain === "Sim" && <Field label="Qual domínio possui?" error={errors.currentDomain}><input className={inputClass} value={form.currentDomain} onChange={(e) => update("currentDomain", e.target.value)} placeholder="exemplo.com.br" /></Field>}{form.hasDomain === "Não" && <Field label="Qual domínio deseja registrar?" error={errors.desiredDomain}><input className={inputClass} value={form.desiredDomain} onChange={(e) => update("desiredDomain", e.target.value)} placeholder="exemplo.com.br" /></Field>}<Field label="Observações sobre domínio"><textarea className={textareaClass} value={form.domainNotes} onChange={(e) => update("domainNotes", e.target.value)} /></Field></div>; }
function StepConfirm({ form, update, files, errors }: StepProps & { files: File[] }) { const summary = [["Empresa", form.companyName], ["Nome fantasia", form.tradeName], ["WhatsApp", form.whatsapp], ["E-mail", form.email], ["Região", form.serviceRegion], ["Domínio", form.hasDomain === "Sim" ? form.currentDomain : form.desiredDomain], ["Arquivos", `${files.length} arquivo(s)`]]; return <div><div className="grid gap-3 md:grid-cols-2">{summary.map(([label, value]) => <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-4"><div className="text-xs uppercase tracking-[0.16em] text-white/40">{label}</div><div className="mt-1 text-white/85">{value || "Não informado"}</div></div>)}</div><label className="mt-6 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-5"><input type="checkbox" checked={form.confirmation} onChange={(e) => update("confirmation", e.target.checked)} className="mt-1 h-4 w-4 accent-[#6178DD]" /><span className="text-sm text-white/70">Confirmo que as informações enviadas estão corretas e autorizo a Mundo Digital Soluções a utilizar estes dados e arquivos para desenvolvimento do meu site.</span></label>{errors.confirmation && <div className="mt-2 text-xs text-red-300">{errors.confirmation}</div>}</div>; }
function SuccessScreen({ warning }: { warning: string }) { return <main className="flex min-h-screen items-center justify-center bg-[#0b0f25] px-6 text-white"><div className="max-w-2xl rounded-[32px] border border-white/10 bg-white/[0.05] p-10 text-center shadow-[0_40px_120px_-60px_rgba(0,0,0,.8)]"><div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300"><Check className="h-10 w-10" /></div><h1 className="text-4xl font-semibold">Briefing recebido com sucesso!</h1><p className="mt-5 text-lg text-white/70">Nossa equipe vai analisar suas informações e iniciar a produção do seu site. Caso precise de algum ajuste ou material complementar, entraremos em contato pelo WhatsApp informado.</p>{warning && <div className="mt-6 rounded-xl border border-orange-400/30 bg-orange-500/10 p-4 text-sm text-orange-100">{warning}</div>}<a href={whatsappLink("Olá! Acabei de enviar o briefing do meu site.")} target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 text-sm font-semibold text-white transition hover:scale-[1.02]"><MessageCircle className="h-4 w-4" /> Falar com a Mundo Digital</a><div className="mt-6 text-xs text-white/35">{CONTACT.whatsappDisplay}</div></div></main>; }
