import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';
export type Experience = 'embedded' | 'popup' | 'new_tab';

const expOptions = [
  { label: 'Embedded', value: 'embedded' },
  { label: 'Pop-up', value: 'popup' },
  { label: 'New Tab', value: 'new_tab' },
];

export const SelectExperience = ({
  experience,
  setExperience,
}: {
  experience: Experience;
  setExperience: (a: Experience) => void;
}) => {
  return (
    <FormControl fullWidth sx={{ m: 1 }}>
      <InputLabel id="blockchain-select=label">Experience</InputLabel>
      <Select
        labelId="experience-select-label"
        value={experience}
        label="Experience"
        onChange={(e) => {
          setExperience(e.target.value as Experience);
        }}
      >
        {expOptions.map((c) => (
          <MenuItem value={c.value}>{c.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
