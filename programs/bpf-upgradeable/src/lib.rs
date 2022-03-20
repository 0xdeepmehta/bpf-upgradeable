use anchor_lang::prelude::*;

declare_id!("DED2wtm71F5mnHPWUL3K2kM3H5EL461qC44ZBhcBXj5d");

#[program]
pub mod bpf_upgradeable {
    use super::*;

    pub fn set_admin_settings(ctx: Context<SetAdminSettings>) -> Result<()> {
        ctx.accounts.settings.admin_data = 4;
        Ok(())
    }
}


#[account]
pub struct Settings {
    admin_data: u64,
}

impl Settings {
    pub const LEN: usize = 8;
}

#[error_code]
pub enum CustomError {
    InvalidProgramDataAddress,
    AccountNotProgram,
    AccountNotBpfUpgradableProgram,
}


#[derive(Accounts)]
pub struct SetAdminSettings<'info> {
    #[account(init, payer = authority, space = Settings::LEN + 8)]
    pub settings: Account<'info, Settings>,
    #[account(mut)]
    pub authority: Signer<'info>,

    // Account of the currently executing program
    #[account(constraint = program.programdata_address() == Some(program_data.key()))]
    pub program: Program<'info, crate::program::BpfUpgradeable>, 

    // ProgramData Account of Program
    #[account(constraint = program_data.upgrade_authority_address == Some(authority.key()))]
    pub program_data: Account<'info, ProgramData>,
    pub system_program: Program<'info, System>,

}
