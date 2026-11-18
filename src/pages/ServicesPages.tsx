import React, { useState } from 'react';
import { ArrowRight, Upload, CheckCircle2, ClipboardList, Wrench, Box, Layers } from 'lucide-react';
import { usePlatform } from '../context/PlatformContext';
import { ServiceCatalogItem } from '../types/platform';

export const PRINTING_3D_CAPABILITIES: string[] = [
  'FDM 3D Printing',
  'Custom 3D Prototyping',
  'Functional Mechanical Parts',
  'Product Design & Development',
  'Engineering Models',
  'Customized Components',
  'Rapid Prototyping',
];

export const PRINTING_3D_DESCRIPTION =
  'Transform your digital designs into physical products with professional 3D printing, rapid prototyping, custom component manufacturing, product development, and precision fabrication services.';

export const PROJECT_DEVELOPMENT_CAPABILITIES: string[] = [
  'Final-Year Engineering Projects',
  'Mini Projects & Academic Models',
  'AI & Machine Learning Projects',
  'IoT & Embedded Systems',
  'Robotics & Automation',
  'PCB Design & Development',
  'Drone & UAV Development',
  'Hardware Prototyping',
];

export const PROJECT_DEVELOPMENT_DESCRIPTION =
  'End-to-end engineering project development, hardware prototyping, electronics integration, embedded programming, robotics, IoT, AI/ML, PCB design, and customized final-year and industrial project solutions.';

export const CUSTOM_ENGINEERING_CAPABILITIES: string[] = [
  'Final-Year Engineering Projects',
  'Mini Projects & Academic Models',
  'AI & Machine Learning Projects',
  'IoT & Embedded Systems',
  'Robotics & Automation',
  'PCB Design & Development',
  'Drone & UAV Development',
  'Hardware Prototyping',
  'Electrical and Electronics Engineering',
  'Mechanical Design and CAD Modelling',
  '3D Printing and Rapid Prototyping',
  'Custom Research and Product Development',
];

export const CUSTOM_ENGINEERING_DESCRIPTION = PROJECT_DEVELOPMENT_DESCRIPTION;

