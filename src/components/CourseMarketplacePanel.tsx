import React, { useState } from "react";
import { useEntitlements } from "../context/EntitlementsContext";
import { createPurchase, submitReport, upsertCourse, upsertCreatorProfile } from "../services/marketplace";

export default function CourseMarketplacePanel() {
  const { uid } = useEntitlements();

  const [creatorName, setCreatorName] = useState("");
  const [creatorBio, setCreatorBio] = useState("");
  const [payoutProvider, setPayoutProvider] = useState("manual");
  const [payoutAccount, setPayoutAccount] = useState("");

  const [courseTitle, setCourseTitle] = useState("");
  const [courseDesc, setCourseDesc] = useState("");
  const [priceCents, setPriceCents] = useState("4999");
  const [currency, setCurrency] = useState("USD");
  const [visibility, setVisibility] = useState<"draft"|"public"|"unlisted">("public");
  const [tags, setTags] = useState("forex,price action");
  const [refundPolicy, setRefundPolicy] = useState("All sales final unless required by law.");
  const [disclosures, setDisclosures] = useState("Educational content only. Not financial advice.");
  const [proofLinks, setProofLinks] = useState("");

  const [courseId, setCourseId] = useState("");
  const [purchaseCourseId, setPurchaseCourseId] = useState("");
  const [reportCourseId, setReportCourseId] = useState("");
  const [reportUid, setReportUid] = useState("");
  const [reportReason, setReportReason] = useState("SCAM");
  const [reportDetails, setReportDetails] = useState("");

  const [msg, setMsg] = useState<string|null>(null);

  async function saveCreator() {
    setMsg(null);
    if (!uid) return setMsg("Sign in required.");
    await upsertCreatorProfile({
      displayName: creatorName,
      bio: creatorBio,
      payoutProvider,
      payoutProviderAccountId: payoutAccount,
      termsAcceptedAt: Date.now(),
    });
    setMsg("✅ Creator profile saved.");
  }

  async function saveCourse() {
    setMsg(null);
    if (!uid) return setMsg("Sign in required.");
    const r: any = await upsertCourse({
      courseId: courseId || undefined,
      title: courseTitle,
      description: courseDesc,
      priceCents: Number(priceCents),
      currency,
      visibility,
      tags: tags.split(",").map(s=>s.trim()).filter(Boolean),
      transparency: {
        refundPolicy,
        disclosures,
        proofLinks: proofLinks.split(",").map(s=>s.trim()).filter(Boolean),
      },
    });
    setCourseId(r.courseId);
    setMsg(`✅ Course saved. courseId=${r.courseId}`);
  }

  async function buy() {
    setMsg(null);
    if (!uid) return setMsg("Sign in required.");
    const r: any = await createPurchase(purchaseCourseId);
    setMsg(`✅ Purchase recorded. Gross=${r.grossCents} | Creator(80%)=${r.creatorCents} | Platform(20%)=${r.platformCents}`);
  }

  async function report() {
    setMsg(null);
    const r: any = await submitReport({
      courseId: reportCourseId || null,
      reportedUid: reportUid || null,
      reason: reportReason,
      details: reportDetails,
      evidenceLinks: [],
    });
    setMsg(`✅ Report submitted. reportId=${r.reportId}`);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-black/40 p-5">
      <div className="text-lg font-semibold text-white">Course Marketplace (80/20 Split + Transparency + Anti-Scam)</div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Creator */}
        <div className="rounded-xl border border-white/10 bg-black/60 p-3">
          <div className="text-sm font-semibold text-white">Creator Profile</div>
          <Field label="Display Name" value={creatorName} onChange={setCreatorName}/>
          <Field label="Bio" value={creatorBio} onChange={setCreatorBio}/>
          <Field label="Payout Provider (manual/stripe/paypal)" value={payoutProvider} onChange={setPayoutProvider}/>
          <Field label="Payout Account ID" value={payoutAccount} onChange={setPayoutAccount}/>
          <button onClick={saveCreator}
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
          >
            Save Creator Profile
          </button>
          <div className="mt-2 text-xs text-white/60">
            Policy: If you sell a course through AI Quantum Charts, revenue is split **80% creator / 20% platform**,
            and you must provide **transparent disclosures** + refund policy.
          </div>
        </div>

        {/* Course */}
        <div className="rounded-xl border border-white/10 bg-black/60 p-3">
          <div className="text-sm font-semibold text-white">Create / Update Course</div>
          <Field label="CourseId (blank = new)" value={courseId} onChange={setCourseId}/>
          <Field label="Title" value={courseTitle} onChange={setCourseTitle}/>
          <Field label="Description" value={courseDesc} onChange={setCourseDesc}/>
          <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
            <Field label="Price Cents" value={priceCents} onChange={setPriceCents}/>
            <Field label="Currency" value={currency} onChange={setCurrency}/>
            <Select label="Visibility" value={visibility} options={["draft","public","unlisted"]} onChange={(v)=>setVisibility(v as any)}/>
          </div>
          <Field label="Tags (comma)" value={tags} onChange={setTags}/>
          <Field label="Refund Policy" value={refundPolicy} onChange={setRefundPolicy}/>
          <Field label="Disclosures" value={disclosures} onChange={setDisclosures}/>
          <Field label="Proof Links (comma)" value={proofLinks} onChange={setProofLinks}/>
          <div className="mt-2 text-xs text-white/60">
            Split is locked: **80/20**. Purchases create an immutable ledger + payout record.
          </div>
          <button onClick={saveCourse}
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
          >
            Save Course
          </button>
        </div>
      </div>

      {/* Buy + Report */}
      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/60 p-3">
          <div className="text-sm font-semibold text-white">Purchase</div>
          <Field label="CourseId to buy" value={purchaseCourseId} onChange={setPurchaseCourseId}/>
          <button onClick={buy}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
          >
            Buy (record ledger)
          </button>
          <div className="mt-2 text-xs text-white/60">
            This records purchase + payout ledger now. Payment processor wiring can be added next.
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/60 p-3">
          <div className="text-sm font-semibold text-white">Report Scam / Fraud</div>
          <Field label="CourseId (optional)" value={reportCourseId} onChange={setReportCourseId}/>
          <Field label="Reported UID (optional)" value={reportUid} onChange={setReportUid}/>
          <Field label="Reason" value={reportReason} onChange={setReportReason}/>
          <div className="mt-2">
            <div className="text-xs text-white/60">Details</div>
            <textarea value={reportDetails} onChange={(e)=>setReportDetails(e.target.value)}
              className="mt-1 h-20 w-full rounded-xl border border-white/10 bg-black/70 p-3 text-sm text-white outline-none"
            />
          </div>
          <button onClick={report}
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-sm font-semibold text-white hover:bg-white/15"
          >
            Submit Report
          </button>
          <div className="mt-2 text-xs text-white/60">
            Abuse defense: we store **hashed IP** (not raw) + audit trail. Repeat abusers can be banned.
          </div>
        </div>
      </div>

      {msg && <div className="mt-3 text-sm text-white/80">{msg}</div>}
    </div>
  );
}

function Field(props:{label:string; value:string; onChange:(v:string)=>void}) {
  return (
    <div className="mt-2">
      <div className="text-xs text-white/60">{props.label}</div>
      <input value={props.value} onChange={(e)=>props.onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none"
      />
    </div>
  );
}

function Select(props:{label:string; value:string; options:string[]; onChange:(v:string)=>void}) {
  return (
    <div className="mt-2">
      <div className="text-xs text-white/60">{props.label}</div>
      <select value={props.value} onChange={(e)=>props.onChange(e.target.value)}
        className="mt-1 w-full rounded-xl border border-white/10 bg-black/70 px-3 py-2 text-white outline-none"
      >
        {props.options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}
