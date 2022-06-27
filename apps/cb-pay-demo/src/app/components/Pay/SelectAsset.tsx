import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';

const assetOptions = [
  { label: 'USDC', value: 'USDC' },
  { label: 'ETH', value: 'ETH' },
  { label: 'Alchemix ALCX', value: 'ALCX' },
  { label: 'Chainlink LINK', value: 'LINK' },
  { label: 'Tether USDT', value: 'USDT' },
  { label: 'DAI', value: 'DAI' },
  { label: 'Decentraland MANA', value: 'MANA' },
  { label: 'Uniswap UNI', value: 'UNI' },
  { label: 'The Sandbox SAND', value: 'SAND' },
  { label: 'Orca ORCA', value: 'ORCA' },
  { label: 'Stepn GMT', value: 'GMT' },
  { label: 'Bonfida FIDA', value: 'FIDA' },
  { label: 'Ethereum Name Service ENS', value: 'ENS' },
];

export const SelectAssets = ({
  selectedAssets,
  setSelectedAssets,
}: {
  selectedAssets: string[];
  setSelectedAssets: (a: string[]) => void;
}) => {
  return (
    <FormControl fullWidth sx={{ m: 1 }}>
      <InputLabel id="assets-select=label">Assets</InputLabel>
      <Select
        labelId="assets-select-label"
        value={selectedAssets}
        label="Assets"
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
