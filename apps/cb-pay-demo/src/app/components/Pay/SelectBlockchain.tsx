import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';
export type SupportedBlockchains =
  | 'algorand'
  | 'avalanche-c-chain'
  | 'bitcoin'
  | 'bitcoin-cash'
  | 'cardano'
  | 'celo'
  | 'cosmos'
  | 'dash'
  | 'dfinity'
  | 'dogecoin'
  | 'eos'
  | 'ethereum'
  | 'ethereum-classic'
  | 'filecoin'
  | 'horizen'
  | 'litecoin'
  | 'polkadot'
  | 'polygon'
  | 'solana'
  | 'stellar'
  | 'tezos'
  | 'zcash';

const blockchainOptions = [
  { label: 'Algorand', value: 'algorand' },
  { label: 'Avalanche C-chain', value: 'avalanche-c-chain' },
  { label: 'Bitcoin', value: 'bitcoin' },
  { label: 'Bitcoin Cash', value: 'bitcoin-cash' },
  { label: 'Cardano', value: 'cardano' },
  { label: 'Celo', value: 'celo' },
  { label: 'Cosmos', value: 'cosmos' },
  { label: 'Dash', value: 'dash' },
  { label: 'Dfinity', value: 'dfinity' },
  { label: 'Dogecoin', value: 'dogecoin' },
  { label: 'EOS', value: 'eos' },
  { label: 'Ethereum', value: 'ethereum' },
  { label: 'Ethereum Classic', value: 'ethereum-classic' },
  { label: 'Filecoin', value: 'filecoin' },
  { label: 'Flow', value: 'flow' },
  { label: 'Horizen', value: 'horizen' },
  { label: 'Litecoin', value: 'litecoin' },
  { label: 'Polkadot', value: 'polkadot' },
  { label: 'Polygon', value: 'polygon' },
  { label: 'Solana', value: 'solana' },
  { label: 'Stellar', value: 'stellar' },
  { label: 'Tezos', value: 'tezos' },
  { label: 'Zcash', value: 'zcash' },
];

export const SelectBlockchain = ({
  selectedBlockchains,
  setSelectedBlockchains,
}: {
  selectedBlockchains: SupportedBlockchains[];
  setSelectedBlockchains: (a: SupportedBlockchains[]) => void;
}) => {
  return (
    <FormControl fullWidth sx={{ m: 1 }}>
      <InputLabel id="blockchain-select=label">Blockchains</InputLabel>
      <Select
        labelId="blockchain-select-label"
        value={selectedBlockchains}
        label="Blockchain"
        multiple
        onChange={(e) => {
          setSelectedBlockchains(
            typeof e.target.value === 'string'
              ? (e.target.value.split(',') as SupportedBlockchains[])
              : e.target.value
          );
        }}
      >
        {blockchainOptions.map((c) => (
          <MenuItem value={c.value}>{c.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
