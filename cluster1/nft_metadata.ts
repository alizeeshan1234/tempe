import wallet from "../wallet.json"
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
        // Follow this JSON structure
        // https://docs.metaplex.com/programs/token-metadata/changelog/v1.0#json-structure

        const image = "https://devnet.irys.xyz/gdt8bKX4sCKatVtwimG2pxupYPWhwDq8qo4QLiRrkr9";

        const metadata = {
          name: "Solan",
          symbol: "@#$", // This is optional, keep if relevant
          description: "It's my first Solana NFT!",
          image: image,
          attributes: [
            {
              trait_type: "Special",
              value: "First Mint"
            }
          ],
          properties: {
            files: [
              {
                uri: image,
                type: "image/png"
              }
            ],
            creators: [
              {
                address: "C4CvAsd3g3TT2vSEjYGCaVzq2kyXd7nsjjK2JU7MUDvp",  // Replace with your actual wallet address
                share: 100
              }
            ]
          }
        };
        
        const uri = await umi.uploader.uploadJson(metadata);
        console.log("Your metadata URI: ", uri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
