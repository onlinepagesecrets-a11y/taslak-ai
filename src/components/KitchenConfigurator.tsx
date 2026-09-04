"use client";

import {
  CABINET_STYLES,
  COUNTERTOPS,
  EQUIPMENT_POSITIONS,
  HANDLE_STYLES,
  type EquipmentPosition,
  type KitchenConfig,
} from "@/lib/kitchenOptions";
import ColorPicker from "@/components/ColorPicker";

type Props = {
  value: KitchenConfig;
  onChange: (next: KitchenConfig) => void;
};

const EQUIPMENT_ROWS: {
  key: "hobPosition" | "sinkPosition" | "ovenPosition" | "dishwasherPosition";
  label: string;
}[] = [
  { key: "hobPosition", label: "Ocak" },
  { key: "sinkPosition", label: "Evye" },
  { key: "ovenPosition", label: "Fırın" },
  { key: "dishwasherPosition", label: "Bulaşık Makinesi" },
];

export default function KitchenConfigurator({ value, onChange }: Props) {
  function set<K extends keyof KitchenConfig>(key: K, val: KitchenConfig[K]) {
    onChange({ ...value, [key]: val });
  }

  return (
    <div className="configurator">
      <section className="config-section">
        <span className="config-label">Kapak Stili</span>
        <div className="chip-row">
          {CABINET_STYLES.map((s) => (
            <button
              key={s.id}
              type="button"
              className={`chip${value.cabinetStyle === s.id ? " chip--selected" : ""}`}
              title={s.hint}
              onClick={() => set("cabinetStyle", s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </section>

      <section className="config-section">
        <span className="config-label">Dolap Rengi</span>
        <ColorPicker
          hex={value.cabinetColorHex}
          onChange={(hex, name) => onChange({ ...value, cabinetColorHex: hex, cabinetColorName: name })}
        />
      </section>

      <section className="config-section">
        <span className="config-label">Kulp</span>
        <div className="chip-row">
          {HANDLE_STYLES.map((h) => (
            <button
              key={h.id}
              type="button"
              className={`chip${value.handleStyle === h.id ? " chip--selected" : ""}`}
              onClick={() => set("handleStyle", h.id)}
            >
              {h.label}
            </button>
          ))}
        </div>
      </section>

      <section className="config-section">
        <span className="config-label">Tezgah</span>
        <div className="chip-row">
          {COUNTERTOPS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`chip${value.countertop === c.id ? " chip--selected" : ""}`}
              onClick={() => set("countertop", c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>
      </section>

      <section className="config-section">
        <span className="config-label">Detaylar</span>
        <div className="toggle-row">
          <label className="toggle">
            <input
              type="checkbox"
              checked={value.glassDisplay}
              onChange={(e) => set("glassDisplay", e.target.checked)}
            />
            Cam vitrinli üst dolap
          </label>
          <label className="toggle">
            <input
              type="checkbox"
              checked={value.underCabinetLighting}
              onChange={(e) => set("underCabinetLighting", e.target.checked)}
            />
            Alt aydınlatma (LED)
          </label>
        </div>
      </section>

      <section className="config-section">
        <span className="config-label">Ekipman Yerleşimi</span>
        <div className="equipment-grid">
          {EQUIPMENT_ROWS.map((row) => (
            <div className="equipment-row" key={row.key}>
              <span className="equipment-name">{row.label}</span>
              <div className="segmented">
                {EQUIPMENT_POSITIONS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    className={`segment${value[row.key] === p.id ? " segment--selected" : ""}`}
                    onClick={() => set(row.key, p.id as EquipmentPosition)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="config-section">
        <span className="config-label">Ek İstek (opsiyonel)</span>
        <input
          className="prompt-input"
          type="text"
          placeholder="örn. 'ada tezgah ekle', 'bitki dekorasyonu olsun'"
          value={value.extraRequest}
          onChange={(e) => set("extraRequest", e.target.value)}
        />
      </section>
    </div>
  );
}
