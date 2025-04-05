import wallet from "./wallet/turbin3-wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { 
    createMetadataAccountV3, 
    CreateMetadataAccountV3InstructionAccounts, 
    CreateMetadataAccountV3InstructionArgs,
    DataV2Args,
    MPL_TOKEN_METADATA_PROGRAM_ID,
    UpdateMetadataAccountV2InstructionAccounts
} from "@metaplex-foundation/mpl-token-metadata";
import { createSignerFromKeypair, signerIdentity, publicKey } from "@metaplex-foundation/umi";
import { bs58 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";

import { PublicKey } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

// Define our Mint address
const mint = new PublicKey("EULqegYpciqpoCmBTaMz8wwKKSPkerPbbhhjHMTzQMxx")
const mint_umi=publicKey("9jqRxQYVku8NSUhSorQ3gN27S5qdBBKDbLvY6YQ8ZHuC");
// const mint = new PublicKey("EULqegYpciqpoCmBTaMz8wwKKSPkerPbbhhjHMTzQMxx");

// Create a UMI connection
const umi = createUmi('https://api.devnet.solana.com');
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(createSignerFromKeypair(umi, keypair)));

const [pda,bump]=PublicKey.findProgramAddressSync([Buffer.from("metadata"),mint.toBuffer()],TOKEN_PROGRAM_ID);
(async () => {
    try {
        // Start here
        let accounts: CreateMetadataAccountV3InstructionAccounts = {
            mint:mint_umi,
            mintAuthority:signer,
        }
        

        let data: DataV2Args = {
            name:"chintu",
            symbol:"~",
            uri:"",
            sellerFeeBasisPoints:100,
            creators:null,
            collection:null,
            uses:null
        }

        let args: CreateMetadataAccountV3InstructionArgs = {
            data:data,
            isMutable:false,
            collectionDetails:null
        }

        let tx = createMetadataAccountV3(
            umi,
            {
                ...accounts,
                ...args
            }
        )

        let result = await tx.sendAndConfirm(umi);
        console.log(bs58.encode(result.signature));
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();
