import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { findProgramAddressSync } from "@project-serum/anchor/dist/cjs/utils/pubkey";
import { BpfUpgradeable } from "../target/types/bpf_upgradeable";

describe("bpf-upgradeable", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.BpfUpgradeable as Program<BpfUpgradeable>;
  const programDataAddress = findProgramAddressSync([program.programId.toBytes()], new anchor.web3.PublicKey("BPFLoaderUpgradeab1e11111111111111111111111"))[0]

  console.log("Program ID ", program.programId.toBase58());
  console.log("Program Data Account :: ", programDataAddress.toBase58())

  it("Is initialized!", async () => {

    // const hello = (await anchor.web3.PublicKey.findProgramAddress([program.programId.toBytes()], new anchor.web3.PublicKey("BPFLoaderUpgradeab1e11111111111111111111111")))[0]
    // console.log("ASYNC Program Data Account :: ", hello.toBase58())


    // new account for setting account
    const setting = anchor.web3.Keypair.generate();

    // Add your test here.
    const tx = await program.rpc.setAdminSettings({
      accounts: {
        settings: setting.publicKey,
        authority: program.provider.wallet.publicKey,
        program: program.programId,
        programData: programDataAddress,
        systemProgram: anchor.web3.SystemProgram.programId
      },
      signers: [setting]
    });
    console.log("Your transaction signature", tx);


    // fetch the data inside the account
    const settingData = await program.account.settings.fetch(setting.publicKey);
    console.log("admin_data inside the settting account :: ", settingData.adminData.toNumber());
  });
});