function buildNormalizedServices(raw: ServiceCatalogItem[]): ServiceCatalogItem[] {
  const bySlug = new Map<string, ServiceCatalogItem>();
  for (const s of raw) {
    bySlug.set(s.slug, s);
  }

  const default3dp: ServiceCatalogItem = {
    slug: '3d-printing',
    title: '3D Printing & Rapid Prototyping',
    shortDesc: PRINTING_3D_DESCRIPTION,
    fullDesc: PRINTING_3D_DESCRIPTION,
    imageUrl: '',
    videoUrl: '',
    benefits: PRINTING_3D_CAPABILITIES,
    capabilities: PRINTING_3D_CAPABILITIES,
    ctaLabel: 'Explore Service',
    ctaLink: '/services/3d-printing',
    visible: true,
  };

  const defaultProjectDev: ServiceCatalogItem = {
    slug: 'custom-engineering-projects',
    title: 'Project Development',
    shortDesc: PROJECT_DEVELOPMENT_DESCRIPTION,
    fullDesc: PROJECT_DEVELOPMENT_DESCRIPTION,
    imageUrl: '/src/assets/images/hero_nexustek_engineering_1794981062404.jpg',
    videoUrl: '',
    benefits: PROJECT_DEVELOPMENT_CAPABILITIES,
    capabilities: PROJECT_DEVELOPMENT_CAPABILITIES,
    ctaLabel: 'Explore Service',
    ctaLink: '/register-project',
    secondaryCtaLabel: 'Engineering Scope',
    secondaryCtaLink: '/services/custom-engineering',
    visible: true,
  };

  const defaultRepair: ServiceCatalogItem = {
    slug: 'drone-repair',
    title: 'Drone Repair & Diagnostics Service',
    shortDesc:
      'Agricultural & FPV UAV airframe repair, flight controller calibration, ESC/motor replacement, bench diagnostics at our Nagpur Service Centre, and on-site field technician support.',
    fullDesc:
      'Agricultural & FPV UAV airframe repair, flight controller calibration, ESC/motor replacement, bench diagnostics at our Nagpur Service Centre, and on-site field technician support.',
    imageUrl: '/src/assets/images/service_drone_repair_1794987205295.jpg',
    videoUrl: '',
    benefits: [
      'Agricultural spraying, survey, FPV & industrial UAV diagnostics',
      'Flight controller calibration, ESC, motor & airframe repair',
      'Nagpur Service Centre drop-off/courier or on-site field visit',
      'Itemized inspection & repair quotation inside My Account',
    ],
    capabilities: [],
    ctaLabel: 'Book Drone Repair & Enquiry',
    ctaLink: '/services/drone-repair',
    visible: true,
  };

  const existing3dp = bySlug.get('3d-printing');
  const existingProj = bySlug.get('custom-engineering-projects') || bySlug.get('custom-engineering');
  const existingRepair = bySlug.get('drone-repair');

  const resolved: ServiceCatalogItem[] = [];

  if (!existing3dp || existing3dp.visible !== false) {
    resolved.push(
      existing3dp
        ? {
            ...default3dp,
            ...existing3dp,
            imageUrl: '',
            benefits: existing3dp.benefits?.length ? existing3dp.benefits : PRINTING_3D_CAPABILITIES,
            capabilities: existing3dp.capabilities?.length ? existing3dp.capabilities : PRINTING_3D_CAPABILITIES,
            ctaLabel: existing3dp.ctaLabel || 'Explore Service',
            ctaLink: existing3dp.ctaLink || '/services/3d-printing',
          }
        : default3dp
    );
  }

  if (!existingProj || existingProj.visible !== false) {
    const isLegacyTitle =
      !existingProj?.title || existingProj.title === 'Custom Engineering Project Development & Prototyping';
    resolved.push(
      existingProj
        ? {
            ...defaultProjectDev,
            ...existingProj,
            title: isLegacyTitle ? 'Project Development' : existingProj.title,
            shortDesc: isLegacyTitle ? PROJECT_DEVELOPMENT_DESCRIPTION : existingProj.shortDesc,
            fullDesc: isLegacyTitle ? PROJECT_DEVELOPMENT_DESCRIPTION : existingProj.fullDesc,
            benefits:
              existingProj.benefits?.length && !isLegacyTitle
                ? existingProj.benefits
                : PROJECT_DEVELOPMENT_CAPABILITIES,
            capabilities:
              existingProj.capabilities?.length && !isLegacyTitle
                ? existingProj.capabilities
                : PROJECT_DEVELOPMENT_CAPABILITIES,
            ctaLabel:
              existingProj.ctaLabel && existingProj.ctaLabel !== 'Register Your Project'
                ? existingProj.ctaLabel
                : 'Explore Service',
            ctaLink: existingProj.ctaLink || '/register-project',
            secondaryCtaLabel: existingProj.secondaryCtaLabel || 'Engineering Scope',
            secondaryCtaLink: existingProj.secondaryCtaLink || '/services/custom-engineering',
          }
        : defaultProjectDev
    );
  }

  if (!existingRepair || existingRepair.visible !== false) {
    resolved.push(existingRepair ? { ...defaultRepair, ...existingRepair } : defaultRepair);
  }

  for (const s of raw) {
    if (
      s.visible !== false &&
      !['3d-printing', 'custom-engineering-projects', 'custom-engineering', 'drone-repair'].includes(s.slug)
    ) {
      resolved.push(s);
    }
  }

  return resolved;
}

