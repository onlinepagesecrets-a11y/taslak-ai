"use client";

import { ROOM_TYPES, type RoomType } from "@/lib/promptTemplates";

type Props = {
  value: RoomType;
  onChange: (value: RoomType) => void;
};

export default function RoomTypePicker({ value, onChange }: Props) {
  return (
    <div className="room-types" role="radiogroup" aria-label="Oda tipi">
      {ROOM_TYPES.map((room) => (
        <button
          key={room.id}
          type="button"
          role="radio"
          aria-checked={value === room.id}
          className={`chip${value === room.id ? " chip--selected" : ""}`}
          onClick={() => onChange(room.id)}
        >
          {room.label}
        </button>
      ))}
    </div>
  );
}
