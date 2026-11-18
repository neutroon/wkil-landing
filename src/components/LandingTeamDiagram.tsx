import type { CSSProperties } from "react";
import type { LandingCopy, LandingTeamMember } from "@/types/landing";
import { memberHue } from "./team-hues";

interface LandingTeamDiagramProps {
  channels: string[];
  diagram: LandingCopy["diagram"];
  members: LandingTeamMember[];
}

function hueStyle(key: string, index = 0): CSSProperties {
  return {
    "--member-hue": memberHue(key),
    "--member-index": index,
  } as CSSProperties;
}

/**
 * The product in one picture: the owner talks to the manager, the manager hands
 * work to the team, and the team serves the owner's customers. The description
 * lives in the figure's label, so the moving parts are hidden from assistive tech.
 */
export function LandingTeamDiagram({
  channels,
  diagram,
  members,
}: LandingTeamDiagramProps) {
  const manager = members.find((member) => member.key === "manager");
  const employees = members.filter((member) => member.key !== "manager");

  return (
    <figure className="team-diagram" aria-label={diagram.ariaLabel} role="img">
      <div className="diagram-node diagram-node-you" aria-hidden="true">
        <strong>{diagram.you}</strong>
        <span>{diagram.youHint}</span>
      </div>

      <span className="diagram-link" aria-hidden="true" />

      <div className="diagram-node diagram-node-manager" aria-hidden="true">
        <strong>{manager?.name}</strong>
        <span>{diagram.managerHint}</span>
      </div>

      <span className="diagram-link diagram-link-late" aria-hidden="true" />

      <div className="diagram-team" aria-hidden="true">
        <span className="diagram-label">{diagram.teamLabel}</span>
        <ul>
          {employees.map((member, index) => (
            <li
              className={
                member.key === "custom"
                  ? "diagram-member diagram-member-custom"
                  : "diagram-member"
              }
              key={member.key}
              style={hueStyle(member.key, index)}
            >
              <span className="member-dot" />
              {member.name}
            </li>
          ))}
        </ul>
      </div>

      <span className="diagram-link diagram-link-later" aria-hidden="true" />

      <div className="diagram-node diagram-node-customers" aria-hidden="true">
        <strong>{diagram.customers}</strong>
        <span>{diagram.customersHint}</span>
        <ul className="diagram-channels">
          {channels.map((channel) => (
            <li key={channel}>{channel}</li>
          ))}
        </ul>
      </div>
    </figure>
  );
}
