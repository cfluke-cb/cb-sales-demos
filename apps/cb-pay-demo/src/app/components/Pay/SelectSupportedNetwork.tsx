import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';

const assetOptions = [
  { label: 'ethereum', value: 'ethereum' },
  { label: 'polygon', value: 'polygon' },
  { label: 'solana', value: 'solana' },
];

export const SelectSupportedNetwork = ({
  selectedAssets,
  setSelectedAssets,
}: {
  selectedAssets: string[];
  setSelectedAssets: (a: string[]) => void;
}) => {
  return (
    <FormControl fullWidth sx={{ m: 1 }}>
      <InputLabel id="supp-network-select-label">Supported Network</InputLabel>
      <Select
        labelId="supp-network-select-label"
        value={selectedAssets}
        label="Supported Network"
        multiple
        onChange={(e) => {
          setSelectedAssets(
            typeof e.target.value === 'string'
              ? e.target.value.split(',')
              : e.target.value
          );
        }}
      >
        {assetOptions.map((c) => (
          <MenuItem value={c.value}>{c.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
