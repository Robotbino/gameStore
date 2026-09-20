import { AVATAR_PRESETS } from "./avatarPresets";
import AvatarMark from "./AvatarMark";

interface AvatarPickerProps {
  /** Currently chosen preset id, or null for the initial-circle fallback. */
  value: string | null;
  onChange: (avatarKey: string | null) => void;
  /** Used to render the "no preset" option's initial. */
  name: string;
  disabled?: boolean;
}

/**
 * A radio group, not a listbox: choosing an avatar is picking one of a small
 * set of visible options, which is what radios are for. Rendering it as real
 * <input type="radio"> elements (visually hidden, styled through their labels)
 * means arrow-key navigation, the roving tab stop, and screen-reader group
 * semantics all come from the platform instead of being reimplemented.
 *
 * The first option clears the choice rather than being a thirteenth mark — the
 * initial circle is a legitimate destination, not just what you get before you
 * decide.
 */
export default function AvatarPicker({
  value,
  onChange,
  name,
  disabled = false,
}: AvatarPickerProps) {
  return (
    <fieldset className="avatar-picker" disabled={disabled}>
      <legend className="form-label">Avatar</legend>

      <div className="avatar-picker-grid">
        <label
          className={`avatar-option${value === null ? " is-selected" : ""}`}
          title="Your initial"
        >
          <input
            type="radio"
            name="avatarKey"
            value=""
            checked={value === null}
            onChange={() => onChange(null)}
          />
          <AvatarMark avatarKey={null} name={name} size="44px" />
          <span className="sr-only">Your initial</span>
        </label>

        {AVATAR_PRESETS.map((preset) => (
          <label
            key={preset.id}
            className={`avatar-option${value === preset.id ? " is-selected" : ""}`}
            title={preset.label}
          >
            <input
              type="radio"
              name="avatarKey"
              value={preset.id}
              checked={value === preset.id}
              onChange={() => onChange(preset.id)}
            />
            <AvatarMark avatarKey={preset.id} name={name} size="44px" />
            <span className="sr-only">{preset.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
