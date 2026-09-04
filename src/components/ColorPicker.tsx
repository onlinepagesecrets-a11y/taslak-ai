"use client";

import { COLOR_PALETTE, isValidHex } from "@/lib/colorPalette";

type Props = {
  hex: string;
  onChange: (hex: string, name: string | null) => void;
};

export default function ColorPicker({ hex, onChange }: Props) {
  return (
    <div className="palette-row">
      {COLOR_PALETTE.map((c) => (
        <button
          key={c.hex}
          type="button"
          className={`swatch${hex.toLowerCase() === c.hex.toLowerCase() ? " swatch--selected" : ""}`}
          style={{ background: c.hex }}
          title={c.name}
          onClick={() => onChange(c.hex, c.name)}
        />
      ))}
      <label className="color-input">
        <input
          type="color"
          value={isValidHex(hex) ? hex : "#D9CDBB"}
          onChange={(e) => onChange(e.target.value, null)}
        />
      </label>
      <input
        className="hex-input"
        type="text"
        value={hex}
        onChange={(e) => onChange(e.target.value, null)}
        placeholder="#D9CDBB"
      />
    </div>
  );
}
