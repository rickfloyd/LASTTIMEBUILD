import { useState } from "react";
import { createTeam, addMember } from "../services/teams";

export default function TeamWorkspacePanel(){
  const [name,setName]=useState(""); const [teamId,setTeamId]=useState("");
  const [member,setMember]=useState(""); const [role,setRole]=useState("editor");
  return (
    <div className="p-4 border border-white/10 rounded-xl bg-black/40">
      <div className="text-white font-semibold">27) Team Workspaces</div>
      <input className="mt-2 w-full p-2 bg-black border" placeholder="Team name" value={name} onChange={e=>setName(e.target.value)} />
      <button className="mt-2 w-full p-2 bg-white/10" onClick={async()=>{        const r:any=await createTeam(name); setTeamId(r.data.teamId);
      }}>Create Team</button>
      <div className="mt-3 text-xs text-white/70">TeamId: {teamId}</div>
      <input className="mt-2 w-full p-2 bg-black border" placeholder="Member UID" value={member} onChange={e=>setMember(e.target.value)} />
      <select className="mt-1 w-full p-2 bg-black border" value={role} onChange={e=>setRole(e.target.value)}>
        <option>viewer</option><option>editor</option><option>admin</option>
      </select>
      <button className="mt-2 w-full p-2 bg-white/10" onClick={()=>addMember(teamId,member,role)}>Add Member</button>
    </div>
  );
}
