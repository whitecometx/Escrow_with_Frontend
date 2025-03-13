#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod Escrow2 {
    use super::*;

  pub fn close(_ctx: Context<CloseEscrow2>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.Escrow2.count = ctx.accounts.Escrow2.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.Escrow2.count = ctx.accounts.Escrow2.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeEscrow2>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.Escrow2.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeEscrow2<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Escrow2::INIT_SPACE,
  payer = payer
  )]
  pub Escrow2: Account<'info, Escrow2>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseEscrow2<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub Escrow2: Account<'info, Escrow2>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub Escrow2: Account<'info, Escrow2>,
}

#[account]
#[derive(InitSpace)]
pub struct Escrow2 {
  count: u8,
}