export const ServicesOverviewPage: React.FC = () => {
  const { settings, banners, navigate } = usePlatform();
  const svcCms = settings.cmsContent?.services;
  const svcBanners = (banners || []).filter(
    (b) => b.placement === 'services' && b.isActive && b.status === 'published'
  );
  const visibleServices = buildNormalizedServices(svcCms?.services || settings.servicesCatalog || []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 space-y-12">
      <div className="space-y-3 max-w-3xl">
        <div className="text-xs font-semibold text-[#15803D]">{svcCms?.heroKicker || 'Services'}</div>
        <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">
          {svcCms?.heroTitle || '3D Printing, Engineering Project Development & UAV Services'}
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          {svcCms?.heroDescription ||
            'Upload CAD models for precision additive manufacturing, launch end-to-end engineering & academic projects, or book specialized UAV repair & diagnostics at our Nagpur workshop.'}
        </p>
      </div>

      {(svcCms?.bannerVideoUrl || svcCms?.bannerImageUrl) && (
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-[#111417] max-h-[420px]">
          {svcCms.bannerVideoUrl ? (
            <video
              src={svcCms.bannerVideoUrl}
              poster={svcCms.bannerImageUrl || undefined}
              controls
              playsInline
              preload="metadata"
              className="w-full max-h-[420px] object-cover"
            />
          ) : (
            <img
              src={svcCms.bannerImageUrl}
              alt={svcCms.heroTitle || 'NexusTekFusion Engineering Services'}
              referrerPolicy="no-referrer"
              className="w-full max-h-[420px] object-cover"
            />
          )}
        </div>
      )}

      {svcBanners.length > 0 && (
        <div className="space-y-4">
          {svcBanners.map((b) => (
            <div
              key={b.id ?? b.bannerKey}
              className="rounded-2xl border border-emerald-200 bg-white overflow-hidden grid grid-cols-1 lg:grid-cols-12 shadow-sm"
            >
              <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-[#15803D] font-semibold">
                  Service Spotlight
                </div>
                <h2 className="font-display text-2xl font-bold text-[#111417]">{b.title}</h2>
                {b.subtitle && <p className="text-sm text-slate-600 leading-relaxed">{b.subtitle}</p>}
                {b.ctaLabel && b.ctaLink && (
                  <div className="pt-1">
                    <button
                      onClick={() => navigate(b.ctaLink)}
                      className="px-4 py-2 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold rounded-lg inline-flex items-center gap-1.5"
                    >
                      {b.ctaLabel} <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
              {(b.videoUrl || b.imageUrl) && (
                <div className="lg:col-span-5 aspect-[16/9] lg:aspect-auto bg-slate-100">
                  {b.videoUrl ? (
                    <video
                      src={b.videoUrl}
                      poster={b.imageUrl || undefined}
                      controls
                      playsInline
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <img
                      src={b.imageUrl}
                      alt={b.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 items-stretch">
        {visibleServices.map((svc) => {
          const is3dPrinting = svc.slug === '3d-printing';
          const isProjectDev =
            svc.slug === 'custom-engineering-projects' || svc.slug === 'custom-engineering';
          const points = svc.benefits?.length
            ? svc.benefits
            : svc.capabilities?.length
            ? svc.capabilities
            : is3dPrinting
            ? PRINTING_3D_CAPABILITIES
            : isProjectDev
            ? PROJECT_DEVELOPMENT_CAPABILITIES
            : [];
          const defaultImg =
            svc.slug === 'drone-repair'
              ? '/src/assets/images/service_drone_repair_1794987205295.jpg'
              : '/src/assets/images/hero_nexustek_engineering_1794981062404.jpg';

          return (
            <div
              key={svc.slug}
              className={`rounded-2xl border ${
                is3dPrinting
                  ? 'border-slate-300 shadow-sm'
                  : isProjectDev
                  ? 'border-emerald-200 shadow-sm'
                  : 'border-slate-200'
              } bg-white overflow-hidden flex flex-col justify-between`}
            >
              <div>
                {/* CRITICAL: 3D Printing & Rapid Prototyping has NO large photograph; displays a crisp text-based & CAD-icon engineering header instead */}
                {is3dPrinting ? (
                  <div className="border-b border-slate-200 bg-[#111417] text-white p-6 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-[#15803D]/20 border border-[#15803D]/50 flex items-center justify-center shrink-0">
                        <Box className="w-6 h-6 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
                          Additive Manufacturing
                        </div>
                        <div className="text-sm font-semibold text-white">
                          FDM · Custom Parts · CAD Fabrication
                        </div>
                      </div>
                    </div>
                    <svg
                      viewBox="0 0 64 64"
                      aria-hidden="true"
                      className="w-12 h-12 text-slate-500 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <polygon points="32,6 56,20 56,44 32,58 8,44 8,20" />
                      <polyline points="8,20 32,34 56,20" />
                      <line x1="32" y1="34" x2="32" y2="58" />
                      <line x1="18" y1="38" x2="46" y2="38" strokeDasharray="3 3" />
                    </svg>
                  </div>
                ) : (
                  <div className="aspect-[16/9] bg-slate-900 overflow-hidden">
                    {svc.videoUrl ? (
                      <video
                        src={svc.videoUrl}
                        poster={svc.imageUrl || defaultImg}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src={svc.imageUrl || defaultImg}
                        alt={svc.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                )}

                <div className="p-6 sm:p-7 space-y-4">
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#15803D]">
                    {is3dPrinting ? (
                      <Layers className="w-3.5 h-3.5" />
                    ) : isProjectDev ? (
                      <ClipboardList className="w-3.5 h-3.5" />
                    ) : (
                      <Wrench className="w-3.5 h-3.5" />
                    )}
                    {is3dPrinting
                      ? 'Precision 3D Fabrication'
                      : isProjectDev
                      ? 'End-to-End Engineering Solutions'
                      : 'UAV Maintenance & Field Diagnostics'}
                  </div>

                  <h2 className="font-display text-2xl font-bold text-slate-950">{svc.title}</h2>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {svc.fullDesc || svc.shortDesc}
                  </p>

                  {points.length > 0 && (
                    <div className="space-y-2 pt-1">
                      <div className="text-xs font-semibold text-slate-800">
                        {is3dPrinting
                          ? 'Service scope includes:'
                          : isProjectDev
                          ? 'Project capabilities include:'
                          : 'Diagnostics & repair coverage:'}
                      </div>
                      <ul className="space-y-1.5 text-xs text-slate-700">
                        {points.map((pt) => (
                          <li key={pt} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D] shrink-0 mt-0.5" />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {is3dPrinting && (
                    <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                      Supported CAD formats: .STL · .OBJ · .3MF · .STEP/.STP · .IGES/.IGS
                    </div>
                  )}
                </div>
              </div>

              <div className="px-6 sm:px-7 pb-6 sm:pb-7 flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    navigate(
                      svc.ctaLink ||
                        (is3dPrinting
                          ? '/services/3d-printing'
                          : isProjectDev
                          ? '/register-project'
                          : '/services/drone-repair')
                    )
                  }
                  className={`flex-1 py-3 px-5 ${
                    is3dPrinting || isProjectDev
                      ? 'bg-[#15803D] hover:bg-[#166534]'
                      : 'bg-[#111417] hover:bg-[#1E242B]'
                  } text-white text-sm font-semibold rounded-lg inline-flex items-center justify-center gap-2`}
                >
                  {svc.ctaLabel ||
                    (is3dPrinting || isProjectDev ? 'Explore Service' : 'Book Drone Repair & Enquiry')}{' '}
                  <ArrowRight className="w-4 h-4" />
                </button>
                {svc.secondaryCtaLabel && svc.secondaryCtaLink && (
                  <button
                    onClick={() => navigate(svc.secondaryCtaLink!)}
                    className="py-3 px-4 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-sm font-semibold rounded-lg"
                  >
                    {svc.secondaryCtaLabel}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const CustomEngineeringServicePage: React.FC = () => {
  const { settings, navigate } = usePlatform();
  const svcCms = settings.cmsContent?.services;
  const customSvc = (svcCms?.services || settings.servicesCatalog || []).find(
    (s) => s.slug === 'custom-engineering'
  );
  const capabilities = customSvc?.capabilities?.length
    ? customSvc.capabilities
    : CUSTOM_ENGINEERING_CAPABILITIES;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-semibold text-[#15803D]">Primary Engineering Service</div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">
            {customSvc?.title || 'Custom Engineering Project Development & Prototyping'}
          </h1>
          <p className="text-slate-600 text-base leading-relaxed">
            {customSvc?.fullDesc || customSvc?.shortDesc || CUSTOM_ENGINEERING_DESCRIPTION}
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => navigate(customSvc?.ctaLink || '/register-project')}
              className="px-6 py-3 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2"
            >
              {customSvc?.ctaLabel || 'Register Your Project'} <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/services/drone-repair')}
              className="px-5 py-3 border border-slate-300 text-slate-800 text-sm font-semibold rounded-lg hover:bg-slate-100"
            >
              Drone Repair Service
            </button>
          </div>
        </div>
        <div className="lg:col-span-6">
          <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
            {customSvc?.videoUrl ? (
              <video
                src={customSvc.videoUrl}
                poster={customSvc.imageUrl || '/src/assets/images/hero_nexustek_engineering_1794981062404.jpg'}
                controls
                playsInline
                preload="metadata"
                className="w-full h-full object-cover"
              />
            ) : (
              <img
                src={customSvc?.imageUrl || '/src/assets/images/hero_nexustek_engineering_1794981062404.jpg'}
                alt={customSvc?.title || 'Custom Engineering Project Development & Prototyping'}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5">
        <h2 className="font-display text-2xl font-bold text-slate-950">
          Our Project Development Capabilities
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-slate-700">
          {capabilities.map((cap) => (
            <div key={cap} className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <CheckCircle2 className="w-4 h-4 text-[#15803D] shrink-0 mt-0.5" />
              <span className="font-medium text-slate-900">{cap}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-slate-800 bg-[#111417] text-white p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="text-xs font-semibold text-emerald-300">Transparent 50% + 50% Milestone Workflow</div>
          <h2 className="font-display text-2xl font-bold">
            Ready to build your prototype, academic project, or commercial product?
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Submit complete project requirements &amp; documents, receive a verified technical quotation from our engineers, pay 50% advance to start development, track weekly progress updates, and unlock final deliverables on 100% clearance.
          </p>
        </div>
        <button
          onClick={() => navigate('/register-project')}
          className="px-6 py-3 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-lg inline-flex items-center gap-2 shrink-0"
        >
          Register Your Project <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};


export const PcbServicePage: React.FC = () => {
  const { isSignedIn, dbUser, signInWithGoogle, apiFetch, notify, navigate } = usePlatform();
  const [form, setForm] = useState({
    customerName: dbUser?.fullName || '',
    email: dbUser?.email || '',
    mobile: dbUser?.mobile || '',
    boardDimensionsMm: '',
    layerCount: 2,
    boardQuantity: 5,
    assemblyRequired: false,
    surfaceFinish: 'HASL Lead-Free',
    specialInstructions: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      await signInWithGoogle();
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      files.forEach((f) => fd.append('attachments', f));

      const res = await apiFetch<{ enquiry: { enquiryNumber: string } }>('/api/pcb-enquiries', {
        method: 'POST',
        body: fd,
      });
      setSubmittedCode(res.enquiry.enquiryNumber);
      notify(`PCB enquiry ${res.enquiry.enquiryNumber} submitted for engineering quotation.`, 'success');
    } catch (err: any) {
      notify(err?.message || 'Failed to submit PCB enquiry.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-semibold text-[#15803D]">PCB Design & Fabrication</div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">
            Custom PCB Design, Gerber Review & Assembly
          </h1>
          <p className="text-slate-600 leading-relaxed">
            Submit your circuit diagrams, schematics, Gerber archives, and Bill of Materials (BOM). Our hardware engineers validate DFM tolerances and issue an itemized quotation and payment link — no unreliable automated guessing on complex multi-layer stackups.
          </p>
        </div>
        <div className="lg:col-span-6">
          <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
            <img
              src="/src/assets/images/service_pcb_electronics_1794981062614.jpg"
              alt="Multi-layer gold-plated PCB prototype"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {submittedCode ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 space-y-3">
          <h2 className="font-display text-xl font-bold text-[#111417]">
            PCB Enquiry Submitted — {submittedCode}
          </h2>
          <p className="text-sm text-slate-700">
            Our engineers are reviewing your files and specifications. Once quoted, you can pay directly from your Account Dashboard.
          </p>
          <button
            onClick={() => navigate('/my-account')}
            className="px-4 py-2 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold rounded-lg"
          >
            View in My Account
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-950">Request PCB Quotation</h2>
              <p className="text-xs text-slate-500">Upload Gerber (.zip/.gbr), schematics (.pdf), or BOM (.csv/.xlsx)</p>
            </div>
            {!isSignedIn && (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="px-4 py-2 bg-[#111417] text-white text-xs font-semibold rounded-lg"
              >
                Sign In to Submit
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              required
              placeholder="Full Name *"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
            />
            <input
              required
              type="email"
              placeholder="Email Address *"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
            />
            <input
              required
              placeholder="Mobile Number *"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Board Dimensions (mm) *</label>
              <input
                required
                placeholder="e.g. 100 x 80"
                value={form.boardDimensionsMm}
                onChange={(e) => setForm({ ...form, boardDimensionsMm: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Layer Count</label>
              <select
                value={form.layerCount}
                onChange={(e) => setForm({ ...form, layerCount: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
              >
                {[1, 2, 4, 6, 8].map((l) => (
                  <option key={l} value={l}>{l} Layers</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Board Quantity</label>
              <input
                type="number"
                min={1}
                value={form.boardQuantity}
                onChange={(e) => setForm({ ...form, boardQuantity: Number(e.target.value) })}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Surface Finish</label>
              <select
                value={form.surfaceFinish}
                onChange={(e) => setForm({ ...form, surfaceFinish: e.target.value })}
                className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
              >
                <option value="HASL Lead-Free">HASL Lead-Free</option>
                <option value="ENIG Gold">ENIG Gold</option>
                <option value="OSP">OSP</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={form.assemblyRequired}
              onChange={(e) => setForm({ ...form, assemblyRequired: e.target.checked })}
              className="rounded border-slate-300"
            />
            Include SMD / Through-Hole Component Assembly (PCBA)
          </label>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Upload Gerber / Schematics / BOM / Diagrams
            </label>
            <label className="flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-lg p-5 cursor-pointer hover:bg-slate-50 text-sm text-slate-600">
              <Upload className="w-4 h-4 text-[#15803D]" />
              <span>{files.length > 0 ? `${files.length} file(s) selected` : 'Select files (.zip, .gbr, .pdf, .csv, .xlsx, .png)'}</span>
              <input
                type="file"
                multiple
                accept=".zip,.rar,.gbr,.gerber,.pdf,.csv,.xlsx,.png,.jpg,.jpeg"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="hidden"
              />
            </label>
          </div>

          <textarea
            rows={4}
            placeholder="Special instructions, impedance requirements, copper weight, or design scope..."
            value={form.specialInstructions}
            onChange={(e) => setForm({ ...form, specialInstructions: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
          />

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-[#15803D] hover:bg-[#166534] text-white text-sm font-semibold rounded-lg disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : isSignedIn ? 'Submit PCB Quotation Request' : 'Sign In & Submit Request'}
          </button>
        </form>
      )}
    </div>
  );
};

export const DroneRepairServicePage: React.FC = () => {
  const { isSignedIn, dbUser, signInWithGoogle, apiFetch, notify, navigate } = usePlatform();
  const [form, setForm] = useState({
    serviceMode: 'service_centre' as 'service_centre' | 'field_visit',
    customerName: dbUser?.fullName || '',
    mobile: dbUser?.mobile || '',
    email: dbUser?.email || '',
    address: '',
    city: '',
    district: '',
    pinCode: '',
    droneBrandModel: '',
    droneType: 'Agriculture',
    problemDescription: '',
    preferredDate: '',
    preferredTime: 'Morning (10 AM - 1 PM)',
    additionalInfo: '',
  });
  const [photos, setPhotos] = useState<File[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSignedIn) {
      await signInWithGoogle();
      return;
    }
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
      photos.forEach((f) => fd.append('photos', f));
      if (video) fd.append('video', video);

      const res = await apiFetch<{ booking: { referenceNumber: string } }>('/api/drone-repairs', {
        method: 'POST',
        body: fd,
      });
      setSubmittedRef(res.booking.referenceNumber);
      notify(`Drone repair booking ${res.booking.referenceNumber} logged.`, 'success');
    } catch (err: any) {
      notify(err?.message || 'Failed to submit drone repair booking.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-4">
          <div className="text-xs font-semibold text-[#15803D]">UAV Diagnostics &amp; Maintenance</div>
          <h1 className="font-display text-4xl font-bold tracking-tight text-slate-950">
            Drone Repair, Calibration &amp; Field Support
          </h1>
          <p className="text-slate-600 leading-relaxed">
            Book Nagpur Service Centre bench diagnostics or request an on-site field visit for agricultural spraying drones, mapping UAVs, and industrial multirotors. Inspection charges and itemized repair quotations are approved directly in your dashboard.
          </p>
        </div>
        <div className="lg:col-span-6">
          <div className="aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
            <img
              src="/src/assets/images/service_drone_repair_1794987205295.jpg"
              alt="Drone repair workbench diagnostics"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {submittedRef ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-8 space-y-3">
          <h2 className="font-display text-xl font-bold text-[#111417]">
            Repair Booking Confirmed — {submittedRef}
          </h2>
          <p className="text-sm text-slate-700">
            Your UAV diagnostics booking has been queued for our Nagpur engineering team. Track technician assignment and quotes from your account.
          </p>
          <button
            onClick={() => navigate('/my-account')}
            className="px-4 py-2 bg-[#15803D] hover:bg-[#166534] text-white text-xs font-semibold rounded-lg"
          >
            View Repair Status in My Account
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 space-y-6">
          <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-xl font-bold text-slate-950">Book Drone Repair Service</h2>
              <p className="text-xs text-slate-500">Upload clear photos/video of crash damage, wiring faults, or ESC errors</p>
            </div>
            {!isSignedIn && (
              <button
                type="button"
                onClick={signInWithGoogle}
                className="px-4 py-2 bg-[#111417] text-white text-xs font-semibold rounded-lg"
              >
                Sign In to Book Repair
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              ['service_centre', 'Nagpur Service Centre Drop-off / Courier', 'Send or bring UAV to our Ganjipeth, Nagpur workshop'],
              ['field_visit', 'On-Site Field Technician Visit', 'Request engineer dispatch for farm or industrial fleet UAVs'],
            ].map(([mode, title, desc]) => (
              <button
                key={mode}
                type="button"
                onClick={() => setForm({ ...form, serviceMode: mode as 'service_centre' | 'field_visit' })}
                className={`text-left rounded-xl border p-4 transition-colors ${
                  form.serviceMode === mode ? 'border-[#15803D] bg-emerald-50' : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="font-semibold text-sm text-[#111417]">{title}</div>
                <div className="text-xs text-slate-600 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              required
              placeholder="Customer Name *"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
            />
            <input
              required
              placeholder="Mobile Number *"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <input
              required
              placeholder="Drone Brand / Model *"
              value={form.droneBrandModel}
              onChange={(e) => setForm({ ...form, droneBrandModel: e.target.value })}
              className="sm:col-span-2 rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
            />
            <select
              value={form.droneType}
              onChange={(e) => setForm({ ...form, droneType: e.target.value })}
              className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm bg-white"
            >
              <option value="Agriculture">Agricultural Spraying Drone</option>
              <option value="Survey / Mapping">Mapping / Survey UAV</option>
              <option value="FPV / Custom">Custom / FPV Multirotor</option>
              <option value="Industrial">Industrial Inspection UAV</option>
            </select>
            <input
              type="date"
              value={form.preferredDate}
              onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
              className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <input
              placeholder="Address / Farm Location"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="sm:col-span-2 rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
            />
            <input
              placeholder="City / District"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value, district: e.target.value })}
              className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
            />
            <input
              placeholder="PIN Code"
              value={form.pinCode}
              onChange={(e) => setForm({ ...form, pinCode: e.target.value })}
              className="rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono"
            />
          </div>

          <textarea
            required
            rows={4}
            placeholder="Describe fault symptoms, crash damage, flight controller errors, pump/nozzle or ESC issues *"
            value={form.problemDescription}
            onChange={(e) => setForm({ ...form, problemDescription: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-lg p-4 cursor-pointer hover:bg-slate-50 text-xs text-slate-600">
              <Upload className="w-4 h-4 text-[#15803D]" />
              <span>{photos.length > 0 ? `${photos.length} photo(s) selected` : 'Upload Damage Photos (max 5)'}</span>
              <input
                type="file"
                multiple
                accept=".png,.jpg,.jpeg,.webp"
                onChange={(e) => setPhotos(Array.from(e.target.files || []))}
                className="hidden"
              />
            </label>
            <label className="flex items-center justify-center gap-2 border border-dashed border-slate-300 rounded-lg p-4 cursor-pointer hover:bg-slate-50 text-xs text-slate-600">
              <Upload className="w-4 h-4 text-[#15803D]" />
              <span>{video ? video.name : 'Upload Diagnostic Video (optional)'}</span>
              <input
                type="file"
                accept=".mp4,.mov"
                onChange={(e) => setVideo(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 bg-[#111417] hover:bg-[#1E242B] text-white text-sm font-semibold rounded-lg disabled:opacity-50"
          >
            {submitting ? 'Submitting Booking...' : isSignedIn ? 'Submit Drone Repair Request' : 'Sign In & Submit Request'}
          </button>
        </form>
      )}
    </div>
  );
};

