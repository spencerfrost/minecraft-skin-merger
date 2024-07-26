import PropTypes from 'prop-types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const skinParts = [
  "Head",
  "Hat",
  "Body",
  "Jacket",
  "Left Arm",
  "Left Sleeve",
  "Right Arm",
  "Right Sleeve",
  "Left Leg",
  "Left Pant",
  "Right Leg",
  "Right Pant",
];

const SkinPartSelector = ({ skins, selectedParts, onPartSelection }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
      {skinParts.map((part) => (
        <div key={part} className="skin-part-selector">
          <label htmlFor={`select-${part}`} className="select-label">{part}</label>
          <Select
            id={`select-${part}`}
            value={selectedParts[part]?.toString()}
            onValueChange={(value) => onPartSelection(part, parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Select ${part}`} />
            </SelectTrigger>
            <SelectContent>
              {skins.map((skin, index) => (
                <SelectItem key={`skin-${skin || index}`} value={index.toString()} disabled={!skin}>
                  Skin {index + 1}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
};

SkinPartSelector.propTypes = {
  skins: PropTypes.array.isRequired,
  selectedParts: PropTypes.object.isRequired,
  onPartSelection: PropTypes.func.isRequired,
};

export default SkinPartSelector;
