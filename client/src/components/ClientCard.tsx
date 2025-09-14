import React from "react";

interface ClientCardProps {
  id: string;
  name: string;
  gender: string;
  profession: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export default function ClientCard({
  id,
  name,
  gender,
  profession,
  isSelected = false,
  onClick,
}: ClientCardProps) {
  return (
    <div
      className={`client-card ${isSelected ? "client-card--selected" : ""}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
    >
      <div className="client-card__avatar">{name.charAt(0).toUpperCase()}</div>
      <div className="client-card__info">
        <h3 className="client-card__name">{name}</h3>
        <p className="client-card__details">
          <span className="client-card__gender">{gender}</span>
          <span className="client-card__separator">•</span>
          <span className="client-card__profession">{profession}</span>
        </p>
      </div>
    </div>
  );
}
