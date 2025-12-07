// src/pages/CommunityPage.tsx
import React, { useEffect, useState } from "react";
import {
  listPublicIdeas,
  listPublicScripts,
  listPublishedCourses,
  listLiveStreams,
  createIdea,
  publishScript,
  createCourseDraft,
  startLiveStream,
} from "../services/communityService";
import {
  Idea,
  Script,
  Course,
  LiveStream,
  IdeaVisibility,
  ScriptVisibility,
} from "../types/community";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

type TabKey = "ideas" | "scripts" | "live" | "courses";

const CommunityPage: React.FC = () => {
  const [user] = useAuthState(auth);
  const [activeTab, setActiveTab] = useState<TabKey>("ideas");

  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [scripts, setScripts] = useState<Script[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [streams, setStreams] = useState<LiveStream[]>([]);

  // Simple form states
  const [ideaTitle, setIdeaTitle] = useState("");
  const [ideaContent, setIdeaContent] = useState("");
  const [ideaVisibility, setIdeaVisibility] = useState<IdeaVisibility>("public");

  const [scriptName, setScriptName] = useState("");
  const [scriptDesc, setScriptDesc] = useState("");
  const [scriptVisibility, setScriptVisibility] =
    useState<ScriptVisibility>("open");

  const [courseTitle, setCourseTitle] = useState("");
  const [courseTagline, setCourseTagline] = useState("");
  const [coursePrice, setCoursePrice] = useState(99);

  const [liveTitle, setLiveTitle] = useState("");
  const [liveDesc, setLiveDesc] = useState("");

  const [loading, setLoading] = useState(false);

  // Load all community feeds
  useEffect(() => {
    async function loadAll() {
      const [ideasRes, scriptsRes, coursesRes, streamsRes] = await Promise.all([
        listPublicIdeas(),
        listPublicScripts(),
        listPublishedCourses(),
        listLiveStreams(),
      ]);
      setIdeas(ideasRes);
      setScripts(scriptsRes);
      setCourses(coursesRes);
      setStreams(streamsRes);
    }
    loadAll().catch(console.error);
  }, []);

  const requireAuth = () => {
    if (!user) {
      alert("You need to be logged in to do this.");
      return false;
    }
    return true;
  };

  async function handleCreateIdea() {
    if (!requireAuth()) return;
    if (!ideaTitle.trim() || !ideaContent.trim()) return;

    setLoading(true);
    try {
      const newIdea = await createIdea({
        authorId: user!.uid,
        title: ideaTitle.trim(),
        content: ideaContent.trim(),
        visibility: ideaVisibility,
      });
      setIdeas((prev) => [newIdea, ...prev]);
      setIdeaTitle("");
      setIdeaContent("");
    } catch (err) {
      console.error(err);
      alert("Could not create idea.");
    } finally {
      setLoading(false);
    }
  }

  async function handlePublishScript() {
    if (!requireAuth()) return;
    if (!scriptName.trim() || !scriptDesc.trim()) return;

    setLoading(true);
    try {
      const newScript = await publishScript({
        authorId: user!.uid,
        name: scriptName.trim(),
        description: scriptDesc.trim(),
        visibility: scriptVisibility,
        sourceCode: "// your pine/JS code here",
      });
      setScripts((prev) => [newScript, ...prev]);
      setScriptName("");
      setScriptDesc("");
    } catch (err) {
      console.error(err);
      alert("Could not publish script.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateCourse() {
    if (!requireAuth()) return;
    if (!courseTitle.trim() || !courseTagline.trim()) return;

    setLoading(true);
    try {
      const newCourse = await createCourseDraft({
        authorId: user!.uid,
        title: courseTitle.trim(),
        tagline: courseTagline.trim(),
        description:
          "You can expand this course description in the full editor later.",
        level: "intermediate",
        priceUsd: coursePrice,
      });
      setCourses((prev) => [newCourse, ...prev]);
      setCourseTitle("");
      setCourseTagline("");
    } catch (err) {
      console.error(err);
      alert("Could not create course.");
    } finally {
      setLoading(false);
    }
  }

  async function handleStartLive() {
    if (!requireAuth()) return;
    if (!liveTitle.trim()) return;

    setLoading(true);
    try {
      const newStream = await startLiveStream({
        hostId: user!.uid,
        title: liveTitle.trim(),
        description: liveDesc.trim(),
      });
      setStreams((prev) => [newStream, ...prev]);
      setLiveTitle("");
      setLiveDesc("");
    } catch (err) {
      console.error(err);
      alert("Could not start stream.");
    } finally {
      setLoading(false);
    }
  }

  const neonTabClasses = (tab: TabKey) =>
    `px-4 py-2 rounded-full text-sm font-semibold cursor-pointer transition-all duration-300 ${
      activeTab === tab
        ? "bg-fluorescent-gradient text-deep-black shadow-neon-pink"
        : "bg-deep-black text-pulsing-cyan border border-fluorescent-pink/40 hover:border-fluorescent-pink"
    }`;

  return (
    <div className="min-h-screen bg-charcoal-gradient text-white px-4 md:px-10 py-6">
      <h1 className="text-3xl md:text-4xl font-extrabold text-fluorescent-pink mb-2">
        Quantum Community
      </h1>
      <p className="text-sm md:text-base text-pulsing-cyan mb-6">
        Ideas, scripts, live streams, and courses that let traders{", " "}
        <span className="text-electric-yellow font-bold">
          outrun TradingView
        </span>
        .
      </p>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button className={neonTabClasses("ideas")} onClick={() => setActiveTab("ideas")}>
          Ideas
        </button>
        <button
          className={neonTabClasses("scripts")}
          onClick={() => setActiveTab("scripts")}
        >
          Scripts
        </button>
        <button className={neonTabClasses("live")} onClick={() => setActiveTab("live")}>
          Live
        </button>
        <button
          className={neonTabClasses("courses")}
          onClick={() => setActiveTab("courses")}
        >
          Courses (90/10)
        </button>
      </div>

      {/* Active tab content */}
      <div className="bg-deep-black/70 border border-fluorescent-pink/40 rounded-2xl p-4 md:p-6 shadow-neon-blue">
        {activeTab === "ideas" && (
          <>
            <div className="mb-4 grid gap-3 md:grid-cols-[2fr,1fr]">
              <div>
                <input
                  className="w-full mb-2 px-3 py-2 rounded-md bg-charcoal text-white text-sm border border-pulsing-cyan/40 focus:outline-none focus:border-pulsing-cyan"
                  placeholder="Idea title (e.g. BTC range breakout)"
                  value={ideaTitle}
                  onChange={(e) => setIdeaTitle(e.target.value)}
                />
                <textarea
                  className="w-full h-24 px-3 py-2 rounded-md bg-charcoal text-white text-sm border border-pulsing-cyan/40 focus:outline-none focus:border-pulsing-cyan"
                  placeholder="Share your chart reasoning, entry, stop, targets..."
                  value={ideaContent}
                  onChange={(e) => setIdeaContent(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                  <span className="text-xs uppercase tracking-wide text-text-secondary">
                    Visibility:
                  </span>
                  <select
                    className="flex-1 bg-deep-black border border-fluorescent-pink/60 rounded-md text-sm px-2 py-1"
                    value={ideaVisibility}
                    onChange={(e) =>
                      setIdeaVisibility(e.target.value as IdeaVisibility)
                    }
                  >
                    <option value="public">Public (community feed)</option>
                    <option value="private">Private (direct link only)</option>
                  </select>
                </div>
                <button
                  disabled={loading}
                  onClick={handleCreateIdea}
                  className="mt-auto px-4 py-2 rounded-lg bg-fluorescent-pink text-deep-black font-semibold shadow-neon-pink hover:bg-hot-pink disabled:opacity-50"
                >
                  {loading ? "Posting..." : "Post Idea"}
                </button>
              </div>
            </div>

            <h2 className="text-lg font-bold mb-3 text-electric-purple">
              Community Ideas
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {ideas.map((idea) => (
                <div
                  key={idea.id}
                  className="bg-charcoal border border-pulsing-cyan/40 rounded-xl p-3 hover:border-fluorescent-pink/80 transition-all duration-200"
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-fluorescent-pink">
                      {idea.title}
                    </h3>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-deep-black border border-fluorescent-pink/50 text-text-secondary uppercase">
                      {idea.visibility === "public" ? "Public" : "Private Link"}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mb-2 line-clamp-3">
                    {idea.content}
                  </p>
                  <div className="text-[10px] text-pulsing-cyan">
                    ❤️ {idea.likeCount} · 💬 {idea.commentCount}
                  </div>
                </div>
              ))}
              {ideas.length === 0 && (
                <div className="text-sm text-text-secondary">
                  No ideas yet. Be the first to plant a flag.
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "scripts" && (
          <>
            <div className="mb-4 grid gap-3 md:grid-cols-[2fr,1fr]">
              <div>
                <input
                  className="w-full mb-2 px-3 py-2 rounded-md bg-charcoal text-white text-sm border border-electric-purple/60 focus:outline-none focus:border-electric-purple"
                  placeholder="Script name (e.g. Quantum Ladder v3)"
                  value={scriptName}
                  onChange={(e) => setScriptName(e.target.value)}
                />
                <textarea
                  className="w-full h-24 px-3 py-2 rounded-md bg-charcoal text-white text-sm border border-electric-purple/60 focus:outline-none focus:border-electric-purple"
                  placeholder="Describe what this script does for traders..."
                  value={scriptDesc}
                  onChange={(e) => setScriptDesc(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2 items-center">
                  <span className="text-xs uppercase tracking-wide text-text-secondary">
                    Visibility:
                  </span>
                  <select
                    className="flex-1 bg-deep-black border border-electric-purple/80 rounded-md text-sm px-2 py-1"
                    value={scriptVisibility}
                    onChange={(e) =>
                      setScriptVisibility(e.target.value as ScriptVisibility)
                    }
                  >
                    <option value="open">Open (code visible)</option>
                    <option value="protected">
                      Protected (usable, code hidden)
                    </option>
                    <option value="invite-only">
                      Invite-Only (manual access)
                    </option>
                  </select>
                </div>
                <button
                  disabled={loading}
                  onClick={handlePublishScript}
                  className="mt-auto px-4 py-2 rounded-lg bg-electric-purple text-white font-semibold shadow-neon-blue hover:bg-hot-pink disabled:opacity-50"
                >
                  {loading ? "Publishing..." : "Publish Script"}
                </button>
              </div>
            </div>

            <h2 className="text-lg font-bold mb-3 text-electric-purple">
              Public Script Library
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {scripts.map((script) => (
                <div
                  key={script.id}
                  className="bg-charcoal border border-electric-purple/50 rounded-xl p-3 hover:border-fluorescent-pink/80 transition-all duration-200"
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-fluorescent-pink">
                      {script.name}
                    </h3>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-deep-black border border-electric-purple/70 text-text-secondary uppercase">
                      {script.visibility}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mb-2 line-clamp-3">
                    {script.description}
                  </p>
                  <div className="text-[10px] text-pulsing-cyan">
                    ⭐ {script.likeCount} · ⚙️ {script.useCount} uses
                  </div>
                </div>
              ))}
              {scripts.length === 0 && (
                <div className="text-sm text-text-secondary">
                  No scripts yet. This is your chance to drop the first nuke.
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "live" && (
          <>
            <div className="mb-4 grid gap-3 md:grid-cols-[2fr,1fr]">
              <div>
                <input
                  className="w-full mb-2 px-3 py-2 rounded-md bg-charcoal text-white text-sm border border-neon-green/70 focus:outline-none focus:border-neon-green"
                  placeholder="Stream title (e.g. London Open Breakdown)"
                  value={liveTitle}
                  onChange={(e) => setLiveTitle(e.target.value)}
                />
                <textarea
                  className="w-full h-24 px-3 py-2 rounded-md bg-charcoal text-white text-sm border border-neon-green/70 focus:outline-none focus:border-neon-green"
                  placeholder="Tell viewers what you’ll cover, pairs, risk, style..."
                  value={liveDesc}
                  onChange={(e) => setLiveDesc(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-xs text-text-secondary">
                  <span className="font-semibold text-neon-green">
                    Everyone
                  </span>{" "}
                  can go live. Later we’ll plug this into RTMP / YouTube /
                  Twitch, but the community & permissions are ready now.
                </p>
                <button
                  disabled={loading}
                  onClick={handleStartLive}
                  className="mt-auto px-4 py-2 rounded-lg bg-neon-green text-deep-black font-semibold shadow-neon-blue hover:bg-electric-yellow disabled:opacity-50"
                >
                  {loading ? "Starting..." : "Go Live"}
                </button>
              </div>
            </div>

            <h2 className="text-lg font-bold mb-3 text-neon-green">
              Live Streams
            </h2>
            <div className="grid gap-3 md:grid-cols-2">
              {streams.map((s) => (
                <div
                  key={s.id}
                  className="bg-charcoal border border-neon-green/60 rounded-xl p-3"
                >
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-semibold text-neon-green">{s.title}</h3>
                    <span className="text-[10px] px-2 py-1 rounded-full bg-deep-black border border-neon-green/80 text-text-secondary uppercase">
                      {s.isLive ? "LIVE" : "Ended"}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mb-2 line-clamp-3">
                    {s.description}
                  </p>
                  <div className="text-[10px] text-pulsing-cyan">
                    👁 {s.concurrentViewers} watching now
                  </div>
                </div>
              ))}
              {streams.length === 0 && (
                <div className="text-sm text-text-secondary">
                  No one is live yet. Flip the switch and take first blood.
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "courses" && (
          <>
            <div className="mb-4 grid gap-3 md:grid-cols-[2fr,1fr]">
              <div>
                <input
                  className="w-full mb-2 px-3 py-2 rounded-md bg-charcoal text-white text-sm border border-electric-orange/70 focus:outline-none focus:border-electric-orange"
                  placeholder="Course title (e.g. Smart Money Gold Mastery)"
                  value={courseTitle}
                  onChange={(e) => setCourseTitle(e.target.value)}
                />
                <input
                  className="w-full mb-2 px-3 py-2 rounded-md bg-charcoal text-white text-sm border border-electric-orange/70 focus:outline-none focus:border-electric-orange"
                  placeholder="Tagline (e.g. 8-week roadmap from basics to funded)"
                  value={courseTagline}
                  onChange={(e) => setCourseTagline(e.target.value)}
                />
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-secondary">Price:</span>
                  <input
                    type="number"
                    className="w-24 px-2 py-1 rounded-md bg-deep-black text-sm border border-electric-orange/70"
                    value={coursePrice}
                    onChange={(e) => setCoursePrice(Number(e.target.value))}
                  />
                  <span className="text-xs text-text-secondary">USD</span>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <div className="text-xs text-text-secondary bg-deep-black/70 border border-electric-yellow/60 rounded-md p-3">
                  <div className="font-semibold text-electric-yellow mb-1">
                    90 / 10 Profit Split
                  </div>
                  <p>
                    Verified traders keep{", " "}
                    <span className="font-bold text-neon-green">90%</span> of
                    every sale. Quantum takes{", " "}
                    <span className="font-bold text-hot-pink">10%</span> to keep
                    the lights on and fund scholarships.
                  </p>
                </div>
                <button
                  disabled={loading}
                  onClick={handleCreateCourse}
                  className="mt-auto px-4 py-2 rounded-lg bg-electric-orange text-deep-black font-semibold shadow-neon-orange hover:bg-electric-yellow disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Create Course Draft"}
                </button>
              </div>
            </div>

            <h2 className="text-lg font-bold mb-3 text-electric-orange">
              Marketplace Courses
            </h2>
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-charcoal border border-electric-orange/60 rounded-xl p-3"
                >
                  <h3 className="font-semibold text-electric-yellow mb-1">
                    {course.title}
                  </h3>
                  <p className="text-xs text-text-secondary mb-1">
                    {course.tagline}
                  </p>
                  <div className="flex justify-between items-center text-[11px] text-pulsing-cyan">
                    <span>${course.priceUsd.toFixed(2)}</span>
                    <span>
                      {course.studentCount} student
                      {course.studentCount === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <div className="text-sm text-text-secondary">
                  No courses yet. First verified trader to launch here gets the
                  loudest spotlight.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CommunityPage;
