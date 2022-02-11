import * as anchor from "@project-serum/anchor";
import { SolanaPrivatesale } from "../target/types/solana_privatesale";
import dotenv from 'dotenv';

dotenv.config();
const PROGRAM_ID = '99pSfskPW3xEgtFyztupL6TjeCKSRYEAe41MwGp7Su3s';
const AUTHORITY = new anchor.web3.PublicKey('4KAaX3a7eoMy9nyb2YXH3DmhrHfH8uiyHitWCM9aoi62');

export function getProgram(
    provider: anchor.Provider
  ): anchor.Program<SolanaPrivatesale> {
    const idl = require("../target/idl/solana_privatesale.json");
    const programID = new anchor.web3.PublicKey(PROGRAM_ID);
    return new anchor.Program(idl, programID, provider);
}

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
  
  const txHash = await program.rpc.newWhitelist(
    accountBump, 
    {
      accounts: {
        whitelistCount: account,
        authority: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      }
    }
  );
}

async function main() {
    const provider = anchor.Provider.env(); 
    const program = getProgram(provider);
    // console.dir(program, { depth: null });
    // await createWhitelistCount(program, provider);

    
}

main()