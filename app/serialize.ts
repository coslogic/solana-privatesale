import { serialize, deserialize, deserializeUnchecked } from 'borsh';
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { SolanaPrivatesale } from "../target/types/solana_privatesale";

export async function deserializeWhitelistCount(
    connection: anchor.web3.Connection,
    program: anchor.Program<SolanaPrivatesale>,
    pubkey: anchor.web3.PublicKey
) {
    const deData = await program.account.whitelistCount.fetch(pubkey);
    return deData;
}