import { Commitment, Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, sendAndConfirmTransaction, Transaction } from "@solana/web3.js"
import wallet from "./wallet/turbin3-wallet.json";
import { createTransferInstruction, getOrCreateAssociatedTokenAccount, transfer } from "@solana/spl-token";

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

// Mint address
const mint =  new PublicKey("9jqRxQYVku8NSUhSorQ3gN27S5qdBBKDbLvY6YQ8ZHuC");

// Recipient address
const to = new PublicKey("57gWoxs5JqHwzDa2YTDiuVrA19ZkCMRhEQ6MHUbAoJLj");

(async () => {
    try {
        // Get the token account of the fromWallet address, and if it does not exist, create it

        // Get the token account of the toWallet address, and if it does not exist, create it
        const fromTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,       // payer
            mint,             // token mint
            keypair.publicKey // owner of the token
          );
          
          const toTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            keypair,        // payer
            mint,              // token mint
            to  // receiver
          );

        // Transfer the new token to the "toTokenAccount" we just created
        const transaction = new Transaction().add(
            createTransferInstruction(
              fromTokenAccount.address,
              toTokenAccount.address,
              keypair.publicKey,
              1000  // = 10 tokens with 100 decimals
            ),
          );
         const result= await sendAndConfirmTransaction(connection, transaction, [keypair]);
         console.log(result)

    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();