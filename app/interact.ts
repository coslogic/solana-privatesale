import * as anchor from "@project-serum/anchor";
import { SolanaPrivatesale } from '../target/types/solana_privatesale';
import dotenv from 'dotenv';
import { getProgram, getProvider } from './util';
import { deserializeWhitelistCount, deserializeWhitelist } from './serialize';

dotenv.config();

//!FIXME: custom things, you can change
const PROGRAM_ID = new anchor.web3.PublicKey('99pSfskPW3xEgtFyztupL6TjeCKSRYEAe41MwGp7Su3s');
const AUTHORITY = new anchor.web3.PublicKey('4KAaX3a7eoMy9nyb2YXH3DmhrHfH8uiyHitWCM9aoi62');
const WHITELISTCOUNT = new anchor.web3.PublicKey('78twiLSpovbeKg42diix5JEMiWRrEPqFuX9Eiaw2QyKr')
const WHITELIST1 = new anchor.web3.PublicKey('68NoM251KZTvkK6PcuSDHAPcYnCwfbY9jyqghjNmbBBJ');

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

async function newWhitelist(
  connection: anchor.web3.Connection,
  provider: anchor.Provider,
  program: anchor.Program<SolanaPrivatesale>
) {
  const whitelistCount = await deserializeWhitelistCount(connection, program, WHITELISTCOUNT);
  const [account, accountBump] =
    await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("whitelist"),
        Buffer.from(Buffer.alloc(2, whitelistCount.count))
      ],
      PROGRAM_ID
    );
  
  console.log(`pubkey of whitelist#${whitelistCount.count+1}: ${account.toBase58()}`);

  return program.rpc.newWhitelist(accountBump, {
    accounts: {
      authority: provider.wallet.publicKey,
      whitelistCount: WHITELISTCOUNT,
      newWhitelistKey: account,
      systemProgram: anchor.web3.SystemProgram.programId
    }
  });
}

async function insertToWhitelist(
  connection: anchor.web3.Connection,
  provider: anchor.Provider,
  program: anchor.Program<SolanaPrivatesale>
) {
  const randomUser = new anchor.web3.Account();
  const randomRef = new anchor.web3.Account();
  return program.rpc.insertToWhitelist(
    randomUser.publicKey,
    {
      role: 'Community',
      refKey: randomRef.publicKey,
      otherKeys: [randomRef.publicKey, randomRef.publicKey, randomRef.publicKey, randomRef.publicKey, randomRef.publicKey]
    }, 
    {
      accounts: {
        authority: provider.wallet.publicKey,
        whitelistAccount: WHITELIST1
      }
    }
  )
}

async function main() {
  const connection = new anchor.web3.Connection(
    "http://localhost:8899",
    anchor.Provider.defaultOptions().preflightCommitment
  );

  const provider = getProvider(
    connection,
    anchor.web3.Keypair.fromSecretKey(new Uint8Array([33, 45, 48, 147, 191, 228, 184, 106, 236, 206, 197, 124, 6, 35, 162, 197, 187, 81, 4, 41, 208, 103, 28, 178, 175, 176, 120, 238, 98, 191, 223, 98, 49, 58, 88, 88, 199, 170, 197, 247, 95, 171, 16, 86, 152, 1, 243, 23, 19, 122, 156, 67, 27, 80, 99, 11, 190, 113, 218, 253, 236, 6, 74, 167]))
  );
  const program = getProgram(provider);

  //TODO: 1st step
  // const txHash0 = await createWhitelistCount(program, provider);
  // console.log(txHash0);

  //TODO: 2nd step
  // const txHash1 = await newWhitelist(connection, provider, program);
  // console.log(txHash1);
  
    // const txHash2 = await insertToWhitelist(connection, provider, program);
    // console.log(txHash2);

  const x = await deserializeWhitelistCount(connection, program, WHITELISTCOUNT);
  console.log(x);
}

main()
