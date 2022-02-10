import * as anchor from "@project-serum/anchor";
import { SolanaPrivatesale } from "../target/types/solana_privatesale";

import dotenv from 'dotenv';

dotenv.config();

export function getProgram(
    provider: anchor.Provider
  ): anchor.Program<SolanaPrivatesale> {
    const idl = require("../target/idl/solana_privatesale.json");
    const programID = new anchor.web3.PublicKey('99pSfskPW3xEgtFyztupL6TjeCKSRYEAe41MwGp7Su3s');
    return new anchor.Program(idl, programID, provider);
}

async function main() {
    const provider = anchor.Provider.env(); 
    const program = getProgram(provider);
    // console.log(program);

    
}

main()