// src/pages/IdeaPage.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getIdeaByDirectToken } from "../services/communityService";
import { Idea } from "../types/community";

const IdeaPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [idea, setIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getIdeaByDirectToken(token)
        .then((res) => {
          setIdea(res);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [token]);

  if (loading) {
    return (
      <div className="bg-deep-black min-h-screen flex items-center justify-center text-pulsing-cyan">
        Loading idea...
      </div>
    );
  }

  if (!idea) {
    return (
      <div className="bg-deep-black min-h-screen flex items-center justify-center text-fluorescent-pink">
        This private idea link is invalid or has expired.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-charcoal-gradient text-white px-4 md:px-10 py-6">
      <div className="bg-deep-black/70 border border-fluorescent-pink/40 rounded-2xl p-4 md:p-6 shadow-neon-blue max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold text-fluorescent-pink mb-2">
          {idea.title}
        </h1>
        <div className="text-xs text-pulsing-cyan mb-4">
          Shared via private link
        </div>
        <div className="prose prose-invert max-w-none text-gray-300">
            {idea.content}
        </div>
      </div>
    </div>
  );
};

export default IdeaPage;