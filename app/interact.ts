import * as anchor from "@project-serum/anchor";
import { SolanaPrivatesale } from "../target/types/solana_privatesale";
import dotenv from 'dotenv';

dotenv.config();
const PROGRAM_ID = '99pSfskPW3xEgtFyztupL6TjeCKSRYEAe41MwGp7Su3s';
const AUTHORITY = new anchor.web3.PublicKey('4KAaX3a7eoMy9nyb2YXH3DmhrHfH8uiyHitWCM9aoi62');

async function createWhitelistCount(
    program: anchor.Program<SolanaPrivatesale>,
    provider: anchor.Provider
  ) {
  const [account, accountBump] = 
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('whitelistcount')
      ],
      program.programId
    );
  
  console.log(`pubkey of WhitelistCount: ${account.toBase58()}`);
  
  return program.rpc.createWhitelistCount(accountBump, {
    accounts: {
      whitelistCount: account,
      authority: provider.wallet.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    }
  });
}

async function main() {
  const connection = new anchor.web3.Connection(
    "http://localhost:8899",
    anchor.Provider.defaultOptions().preflightCommitment
  );

  const provider = getProvider(
    connection, 
    anchor.web3.Keypair.fromSecretKey(new Uint8Array([33,45,48,147,191,228,184,106,236,206,197,124,6,35,162,197,187,81,4,41,208,103,28,178,175,176,120,238,98,191,223,98,49,58,88,88,199,170,197,247,95,171,16,86,152,1,243,23,19,122,156,67,27,80,99,11,190,113,218,253,236,6,74,167]))
  );
  
  const program = getProgram(provider);
  const txHash = await createWhitelistCount(program, provider);
  console.log(txHash);
    
}

main()

export function getProgram(
  provider: anchor.Provider
): anchor.Program<SolanaPrivatesale> {
  const idl = require("../target/idl/solana_privatesale.json");
  const programID = new anchor.web3.PublicKey(PROGRAM_ID);
  return new anchor.Program(idl, programID, provider);
}

export function getProvider(
  connection: anchor.web3.Connection,
  keypair: anchor.web3.Keypair
): anchor.Provider {
  // @ts-expect-error
  const wallet = new anchor.Wallet(keypair);
  return new anchor.Provider(
    connection,
    wallet,
    anchor.Provider.defaultOptions()
  );
}