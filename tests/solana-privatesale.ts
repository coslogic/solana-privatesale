import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { SolanaPrivatesale } from '../target/types/solana_privatesale';

describe('solana-privatesale', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.SolanaPrivatesale as Program<SolanaPrivatesale>;

  it('', async () => {
    
  });
});
