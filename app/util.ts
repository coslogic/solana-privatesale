import * as anchor from "@project-serum/anchor";
import { SolanaPrivatesale } from "../target/types/solana_privatesale";

const PROGRAM_ID = '99pSfskPW3xEgtFyztupL6TjeCKSRYEAe41MwGp7Su3s';

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