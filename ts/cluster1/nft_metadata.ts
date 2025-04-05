import wallet from "./wallet/turbin3-wallet.json"
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

        const image = "https://devnet.irys.xyz/Fo8VaGFAxucbBzJzP6J3TV6hRMT22aFvaMBhbpNZ7xYs";

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
            category: "image",
            creators: [
              {
                address: "C4CvAsd3g3TT2vSEjYGCaVzq2kyXd7nsjjK2JU7MUDvp",  // Replace with your actual wallet address
                share: 100
              }
            ]
          }
        };
        
        const metadataFile = createGenericFile(
            Buffer.from(JSON.stringify(metadata)),
            "metadata.json"
          );
      
          // Upload JSON metadata and get URI
          const [uri] = await umi.uploader.uploadJson([metadataFile]);
        console.log("Your metadata URI: ", uri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
