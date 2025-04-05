import wallet from "../wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createGenericFile, createGenericFileFromBrowserFile, createSignerFromKeypair, signerIdentity } from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFile } from "fs/promises";

// Create a devnet connection
const umi = createUmi('https://api.devnet.solana.com');
//  const umi=createUmi("https://turbine-solanad-4cde.devnet.rpcpool.com/168dd64f-ce5e-4e19-a836-f6482ad6b396");

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

//  umi.use(irysUploader());
umi.use(irysUploader());
umi.use(signerIdentity(signer));

(async () => {
    try {
       const imageBuffer = await readFile("./jefff.png");
       const image = new File([imageBuffer], "image.png", { type: "image/png" });
       const file = await createGenericFileFromBrowserFile(image);
       const [myUri] = await umi.uploader.upload([file]);
       console.log("Image URI:", myUri);
    }
    catch(error) {
        console.log("Oops.. Something went wrong", error);
    }
})();
