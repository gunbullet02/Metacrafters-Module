// Import Solana web3 functionalities
const {
    Connection,
    PublicKey,
    clusterApiUrl,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmRawTransaction,
    sendAndConfirmTransaction
} = require("@solana/web3.js");



// Generated a new pair for array values
//const newPair = Keypair.generate();
//console.log(newPair);


const DEMO_FROM_SECRET_KEY = new Uint8Array(
[
    86, 147, 127, 82, 252, 139, 122, 54, 115, 111, 123,
    252, 93, 99, 154, 104, 172, 166, 250, 153, 161, 104,
    102, 25, 181, 144, 44, 241, 248, 132, 215, 187, 125,
    209, 23, 107, 33, 140, 133, 240, 16, 79, 26, 131,
    88, 242, 198, 185, 145, 249, 2, 86, 112, 33, 142,
    47, 64, 16, 71, 81, 212, 212, 40, 166 ] 

);

const dropSol = async() => {
    try{

        const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

        // Get Keypair from Secret Key
        var senderWallet = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);
        
         // Other things to try: 
         // 1) Form array from userSecretKey
         // const from = Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
         // 2) Make a new Keypair (starts with 0 SOL)
         // const from = Keypair.generate();    
        // Airdrop 2 SOL to Sender wallet
        
        console.log('Airdopping some SOL to Sender wallet: ${senderWallet.publicKey}');
        const fromAirDropSignature = await connection.requestAirdrop(
            new PublicKey(senderWallet.publicKey),
            2 * LAMPORTS_PER_SOL
        );

        await connection.confirmTransaction(fromAirDropSignature);
    
        } catch (err){
          console.log(err);
    } 
};

    const showWalletBalance = async () => {

        try{

            const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

            const senderWallet = await Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);
            
            const currentBalance = await connection.getBalance(
                new PublicKey(senderWallet.publicKey)
            );

            console.log(
                'The wallet current balance is: ${parseInt(currentBalance) / LAMPORTS_PER_SOL} SOL'
            );

            return currentBalance;
        } 
            catch(err){
            console.log(err);
            return 0;
    }
};

const moveSol = async() => {

    const currentBalance = await showWalletBalance();

    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    var from = Keypair.fromSecretKey(DEMO_FROM_SECRET_KEY);

    const to = Keypair.generate();


    // Send money from "from" wallet and into "to" wallet
    var transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: from.publicKey,
            toPubkey: to.publicKey,
            lamports: currentBalance / 2,
        })
    );

    // Sign transaction
    var signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [from]
    );
    console.log('Signature is ', signature);
}

const main = async() => {
    await dropSol();
    await moveSol();
    await showWalletBalance();
};

main();
