use {
    anchor_lang::prelude::*,
    std::{
        collections::BTreeMap
    },
    borsh::{BorshDeserialize, BorshSerialize}
};

declare_id!("99pSfskPW3xEgtFyztupL6TjeCKSRYEAe41MwGp7Su3s");

#[program]
pub mod solana_privatesale {
    use super::*;

    pub fn create_whitelist_count(ctx: Context<WhitelistCountContext>, whitelistcount_account_bump: u8) -> ProgramResult {
        let authority = &ctx.accounts.authority;
        require!(*authority.key == admin::ID, ErrorCode::OnlyAdmin);

        let whitelist_count = &mut ctx.accounts.whitelist_count;
        whitelist_count.count = 0;

        Ok(())
    }

    pub fn new_whitelist(ctx: Context<NewWhitelist>, whitelist_account_bump: u8) -> ProgramResult {
        let admin = &ctx.accounts.authority;
        require!(*admin.key == admin::ID, ErrorCode::OnlyAdmin);

        let whitelist_count = &mut ctx.accounts.whitelist_count;
        whitelist_count.count += 1;

        let new_whitelist_key = &mut ctx.accounts.new_whitelist_key;
        new_whitelist_key.id = whitelist_count.count;

        let btree = BTreeMap::<Pubkey, UserInfo>::new();
        new_whitelist_key.btree_storage = btree.try_to_vec().unwrap();

        Ok(())
    }

    pub fn insert_to_whitelist(ctx: Context<InsertToWhitelist>, pk: Pubkey, info: UserInfo) -> ProgramResult {
        let admin = &ctx.accounts.authority;
        require!(*admin.key == admin::ID, ErrorCode::OnlyAdmin);

        let whitelist_account = &mut ctx.accounts.whitelist_account;
        let mut btree: BTreeMap<Pubkey, UserInfo> = BorshDeserialize::try_from_slice(&whitelist_account.btree_storage[..]).unwrap();
        btree.insert(pk, info);

        let new_data = btree.try_to_vec().unwrap();
        require!(new_data.len() + 2 <= 10240, ErrorCode::WhitelistOverflow);

        whitelist_account.btree_storage = new_data;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(whitelistcount_account_bump: u8)]
pub struct WhitelistCountContext<'info> {
    #[account(
        init,
        seeds = [
            b"whitelistcount".as_ref(),
        ],
        bump = whitelistcount_account_bump,
        payer = authority,
        space = 16
    )]
    whitelist_count: Account<'info, WhitelistCount>,

    #[account(mut)]
    authority: Signer<'info>,

    system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(whitelist_account_bump: u8)]
pub struct NewWhitelist<'info> {
    #[account(mut)]
    authority: Signer<'info>,
    
    whitelist_count: Account<'info, WhitelistCount>,

    #[account(
        init,
        seeds = [
            b"whitelist".as_ref(),
            whitelist_count.count.to_be_bytes().as_ref()
        ],
        bump = whitelist_account_bump,
        payer = authority,
        space = 10240
    )]
    new_whitelist_key: Account<'info, Whitelist>,

    system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(pk: Pubkey, info: UserInfo)]
pub struct InsertToWhitelist<'info> {
    #[account(mut)]
    authority: Signer<'info>,

    whitelist_account: Account<'info, Whitelist>
}

// Data

#[account]
pub struct WhitelistCount {
    count: u16
}

#[account]
pub struct Whitelist {
    id: u16, // 2 bytes
    btree_storage: Vec<u8>
}

#[derive(
    anchor_lang::AnchorSerialize,
    anchor_lang::AnchorDeserialize,
    Clone
)] 
pub struct UserInfo {
    role: String,
    ref_key: Pubkey,
    other_keys: [Pubkey; 5]
}

pub mod admin {
    use anchor_lang::prelude::declare_id;

    declare_id!("4KAaX3a7eoMy9nyb2YXH3DmhrHfH8uiyHitWCM9aoi62");
}

#[error]
pub enum ErrorCode {
    #[msg("Only Admin")]
    OnlyAdmin,

    #[msg("Admin Sign Required")]
    AdminSignRequired,

    #[msg("Whitelist Overflow")]
    WhitelistOverflow
}